import { NextResponse } from "next/server";
import { fal } from "@fal-ai/client";
import { GoogleGenAI } from "@google/genai";
import fs from "fs";
import path from "path";
import { ProxyAgent, setGlobalDispatcher } from "undici";

// Configure global HTTP proxy for Node.js fetch (used by GoogleGenAI)
if (process.env.LOCAL_PROXY) {
    const proxyAgent = new ProxyAgent(process.env.LOCAL_PROXY);
    setGlobalDispatcher(proxyAgent);
    console.log(`[Proxy] Global undici dispatcher set to: ${process.env.LOCAL_PROXY} in /api/generate`);
}

export async function POST(request: Request) {
    try {
        const { garmentUrl, modelUrl, category } = await request.json();

        if (!garmentUrl || !category) {
            return NextResponse.json({ success: false, error: "Missing required fields: garmentUrl and category" }, { status: 400 });
        }

        console.log("[Generate API] Started with category:", category);

        // 1. Construct garment description based on category
        let garment_description = "A fashion garment";
        if (category === "Business Menswear") {
            garment_description += ", sharp edges, formal suit tailoring, high structural integrity";
        } else if (category === "Outdoor Gear") {
            garment_description += ", puffy texture, outdoor jacket, dynamic lighting, realistic volume";
        }

        // 2. Call Fal.ai for Virtual Try-On
        console.log("[Generate API] Calling Fal.ai idm-vton...");

        // Convert URLs to Base64 to bypass Fal.ai external downloading issues
        const toBase64Url = (url: string) => {
            if (url.startsWith("http")) return url;
            try {
                const filePath = path.join(process.cwd(), "public", url);
                const fileBuffer = fs.readFileSync(filePath);
                const ext = path.extname(filePath).substring(1) || 'jpeg';
                return `data:image/${ext === 'jpg' ? 'jpeg' : ext};base64,${fileBuffer.toString('base64')}`;
            } catch (err) {
                console.error("Local file read error:", err);
                return url;
            }
        };

        const parsedHumanImage = modelUrl ? toBase64Url(modelUrl) : toBase64Url("/images/feature-model.jpg");
        const parsedGarmentImage = toBase64Url(garmentUrl);

        let falResponse;
        try {
            falResponse = await fal.subscribe("fal-ai/idm-vton", {
                input: {
                    human_image_url: parsedHumanImage,
                    garment_image_url: parsedGarmentImage,
                    description: garment_description,
                },
                logs: true,
                onQueueUpdate: (update) => {
                    if (update.status === "IN_PROGRESS") {
                        update.logs.map((log) => log.message).forEach(console.log);
                    }
                },
            });
        } catch (e: any) {
            console.error("[Generate API] Fal.ai throw error body:", e.body);
            const errorMsg = e.body ? JSON.stringify(e.body) : e.message;
            throw new Error(`Fal.ai API Error: ${errorMsg}`);
        }

        const generatedImageUrl = (falResponse as any).images?.[0]?.url;
        console.log("[Generate API] Fal.ai returned image:", generatedImageUrl);

        if (!generatedImageUrl) {
            throw new Error("Fal.ai failed to generate an image");
        }

        // 3. Call Gemini for Marketing Copy
        console.log("[Generate API] Calling Gemini for marketing copy...");

        let copyText = "营销文案生成失败：系统未配置 Gemini API Key。";
        try {
            if (process.env.GEMINI_API_KEY) {
                const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

                // Fetch the generated image to send to Gemini Vision
                const imageResp = await fetch(generatedImageUrl);
                const arrayBuffer = await imageResp.arrayBuffer();
                const base64Image = Buffer.from(arrayBuffer).toString('base64');

                const prompt = `Based on this fashion image and the category '${category === "Business Menswear" ? "商务通勤男装" : "户外运动装备"}', write a catchy, 50-word social media marketing copy in Chinese highlighting its selling points. Output ONLY the text.`;

                const geminiResponse = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: [
                        prompt,
                        { inlineData: { data: base64Image, mimeType: 'image/jpeg' } }
                    ]
                });

                copyText = geminiResponse.text || copyText;
                console.log("[Generate API] Gemini returned copy:", copyText);
            } else {
                console.warn("[Generate API] GEMINI_API_KEY is completely empty. Skipping Gemini copy generation.");
            }
        } catch (geminiError) {
            console.error("[Generate API] Error generating copy with Gemini:", geminiError);
            copyText = "文案生成出错，请检查 Gemini API 配置。";
        }

        return NextResponse.json({ success: true, imageUrl: generatedImageUrl, copyText });
    } catch (error: any) {
        console.error("[Generate API] Error:", error.message || error);
        return NextResponse.json(
            { success: false, error: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
