# Global Workspace Rules for AI Fashion Studio

## 0. Project DNA & Brand Background (MANDATORY PREMISE)
- **Identity:** We are a **Menswear Brand Operations Company**.
- **Core Focus:** Male Business (商务), Casual (休闲), Sports (运动) apparel, and Accessories (配饰).
- **Creative Mandate:** All architectural plans, UI designs, AI prompt engineering, and marketing copies MUST center around the high-end, professional, and diverse aesthetics of modern menswear.

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
- **Event Handling:** Explicitly resolve event bubbling conflicts (e.g., single click viewing vs. double click editing) using debouncing. For asset libraries, implement **Conditional Logic** within the `onDoubleClick` handler to ensure only type-appropriate modals are triggered (e.g., Garment-only fields should never appear for Model assets).
- **API First Backend:** All logic executes through Next.js Route Handlers (`app/api/...`). Keep them serverless-ready for Vercel. Include comprehensive `try/catch` wrappers.

## 4. Multi-Model LLM Integration & Prompt Engineering
- **Prompt Routing:** The system dynamically selects between Mock API, DeepSeek, and Kimi for visual analysis and prompt building. Ensure API handlers parse the respective LLM JSON payloads gracefully.
- **Resilience:** Treat all 3rd-party LLM and image generation APIs (Fal.ai IDM-VTON, Gemini) as fundamentally unstable. Robust fallbacks (e.g., timeout catchers, static default mock strings) MUST be present to prevent frontend crashes or hanging loaders.

## 5. Agent Workflow
- **Language Preference:** The agent must ALWAYS reply explaining the code and thoughts in Chinese (中文), maintaining an encouraging, professional product-engineer tone.
- **Documentation First:** Before starting research or deep features, the agent MUST consult the `docs/` directory for PRD, Rules, and Lessons Learned (`AI_Agent_Lessons.md`).
- **Execution:** Implement changes incrementally and correctly. Apply changes via multi-replace or file drops dynamically. Confirm terminal results implicitly.

## 6. Windows File Management (CRITICAL)
Due to Windows/PowerShell idiosyncrasies, the following rules are MANDATORY for file-system tasks:
- **Atomic Creation:** Always use `New-Item -ItemType Directory -Force` for directory creation.
- **I/O Sync:** Do NOT execute file moves (`cp`, `mv`) in the same command block as the directory creation that houses them. Split them into separate tool calls or wait pulses.
- **Path Integrity:** Wrap all paths in double quotes and prefer absolute paths. Verify paths with `Test-Path` before high-volume operations.
- **Verification:** Always check command status and exit codes for file operations.