# Product Requirements Document (PRD): AI Fashion Studio

## 1. Product Overview
- **Project Name:** AI Fashion Studio (Internal MVP)
- **Target Users:** Internal E-commerce operations, Marketing, and Design teams.
- **Core Value:** Transform simple "Garment Flat Lay" (平铺图) images into high-fidelity "Model Try-On" images and marketing posters in minutes, significantly reducing photoshoot and post-production costs.

## 2. Core Business Lines (Crucial for Prompt Routing)
The application must dynamically handle two distinct business lines with different AI generation parameters:
1. **Business Menswear (商务通勤男装):** Suits, dress shirts, trousers. 
   - *AI Requirement:* High structural integrity, sharp edges, formal tailoring. Must NOT look soft or wrinkly.
2. **Outdoor Gear (户外运动装备):** Down jackets, windbreakers, trail running gear.
   - *AI Requirement:* Puffy texture, realistic volume, dynamic lighting matching extreme outdoor scenes (snow mountains, forests).

## 3. Product Roadmap & Architecture
- **Current Phase (Phase 1 - MVP):** Serverless architecture. Frontend built with Next.js (App Router), deployed on Vercel. Backend logic uses Next.js API routes calling external APIs (`fal-ai/idm-vton` for image generation, and `Google Gemini` for marketing copy). No local GPU deployment yet.
- **Future Phase (Phase 2):** Localized deployment on internal RTX 4090 clusters for data privacy. 

## 4. Core Features (Epic -> Feature)
- **Feature 1: Virtual Try-On (P0):** Users upload a garment image, select a model profile (e.g., Asian Male, Sporty Male), and the system generates a realistic try-on image using the Fal.ai API.
- **Feature 2: Scene & Background Swap:** Users can select predefined scenes (e.g., Office, Street, Snow Mountain) to composite the model into.
- **Feature 3: AI Marketing Copywriter:** Based on the generated image and category, call the Gemini API to automatically extract product selling points and write a 50-word social media copy.
- **Feature 4: Asset Export:** Users can download the generated high-res images and the text copy to their local machines.

## 5. User Flow
1. Select Business Line (Tab).
2. Upload Garment Image.
3. Select Model & Scene configuration.
4. Click "Generate" -> Wait for API response (Show Loading state).
5. Preview the 4-grid generated images and marketing copy.
6. Download assets.