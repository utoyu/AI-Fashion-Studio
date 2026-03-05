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
        const { garmentUrl, modelUrl, category = "General Fashion" } = await request.json();

        console.log("[Generate API] Started with category:", category);

        // 1. Construct garment description based on category
        let garment_description = `A ${category} item`;
        const lowerCat = category.toLowerCase();
        if (lowerCat.includes("suit") || lowerCat.includes("business") || lowerCat.includes("formal") || lowerCat.includes("set")) {
            garment_description += ", sharp edges, formal tailoring, high structural integrity, premium wool texture";
        } else if (lowerCat.includes("outerwear") || lowerCat.includes("jacket") || lowerCat.includes("coat")) {
            garment_description += ", puffy texture, outdoor style, realistic volume, high-quality material";
        } else if (lowerCat.includes("shirt") || lowerCat.includes("polo") || lowerCat.includes("top") || lowerCat.includes("knitwear")) {
            garment_description += ", refined fabric, refined tailoring, tailored fit, breathable material, modern male style";
        }

        // 2. Call Fal.ai for Virtual Try-On
        console.log("[Generate API] Calling Fal.ai idm-vton...");

        const toBase64DataUrl = async (url: string, defaultPath?: string) => {
            let targetUrl = url || defaultPath;
            if (!targetUrl) return null;
            if (targetUrl.startsWith("data:image")) return targetUrl;

            try {
                let base64: string;
                if (targetUrl.startsWith("http")) {
                    const response = await fetch(targetUrl);
                    const arrayBuffer = await response.arrayBuffer();
                    base64 = Buffer.from(arrayBuffer).toString('base64');
                } else {
                    const filePath = targetUrl.startsWith("/") ? path.join(process.cwd(), "public", targetUrl) : targetUrl;
                    if (!fs.existsSync(filePath)) {
                        if (defaultPath && targetUrl !== defaultPath) return await toBase64DataUrl(defaultPath);
                        return null;
                    }
                    base64 = fs.readFileSync(filePath).toString('base64');
                }
                return `data:image/jpeg;base64,${base64}`;
            } catch (err) {
                console.error("toBase64DataUrl error:", err);
                return null;
            }
        };

        const parsedHumanImage = await toBase64DataUrl(modelUrl, "/images/assets/model-asian.png");
        const parsedGarmentImage = await toBase64DataUrl(garmentUrl, "/images/assets/suit.png");

        if (!parsedHumanImage || !parsedGarmentImage) {
            throw new Error("Failed to load required images for generation.");
        }

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
            console.error("[Generate API] Fal.ai error:", e.body || e.message);
            throw new Error(`Fal.ai API Error: ${e.message}`);
        }

        const generatedImageUrl = (falResponse as any).images?.[0]?.url;
        if (!generatedImageUrl) {
            throw new Error("Fal.ai failed to generate an image");
        }

        // 3. Call Gemini for Marketing Copy
        let copyText = "营销文案同步中...";
        if (process.env.GEMINI_API_KEY) {
            try {
                const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

                const imageResp = await fetch(generatedImageUrl);
                const arrayBuffer = await imageResp.arrayBuffer();
                const base64Image = Buffer.from(arrayBuffer).toString('base64');

                const promptText = `Based on this fashion image and the category '${category}', write a catchy, 50-word social media marketing copy in Chinese highlighting its selling points. Output ONLY the text.`;

                const result = await ai.models.generateContent({
                    model: "gemini-1.5-flash",
                    contents: [
                        {
                            role: "user", parts: [
                                { text: promptText },
                                { inlineData: { data: base64Image, mimeType: "image/jpeg" } }
                            ]
                        }
                    ]
                });

                copyText = (result as any).text || "点击分享，开启社交矩阵创作。";
            } catch (geminiError: any) {
                console.error("[Generate API] Gemini error:", geminiError);
                copyText = "文案生成出错，请检查 Gemini API 配置。";
            }
        }

        return NextResponse.json({ success: true, imageUrl: generatedImageUrl, copyText });
    } catch (error: any) {
        console.error("[Generate API] Critical Error:", error.message || error);
        return NextResponse.json(
            { success: false, error: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
