import { NextResponse } from "next/server";
import fetch from "node-fetch";
import { HttpsProxyAgent } from "https-proxy-agent";
import fs from "fs";
import path from "path";

export async function POST(request: Request) {
    try {
        const {
            garmentUrl,
            category = "Fashion",
            model,
            bg,
            pose,
            style,
            accessories,
            ratio,
            promptModel = "mock",
            supplementalPrompt = ""
        } = await request.json();

        console.log("[Generate Prompt API] Started with category:", category);

        if (!process.env.GEMINI_API_KEY) {
            throw new Error("Missing GEMINI_API_KEY in environment variables");
        }

        // Configure HttpsProxyAgent for node-fetch
        let proxyAgent: any = undefined;
        if (process.env.LOCAL_PROXY) {
            proxyAgent = new HttpsProxyAgent(process.env.LOCAL_PROXY);
        }

        // Helper to read local or remote file to base64
        const toBase64Image = async (url: string) => {
            if (!url) return null;
            if (url.startsWith("data:image")) return url.split(",")[1];

            try {
                if (url.startsWith("http")) {
                    const response = await fetch(url, { agent: proxyAgent });
                    const arrayBuffer = await response.arrayBuffer();
                    return Buffer.from(arrayBuffer).toString('base64');
                }
                const filePath = url.startsWith("/") ? path.join(process.cwd(), "public", url) : url;
                if (!fs.existsSync(filePath)) return null;
                const fileBuffer = fs.readFileSync(filePath);
                return fileBuffer.toString('base64');
            } catch (err) {
                console.error("toBase64Image error:", err);
                return null;
            }
        };

        const base64Data = garmentUrl ? await toBase64Image(garmentUrl) : null;

        let parts: any[] = [];
        if (base64Data) {
            parts.push({
                inlineData: { data: base64Data, mimeType: 'image/jpeg' }
            });
        }

        const systemPrompt = `
You are an expert multi-modal Fashion AI and Prompt Engineer.
${base64Data ? "LOOK at the provided garment image. Extract all precise visual features (colors, patterns, fabric textures, lapels, stitching, buttons, accessories)." : "Create a high-end fashion scene based on the following specifications."}

Combine these extracted features with the following user specifications:
- Model Type: ${model || 'Default'}
- Background Scene: ${bg || 'Default'}
- Pose/Action: ${pose || 'Default'}
- Style: ${style || 'Realistic Photography'}
- Accessories: ${accessories || 'None'}
- Category: ${category}
- Target Aspect Ratio: ${ratio || '1:1'}
- Additional Context: ${supplementalPrompt || 'None'}

Business Rule Constraints:
- If category relates to 'Suits', 'Business', 'Formal': focus on sharp edges, premium wool texture, correct lapel folds, and high-end executive lighting.
- If category relates to 'Outerwear', 'Casual': focus on material volume, outdoor lighting, and lifestyle authenticity.
- The prompt MUST emphasize the garment's specific design elements.

Your task is to generate TWO distinct image generation prompts for the SAME visual scene.
Return the response as a pure JSON object (do not wrap in markdown \`\`\`json) with exactly two keys:
{
  "englishPrompt": "A detailed, structured, technical prompt in English (include camera lenses, lighting names, texture details like 8k resolution, shallow DoF, specific fabric textures) suitable for Midjourney or Fal.ai. Include '--ar ${ratio || '1:1'}' at the end.",
  "chinesePrompt": "A beautifully written, detailed, marketing-oriented prompt in Chinese describing the entire scene, model, and garment features, suitable for end-user preview."
}
`;

        parts.push({ text: systemPrompt });

        let parsedResult: any = null;
        console.log(`[Generate Prompt API] Routing request to model: ${promptModel}`);

        try {
            switch (promptModel) {
                case "deepseek":
                    if (!process.env.DEEPSEEK_API_KEY) throw new Error("Missing DEEPSEEK_API_KEY");
                    const dsResponse = await fetch('https://api.deepseek.com/chat/completions', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY.trim()}`
                        },
                        agent: proxyAgent,
                        body: JSON.stringify({
                            model: "deepseek-chat",
                            messages: [
                                { role: "system", content: "You are an expert multi-modal Fashion AI and Prompt Engineer." },
                                { role: "user", content: systemPrompt }
                            ],
                            response_format: { type: "json_object" }
                        })
                    });
                    if (!dsResponse.ok) throw new Error(`DeepSeek API error: ${dsResponse.status}`);
                    const dsData = await dsResponse.json() as any;
                    parsedResult = JSON.parse(dsData.choices[0].message.content);
                    break;

                case "kimi":
                    if (!process.env.MOONSHOT_API_KEY) throw new Error("Missing MOONSHOT_API_KEY");
                    const kimiResponse = await fetch('https://api.moonshot.cn/v1/chat/completions', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${process.env.MOONSHOT_API_KEY.trim()}`
                        },
                        agent: proxyAgent,
                        body: JSON.stringify({
                            model: "moonshot-v1-8k",
                            messages: [
                                { role: "system", content: "You are an expert multi-modal Fashion AI and Prompt Engineer." },
                                { role: "user", content: systemPrompt }
                            ]
                        })
                    });
                    if (!kimiResponse.ok) throw new Error(`Kimi API error: ${kimiResponse.status}`);
                    const kimiData = await kimiResponse.json() as any;
                    let kimiRawText = kimiData.choices[0].message.content.trim();
                    kimiRawText = kimiRawText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
                    try {
                        parsedResult = JSON.parse(kimiRawText);
                    } catch {
                        throw new Error(`Kimi returned invalid JSON: ${kimiRawText.substring(0, 200)}`);
                    }
                    break;

                case "mock":
                default:
                    await new Promise(r => setTimeout(r, 1500));
                    const isBusiness = category.toLowerCase().includes("business") || category.toLowerCase().includes("suit");
                    parsedResult = {
                        englishPrompt: `A cinematic photorealistic shot of a polished male model wearing a high-end ${category} (image_0.png). Scene: ${bg || 'modern studio'}. Lighting: dramatic fashion lighting, 8k resolution. --ar ${ratio || '1:1'}`,
                        chinesePrompt: `电影级写实摄影：一位精英男模身着高定${category}，置身于${bg || '现代影棚'}中。光影深邃有力，完美捕捉了面料的细腻纹理与剪裁的锋芒，展现出极致的职场张力。`
                    };
                    break;
            }
        } catch (apiError: any) {
            console.warn("[Generate Prompt API] Model failure:", apiError.message);
            return NextResponse.json({ success: false, error: apiError.message });
        }

        return NextResponse.json({ success: true, ...parsedResult });
    } catch (error: any) {
        console.error("[Generate Prompt API] Error:", error.message);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
