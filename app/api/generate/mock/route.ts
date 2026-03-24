import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

/**
 * Mock Generate API - Task Submission
 * Path: /api/generate/mock
 * Purpose: Simulates submitting a heavy AI generation task and records it in DB.
 */
export async function POST(request: Request) {
    console.log("🔥 [API] REACHED /api/generate/mock");
    try {
        const body = await request.json();
        const { garmentUrl, prompt } = body;

        console.log("🚀 [API] Received mock generation request for:", garmentUrl);

        // Simulate network and processing delay
        await new Promise(resolve => setTimeout(resolve, 800));

        // 🚀 Insert real record into ai_tasks (aligned with public.ai_tasks)
        console.log("📝 [API] Inserting record into ai_tasks table...");
        const { data, error } = await supabaseAdmin
            .from('ai_tasks')
            .insert([
                {
                    status: 'processing',
                    source_image_url: garmentUrl || '',
                    task_type: 'vton',
                    prompt: prompt || '',
                    created_at: new Date().toISOString()
                }
            ])
            .select('id')
            .single();

        if (error) {
            console.error('❌ [API] Database Insert Error (ai_tasks):', error);
            return NextResponse.json({ 
                success: false, 
                error: error.message,
                code: error.code
            }, { status: 500 });
        }

        console.log("✅ [API] Task recorded successfully. ID:", data.id);

        return NextResponse.json({
            success: true,
            requestId: data.id,
            message: "Generation task submitted and recorded (MOCK)."
        });
    } catch (err: any) {
        console.error('❌ [API] Unexpected Error:', err);
        return NextResponse.json({ 
            success: false, 
            error: err.message 
        }, { status: 500 });
    }
}
