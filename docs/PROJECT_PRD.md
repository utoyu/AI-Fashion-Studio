# Product Requirements Document (PRD): AI Fashion Studio

## 1. Product Overview
- **Project Name:** AI Fashion Studio (Internal MVP)
- **Target Users:** Internal E-commerce operations, Marketing, and Design teams.
- **Project DNA (Project Identity):** We operate as a **Menswear Brand Center**. Our focus is strictly on **Male Business, Casual, Sportswear, and Accessories**. Every generated asset and UI element must reflect this professional menswear identity.
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

- Feature 8: Intelligent Asset Library (P0): A centralized repository categorizing resources into "Garment" (衣物), "Model" (模特), and "Background" (背景). 
  - **Categorical Intelligence:** Each asset type has a unique, professional detail editing view. Garments focus on production specs, Models on biological/style data, and Backgrounds on scene/lighting environmental data.
  - **Angle Image Management:** Supports full-suite garment visualization (Front/Main, Back, Left, Right, Top, Bottom) with real-time local file uploads and deletion.
  - **Lifecycle Metadata:** Tracks creator, modifier, and precise timestamps for every asset modification.
  - **Interaction Protection:** Uses conditional double-click logic to ensure users only access type-appropriate editing interfaces, preventing unintended data entry.

## 5. User Flow
1. Select Business Line (Tab).
2. Upload Garment Image(s) (supports multi-selection up to 4).
3. Select Fashion Model, Background Scene, and Pose configurations.
4. Select the desired AI Prompt Generation Model (e.g., Mock API, DeepSeek, Kimi) from the dropdown.
5. Click **"生成 Prompt"** -> Calls the selected LLM API to analyze the visual garment and construct bilingual prompts. User validates the formatted Chinese and English prompts in the clean text area.
6. Click **"一键生成模特图"** -> Wait for API/Mock response (Shows a 3-step Loading state).
7. Preview the 3 generated high-res images directly within the main gallery and view the AI Marketing Copy underneath.
8. Switch between thumbnail results and download assets.
9. **Asset Maintenance:** Double-click any library resource to enter the detailed editor. Upload angle images for garments, update model demographic data, or refine background lighting descriptions. Save changes to persist metadata locally.

## 6. Recent UI/UX & Feature Optimizations (March 2026)
- **E-Commerce Catalog Redesign (电商组图):** Transformed the "Elite Catalog" generic content generator into a specialized E-Commerce multiple-image matrix builder. Supports robust upload of local images simultaneously integrated with cloud-asset attributes (ingredients, care, sizing) for dynamic product listing generation. Features an expansive configuration layout aligned closely to sidebar boundaries for deep editing.
- **Advanced Photo Studio (摄影室):** Introduced a professional-grade UI layout spanning a true 1:2 ratio. Includes an interactive 10-block configuration grid with custom SVGs, AI-assist switches, and history tracking.
- **Categorical Asset Detail System:** Launched specialized 90vh full-modal detail dialogs. 
  - *Garments:* Implemented a 12-column grid layout aligning product bio, composition, angle uploads, and key point reminders.
  - *Models/Backgrounds:* Context-aware layouts for biographical and environmental data.
- **Robust File Operations:** Transitioned to atomic PowerShell-native directory and file management to ensure 100% reliability during batch asset migrations on Windows environments.
- **Global Header Standardization:** Unified dimensions (`h-20`), padding, and typography across all dashboard functional modules. Updated navigation hierarchies and unified iconography globally across Landing, Navbar, Sidebar, and Footers, prioritizing the Asset Library accessibility.
- **Interaction Refinement:** Perfected the balance between single-click (preview) and double-click (edit) behaviors across the asset grid, ensuring a fluid, conflict-free user experience.
