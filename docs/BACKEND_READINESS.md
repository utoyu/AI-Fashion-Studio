# 后端集成准备度审查与优化建议 (Backend Readiness Review)

在完成前端视觉体系与页面交互的全局标准化之后，为确保接下来后端开发的顺利进行，以下是基于当前 React (Next.js App Router) 代码库的系统性优化建议：

## 1. 状态管理 (State Management)
**当前状态**：大部分核心状体（如图片上传列表、选择的参数、模板等）均使用组件内的 `useState` 管理。页头组件（如配额、API Key 配置）与具体功能页面之间缺乏状态共享。
**优化建议**：
- 引入全局状态管理方案（如 **Zustand** 或 **React Context**）。
- 建立全局 `UserStore` (管理 Token、可用算力配额)、`AssetStore` (管理全局上传的临时图片资源或服务器返回的资产 URL)。
- 这样可以避免在多个页面间重复上传或通过查询参数(Query params)繁琐地传递数据。

## 2. API 数据拉取与缓存 (Data Fetching & Caching)
**当前状态**：目前功能页面中的生成过程使用 `setTimeout` 模拟延迟，并没有真正的数据拉取层。
**优化建议**：
- 建议使用 **SWR** 或 **React Query (@tanstack/react-query)** 来管理所有的 GET 请求（如获取历史记录、获取素材库列表、获取模板库）。
- 这两个库内置了 Loading 状态、Error 重试、以及页面聚焦时重新验证 (revalidate on focus) 的能力，能极大减少 useEffect 中手动控制 `loading` 的样板代码。
- 对于 POST/生成类请求，建议在 `lib/api/` 下封装统一的 `fetchClient`，全局拦截 401/403 等鉴权错误。

## 3. 表单校验与数据结构 (Form Validation & Typing)
**当前状态**：前端发送给 "Mock" 处理的参数（如 `skinTone`, `bodyType`）依赖简单的字符串绑定，缺乏预校验。
**优化建议**：
- 引入 **Zod** 和 **React Hook Form**。在向后端发送复杂载荷（如 AI 模特定制的几十项参数组合、生成 Prompt 的图片 + 需求字串）前，进行严格的结构化校验。
- 在根目录建立 `types/api.d.ts` 或在 `lib/types` 集中定义所有的接口类型（如 `Asset`, `GenerationTask`, `HistoryItem`），保证前后端 TypeScript 接口的完全一致性 (End-to-end type safety)。

## 4. 任务轮询与 WebSocket (Task Polling / Async Generation)
**当前状态**：点击“生成”后，UI 显示 loading 并在固定时间后展示结果。
**优化建议**：
- 后端的 AI 生图服务（如 fal-ai/idm-vton）通常耗时较久（10秒 - 1分钟不等）。后端的架构设计很可能采用异步任务队列（提交任务 -> 返回 TaskID -> 轮询/回调获取结果）。
- 前端需要准备对应的**轮询机制 (Polling)**或接入 **WebSocket** / **SSE (Server-Sent Events)**。
- 建议：将当前的 `loading` 状态升级为 `progress` 步进状态，通过查询 TaskID 接口动态更新进度条，增强长耗时任务的用户转化体验。

## 5. 错误处理与 UI 反馈 (Error Handling & Toast)
**当前状态**：使用 `sonner` 的 `toast.success` 和 `toast.error`，但错误信息多为硬编码的“请求失败”。
**优化建议**：
- 后端需要定义标准化的高级错误模型，例如：`{ code: "QUOTA_EXCEEDED", message: "可用积分不足", details: {...} }`。
- 前端在统一的请求拦截器中捕获这些错误，并根据错误码展示对应的友好提示或引导弹窗（如引导前往充值或更换 API Key）。

### ✅ [DONE] 路径 A：解决最致命的物理阻塞 —— 接入云端对象存储 (OSS)
**实施详情**：已通过 **Supabase Storage** 全面替换本地 `URL.createObjectURL` 逻辑。
- **状态**：全站核心页面（素材库、摄影室、电商组图、模特定制、一键精修）已完成云端直传集成。
- **意义**：消除了 `413 Payload Too Large` 风险，为下一阶段接入真正的 AI 生图 API 铺平了道路。

### 🚀 路径 B：突破核心业务壁垒 —— 连通真实 AI 生图链路 (Server Actions)
...

## Phase 1: 物理管线铺设 (Storage & Asset Management) - [✅ 已完成]
- [x] Supabase Storage 接入与前端上传组件重构。

## Phase 2: 搭建“派单-接单”任务中枢 (Task Queue System) - [✅ 已完成]
- [x] 数据库建表 (`ai_tasks`) 建立状态机与索引。
- [x] 前端派单与 Realtime WebSocket 监听逻辑开发。
- [x] 本地 Python Worker 基础接单与流转逻辑测试通关。

## Phase 2.5: GPU 算力实装与 ComfyUI 对接 (The Real AI Engine) - [🚀 当前阶段]
- [ ] **算力基建:** 采购部署 RTX 4090 服务器或租用 AutoDL 等云端算力实例。
- [ ] **引擎部署:** 在服务器上安装配置 ComfyUI，导入 IDM-VTON / Flux 等业务核心模型。
- [x] **Python Worker 升级:** 重写 `worker.py`，将伪代码替换为对本地 ComfyUI 127.0.0.1:8188 接口的真实 HTTP/WebSocket 请求 (已编写 `comfyui_worker.py` 草稿)。
- [x] **结果回传链路:** Worker 生成图片后，调用 Supabase SDK 将物理硬盘中的图像 `upload` 至云端 Bucket，获取 URL 后更新至 `ai_tasks`。
- [x] **前端容错:** 增加前端任务监听的超时熔断机制 (Timeout fallback)。

## Phase 3: 记忆注入与数据打通 (Database Persistence) - [⏳ 待启动]
- [ ] 构建 User 表与完整的 Assets (资产) 关系库，彻底废弃 localStorage。