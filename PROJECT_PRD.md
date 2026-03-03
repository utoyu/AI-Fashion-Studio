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
- **Current Phase (Phase 1 & 2 - MVP / High-Fidelity Prototype):** Serverless architecture. Frontend built with Next.js (App Router), deployed on Vercel. 
  - **Phase 1 (Mock Demo Flow):** Implemented for zero-cost, latency-free demonstrations using randomized, high-quality local mock assets.
  - **Phase 2 (API Integration):** Backend logic uses Next.js API routes calling external multimodal APIs. Includes a robust fallback mechanism to bypass regional network blockages (e.g., within mainland China). Supports multi-model intelligent routing (Mock API, DeepSeek, Kimi) for vision analytics/prompt generation, and uses `fal-ai/idm-vton` for image generation.
- **Future Phase (Phase 3):** Localized deployment on internal RTX 4090 clusters for data privacy and avoiding third-party API costs entirely. 

## 4. Core Features (Epic -> Feature)
- **Feature 1: AI Prompt Engineer (P0):** Before creating an image, the system parses the uploaded garment using a user-selected LLM (DeepSeek, Kimi, or Mock API) to extract precise features (fabric, lapels, stitching, patterns). It then cross-references user specs and business rules to generate two distinct prompts:
  1. A technical **English Prompt** (for the Image Generation Model).
  2. A highly commercial **Chinese Prompt** (for the user to review/approve).
  *Note: The frontend correctly parses nested JSON structures (e.g., from Kimi) and elegantly displays both the Chinese and English prompts in a clean, plain-text format.*
- **Feature 2: Virtual Try-On (P0):** Users upload up to 4 garment images in a batch. The system uses the approved AI Prompt to generate a minimum of 3 diverse, high-fidelity realistic try-on images.
- **Feature 3: Scene & Background Swap:** Users can select predefined scenes (e.g., Office, Street, Snow Mountain) to composite the model into.
- **Feature 4: AI Marketing Copywriter:** Based on the generated image and category, call the Gemini API to automatically extract product selling points and write a 50-word social media copy.
- **Feature 5: Asset Export:** Users can download the generated high-res images and the text copy to their local machines.
- **Feature 6: Network Resilience:** Graceful fallbacks for API timeout/connection refused errors, seamlessly switching between real LLM generation and pre-defined semantic local mock strings to prevent UI crashes.
- **Feature 7: Multi-Model Selection:** Allows users to dynamically switch between different LLM backends (DeepSeek, Kimi (fully integrated), or local Mock) for prompt generation through a unified UI dropdown. Backend API routes handles prompt assembly, payload formatting, JSON sanitization, and proxying specific to each AI model.

## 5. User Flow
1. Select Business Line (Tab).
2. Upload Garment Image(s) (supports multi-selection up to 4).
3. Select Fashion Model, Background Scene, and Pose configurations.
4. Select the desired AI Prompt Generation Model (e.g., Mock API, DeepSeek, Kimi) from the dropdown.
5. Click **"生成 Prompt"** -> Calls the selected LLM API to analyze the visual garment and construct bilingual prompts. User validates the formatted Chinese and English prompts in the clean text area.
6. Click **"一键生成模特图"** -> Wait for API/Mock response (Shows a 3-step Loading state).
7. Preview the 3 generated high-res images directly within the main gallery and view the AI Marketing Copy underneath.
8. Switch between thumbnail results and download assets.

## 6. Recent UI/UX & Feature Optimizations (March 2026)
- **Advanced Photo Studio (摄影室):** Introduced a professional-grade UI layout spanning a true 1:2 ratio. Includes an interactive 10-block configuration grid with custom, hand-drawn vector SVGs (Pants, Innerwear, Dress), embedded AI-assist switches, fast-toggle accessory options, and a comprehensive history view pane.
- **Global Header Standardization:** Executed pixel-perfect alignment across all 7 major functional pages (Photo Studio, AI Models, Assets, Custom Model, Image Tools, Smart Retouch, KOC Content). The top headers and sidebar logo container now share strictly unified dimensions (`h-20 shrink-0`), padding (`px-8`), and modern typography styling (`text-2xl tracking-tight`).
- **Sidebar Refactoring:** Reordered features intuitively: "Custom Model" follows "Assets Library", "Image Expansion" morphed into a consolidated "Image Tools" tab, and duplicate entries were purged. 
- **Asset Library Robustness:** Implemented drag-to-pan within image lightboxes, completely resolved single-click vs. double-click interaction conflicts via debouncing, and added a fail-safe double-verification layer for asset deletions.
- **Component Architecture:** Standardized the `UploadDropzone` component across the entire application to reliably support concurrent multi-file (`File[]`) array uploads and strict Type definitions, drastically reducing cross-page regressions.