import { NextResponse } from "next/server";
import fetch from "node-fetch";
import { HttpsProxyAgent } from "https-proxy-agent";
import fs from "fs";
import path from "path";

export async function POST(request: Request) {
    try {
        const { garmentUrl, category, model, bg, pose, promptModel = "mock" } = await request.json();

        if (!garmentUrl || !category) {
            return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
        }

        console.log("[Generate Prompt API] Started with category:", category);

        if (!process.env.GEMINI_API_KEY) {
            throw new Error("Missing GEMINI_API_KEY in environment variables");
        }

        // Configure HttpsProxyAgent
        let proxyAgent: any = undefined;
        if (process.env.LOCAL_PROXY) {
            proxyAgent = new HttpsProxyAgent(process.env.LOCAL_PROXY);
            console.log(`[Proxy] HttpsProxyAgent configured for: ${process.env.LOCAL_PROXY}`);
        }

        // Helper to read local file to base64
        const toBase64Image = (url: string) => {
            try {
                // If it's a relative URL, read from public folder
                let filePath = url;
                if (url.startsWith("/")) {
                    filePath = path.join(process.cwd(), "public", url);
                } else if (!url.startsWith("http")) {
                    return null;
                }
                const fileBuffer = fs.readFileSync(filePath);
                return fileBuffer.toString('base64');
            } catch (err) {
                console.error("Local file read error:", err);
                return null;
            }
        };

        const base64Data = toBase64Image(garmentUrl);

        let parts: any[] = [];
        if (base64Data) {
            parts.push({
                inlineData: { data: base64Data, mimeType: 'image/jpeg' }
            });
        }

        const systemPrompt = `
You are an expert multi-modal Fashion AI and Prompt Engineer.
LOOK at the provided garment image. Extract all precise visual features (colors, patterns, fabric textures, lapels, stitching, buttons, accessories).

Combine these extracted features with the following user specifications:
- Model Type: ${model || 'Default'}
- Background Scene: ${bg || 'Default'}
- Pose: ${pose || 'Default'}
- Category: ${category}

Business Rule Constraints:
- If 'Business Menswear': focus on sharp edges, formal suit tailoring, high structural integrity, windowpane/check patterns, high-quality wool blends.
- If 'Outdoor Gear': focus on puffy texture, outdoor jacket, dynamic lighting, realistic volume, windproof/waterproof elements.

Your task is to generate TWO distinct image generation prompts for the SAME visual scene based on the extracted features and user specs.
Return the response as a pure JSON object (do not wrap in markdown \`\`\`json) with exactly two keys:
{
  "englishPrompt": "A detailed, structured, technical prompt in English (include camera lenses, lighting names, texture details like 8k resolution, shallow DoF) suitable for Midjourney or Fal.ai.",
  "chinesePrompt": "A beautifully written, detailed, marketing-oriented prompt in Chinese describing the entire scene, model, and garment features, suitable for end-user preview."
}
`;

        parts.push({ text: systemPrompt });

        let parsedResult: any = null;
        console.log(`[Generate Prompt API] Routing request to model: ${promptModel}`);

        try {
            switch (promptModel) {
                case "deepseek":
                    // DeepSeek V3 Real API implementation via node-fetch (OpenAI compatible)
                    // Endpoint: https://api.deepseek.com/chat/completions (v1/chat/completions)
                    // Required ENV: DEEPSEEK_API_KEY
                    console.log("[Generate Prompt API] Calling DeepSeek API...");
                    if (!process.env.DEEPSEEK_API_KEY) throw new Error("Missing DEEPSEEK_API_KEY");

                    const dsResponse = await fetch('https://api.deepseek.com/chat/completions', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY.trim()}`
                        },
                        agent: proxyAgent,
                        body: JSON.stringify({
                            model: "deepseek-chat", // standard DeepSeek V3 text model
                            messages: [
                                { role: "system", content: "You are an expert multi-modal Fashion AI and Prompt Engineer." },
                                { role: "user", content: systemPrompt }
                            ],
                            response_format: { type: "json_object" }
                        })
                    });

                    if (!dsResponse.ok) {
                        const errBody = await dsResponse.text();
                        throw new Error(`DeepSeek API failed with status ${dsResponse.status}: ${errBody}`);
                    }

                    const dsData = await dsResponse.json() as any;
                    parsedResult = JSON.parse(dsData.choices[0].message.content);
                    break;

                case "kimi":
                    // Kimi (Moonshot) Real API implementation via node-fetch
                    // Endpoint: https://api.moonshot.cn/v1/chat/completions
                    // Required ENV: MOONSHOT_API_KEY
                    console.log("[Generate Prompt API] Calling Kimi Moonshot API...");
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

                    if (!kimiResponse.ok) {
                        const errBody = await kimiResponse.text();
                        throw new Error(`Kimi API failed with status ${kimiResponse.status}: ${errBody}`);
                    }

                    const kimiData = await kimiResponse.json() as any;
                    // Needs regex cleaning if Kimi doesn't strictly follow JSON forcing
                    let kimiRawText = kimiData.choices[0].message.content.trim();
                    console.log("[Kimi Raw Text]:", kimiRawText);
                    kimiRawText = kimiRawText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
                    parsedResult = JSON.parse(kimiRawText);
                    console.log("[Kimi Parsed Result]:", parsedResult);

                    // Ensure strings
                    if (typeof parsedResult.englishPrompt === 'object') {
                        parsedResult.englishPrompt = JSON.stringify(parsedResult.englishPrompt);
                    }
                    if (typeof parsedResult.chinesePrompt === 'object') {
                        parsedResult.chinesePrompt = JSON.stringify(parsedResult.chinesePrompt);
                    }

                    break;

                case "mock":
                default:
                    console.log("[Generate Prompt API] Using highly reliable Mock Generator...");
                    await new Promise(r => setTimeout(r, 2000)); // Simulate 2s LLM generation time

                    const fallbackChinese = `30岁英俊的中国男模作为新郎的四分之三电影级逼真特写镜头，充满自信地站立并微微微笑。他穿着一件合身的、带暗细格纹的${category === 'Business Menswear' ? '灰咖啡色羊毛混纺西装外套，戗驳领，两粒扣' : '户外冲锋衣，防风带帽设计'}。背景是一个灯光温暖、高档现代的${category === 'Business Menswear' ? '婚礼招待会内景' : '壮丽雪山景色'}，并以浅景深（shallow DoF）模糊背景，以将焦点完全集中在服饰纹理上。**相机：采用全画幅相机拍摄，浅景深，8k超高分辨率。**`;

                    const fallbackEnglish = `A three-quarter cinematic, photorealistic shot of a 30-year-old handsome Chinese male model styled confidently. He is wearing a tailored ${category === 'Business Menswear' ? 'grey-coffee colored wool-blend suit jacket with a subtle windowpane check pattern, peaked lapels' : 'outdoor puffy jacket, windproof design'} (image_0.png). The background is a warmly-lit, upscale modern ${category === 'Business Menswear' ? 'wedding reception interior' : 'snow mountain scenery'}, blurring with a shallow depth of field (shallow DoF) to keep the focus entirely on the garment texture. **Camera: Shot on a full-frame camera with a shallow depth of field, 8k resolution.**`;

                    parsedResult = {
                        englishPrompt: fallbackEnglish,
                        chinesePrompt: fallbackChinese
                    };
                    break;
            }
        } catch (apiError: any) {
            console.warn("[Generate Prompt API] Selected model strategy failed:", apiError.message);

            return NextResponse.json({
                success: false,
                error: apiError.message
            });
        }

        return NextResponse.json({ success: true, ...parsedResult });
    } catch (error: any) {
        console.error("[Generate Prompt API] Error:", error.message || error);
        return NextResponse.json(
            { success: false, error: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
