# Global Workspace Rules for AI Fashion Studio

## 1. Tech Stack & UI Conventions
- **Framework & Routing:** Next.js (App Router strictly).
- **Core Languages:** TypeScript (Strong typings required) and Tailwind CSS.
- **UI System:** Shadcn UI + Radix primitives. **NO** other third-party UI libraries (e.g., MUI, AntD).
- **Iconography:** Primarily use `lucide-react`. If semantic meaning is missing in Lucide (e.g., specific garments like innerwear or pants), utilize **hand-drawn SVG vectors** formatted cleanly to match the exact visual style (`strokeWidth="1.5"`, `viewBox="0 0 24 24"`) of Lucide.
- **Scrollbars:** Always use the custom minimalist scrollbar class (`custom-scrollbar`) on container elements intended to be scrollable.

## 2. Advanced Layout & Styling Standards (CRITICAL)
- **Pixel-Perfect Global Alignment:** The application now enforces strictly consistent top-level layouts across all Dashboard pages. All main page headers must use the exact standardized container: `<div className="flex h-20 shrink-0 items-center justify-between border-b border-border px-8 bg-white z-10/20">`.
- **Typography:** Major page titles use `<h1 className="font-display text-2xl font-bold tracking-tight">`. Subtitles use `text-sm text-muted-foreground mt-1`. Always adhere to this strict hierarchy.
- **UI Evolution (Beyond v0):** We are no longer strictly locked to the initial v0 generation. Active, thoughtful refactoring of the UI/UX is encouraged to achieve a "professional-grade/agency-level" aesthetic, including 1:2 layout splits, debounced interactions, sticky action bars, and finely tuned hover states.

## 3. Architecture & Functional Components
- **Modular Upload:** All file drop interactions must use the standardized `UploadDropzone` component capable of handling `File[]` arrays correctly to avoid duplicate bug fixing. 
- **Event Handling:** Explicitly resolve event bubbling conflicts (e.g., single click viewing vs. double click editing/deleting in asset grids) using `setTimeout`/debouncing.
- **API First Backend:** All logic executes through Next.js Route Handlers (`app/api/...`). Keep them serverless-ready for Vercel. Include comprehensive `try/catch` wrappers.

## 4. Multi-Model LLM Integration & Prompt Engineering
- **Prompt Routing:** The system dynamically selects between Mock API, DeepSeek, and Kimi for visual analysis and prompt building. Ensure API handlers parse the respective LLM JSON payloads gracefully.
- **Resilience:** Treat all 3rd-party LLM and image generation APIs (Fal.ai IDM-VTON, Gemini) as fundamentally unstable. Robust fallbacks (e.g., timeout catchers, static default mock strings) MUST be present to prevent frontend crashes or hanging loaders.

## 5. Agent Workflow
- **Language Preference:** The agent must ALWAYS reply explaining the code and thoughts in Chinese (中文), maintaining an encouraging, professional product-engineer tone.
- **Execution:** Implement changes incrementally and correctly. Apply changes via multi-replace or file drops dynamically. Confirm terminal results implicitly.