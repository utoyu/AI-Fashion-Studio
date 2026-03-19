import os
import json
import time
import urllib.request
import urllib.parse
from uuid import uuid4
import websocket  # pip install websocket-client
from supabase import create_client, Client # pip install supabase
from dotenv import load_dotenv

# Load env variables
# Assuming this script is running from the root of the project
load_dotenv('.env.local')

SUPABASE_URL = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

if not SUPABASE_URL or not SUPABASE_SERVICE_KEY:
    print("Missing Supabase credentials. Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set.")
    exit(1)

supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

COMFYUI_SERVER_ADDRESS = "127.0.0.1:8188"
CLIENT_ID = str(uuid4())

def queue_prompt(prompt_workflow):
    p = {"prompt": prompt_workflow, "client_id": CLIENT_ID}
    data = json.dumps(p).encode('utf-8')
    req = urllib.request.Request(f"http://{COMFYUI_SERVER_ADDRESS}/prompt", data=data)
    response = urllib.request.urlopen(req)
    return json.loads(response.read())

def get_image(filename, subfolder, folder_type):
    data = {"filename": filename, "subfolder": subfolder, "type": folder_type}
    url_values = urllib.parse.urlencode(data)
    req = urllib.request.Request(f"http://{COMFYUI_SERVER_ADDRESS}/view?{url_values}")
    response = urllib.request.urlopen(req)
    return response.read()

def upload_to_supabase(image_data: bytes, task_id: str) -> str:
    # Upload local result image to Supabase storage 'ai-fashion-images' (ensure this bucket exists and is public)
    filename = f"comfyui_results/{task_id}_{int(time.time())}.png"
    try:
        response = supabase.storage.from_("ai-fashion-images").upload(
            file=image_data,
            path=filename,
            file_options={"content-type": "image/png"}
        )
        # Get public URL
        public_url = supabase.storage.from_("ai-fashion-images").get_public_url(filename)
        return public_url
    except Exception as e:
        print(f"Error uploading to Supabase: {e}")
        raise e

def process_task(task):
    task_id = task['id']
    print(f"Processing task {task_id}")
    
    # Update status to processing
    supabase.table('ai_tasks').update({'status': 'processing'}).eq('id', task_id).execute()
    
    try:
        # TODO: Construct actual ComfyUI workflow JSON here based on task parameters.
        # This is a generic logic using a placeholder workflow_api.json file.
        # You will need to export your workflow in "API format" from ComfyUI.
        try:
            with open("workflow_api.json", "r", encoding="utf-8") as f:
                workflow = json.load(f)
        except Exception:
            raise Exception("workflow_api.json not found or invalid. Please provide the ComfyUI API workflow.")
            
        # Example of how to modify workflow nodes using task parameters:
        # workflow["3"]["inputs"]["text"] = task.get("prompt", "")
        # workflow["10"]["inputs"]["image"] = task.get("source_image_url", "")
        
        # Connect to WebSocket to listen for completion events
        ws = websocket.WebSocket()
        ws.connect(f"ws://{COMFYUI_SERVER_ADDRESS}/ws?clientId={CLIENT_ID}")
        
        # Queue the job
        prompt_id = queue_prompt(workflow)['prompt_id']
        
        # Listen for workflow completion over WebSocket
        print(f"Listening for execution completion. Prompt ID: {prompt_id}")
        output_images = []
        while True:
            out = ws.recv()
            if isinstance(out, str):
                message = json.loads(out)
                if message['type'] == 'executing':
                    data = message['data']
                    if data['node'] is None and data['prompt_id'] == prompt_id:
                        break # Execution is done
            else:
                continue
                
        # Fetch generation history to find the exact output filenames
        req = urllib.request.Request(f"http://{COMFYUI_SERVER_ADDRESS}/history/{prompt_id}")
        response = urllib.request.urlopen(req)
        history = json.loads(response.read())[prompt_id]
        
        result_url = None
        for node_id in history['outputs']:
            node_output = history['outputs'][node_id]
            if 'images' in node_output:
                for image in node_output['images']:
                    # Download the image via ComfyUI API
                    image_data = get_image(image['filename'], image['subfolder'], image['type'])
                    # Upload byte data to Supabase Storage
                    result_url = upload_to_supabase(image_data, task_id)
                    break # Just take the first image for now
            if result_url:
                break
                
        if not result_url:
            raise Exception("No image was successfully retrieved after generation.")
            
        # Update task as completed with the resolved Supabase public URL
        supabase.table('ai_tasks').update({
            'status': 'completed',
            'result_image_url': result_url
        }).eq('id', task_id).execute()
        
        print(f"Task {task_id} completed. Result URL: {result_url}")
        
    except Exception as e:
        print(f"Task {task_id} failed: {e}")
        # Report failure back to the frontend through Supabase Realtime
        supabase.table('ai_tasks').update({
            'status': 'failed',
            'error_message': str(e)
        }).eq('id', task_id).execute()

def poll_tasks():
    print("ComfyUI Worker started. Polling for pending tasks...")
    while True:
        try:
            # Fetch pending tasks one by one
            response = supabase.table('ai_tasks').select('*').eq('status', 'pending').order('created_at').limit(1).execute()
            tasks = response.data
            if tasks and len(tasks) > 0:
                process_task(tasks[0])
            else:
                # Sleep a bit to prevent hammering the DB if there are no tasks
                time.sleep(2)
        except Exception as e:
            print(f"Polling error: {e}")
            time.sleep(5)

if __name__ == "__main__":
    poll_tasks()
