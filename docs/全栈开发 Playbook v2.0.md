# 📘 AI 鞋服视觉工作站 - 全栈开发 Playbook v2.0
> **核心定位 (Project DNA)**：专注于商务通勤、休闲运动的男装品牌视觉中心。抛弃廉价感，追求极简、挺括的高定视觉体验。

## 一、 核心架构与演进路径 (Architecture Evolution)

### 1. Phase 1：绿野仙踪 MVP (Mock-Driven UI)
* **策略**：坚决不碰后端 API，通过高质量假数据优先跑通前端交互，实现零成本、零延迟的完美演示。
* **UI 规范**：全站强制像素级对齐（Pixel-Perfect）。Header 统一高度 `h-20` 并增加 `pr-[400px]` 防御性安全距离，防止全局悬浮组件遮挡。

### 2. Phase 2：API 联调与多模型智能路由
* **网关策略**：构建 Proxy 穿透层，搭建 `DeepSeek / Kimi / Mock` 三路智能降级分发系统，确保极端网络下的高可用性。
* **功能重组**：打破臃肿，将原“智能精修”废弃至“存档中心”，裂变为**一键精修 (One-Click Retouch)** 与 **手搓精修 (Manual Retouch)** 双轨工作流。
* **主题收敛**：全面剿灭硬编码的杂色（紫/蓝/橙），全局高亮与按钮强制收敛至品牌专属的 Tailwind `primary` (青色) 与定制的 `.cream` 高定暖白主题。

## 二、 核心技术踩坑与最佳实践 (Engineering Lessons)

### 1. 交互冲突处理 (Interaction Conflict)
* **场景**：素材格子需要同时兼容“单击预览”和“双击编辑”。
* **解法**：严禁混用！在 `onClick` 中挂载 250ms 的 `setTimeout` 防抖。若触发双击，则立刻 `clearTimeout` 阻断单击动作，并在入口处依据 `item.type` 进行严格的事件分发。

### 2. Next.js 水合与布局防御 (Hydration & Layout)
* **水合防护**：涉及本地缓存（主题切换、localStorage）的组件，强制采用 Mounted 延迟挂载模式（`if(!mounted) return null`）。
* **自适应栅格**：在 90vh 的大屏弹出层中，采用“固定 Header/Footer + `flex-1` Body”防溢出，内容区强制使用 `grid-cols-12` 维持物理像素级的对齐。

### 3. Windows / Agent 自动化防坑指南
* **原子性操作**：废弃 `mkdir -p` 连写 `cp`，强制使用 PowerShell 原生命令 `New-Item -ItemType Directory -Force`，彻底规避文件系统句柄延迟导致的找不到目录报错。
* **路径免疫**：所有 CLI 文件搬运路径必须使用**双引号包裹绝对路径**。

## 三、 进军后端的战前部署 (Backend Readiness & Blueprint)

### 1. 状态树与数据流改造 (State & Fetching)
* **全局状态**：全面引入 **Zustand**，建立 `UserStore` (管配额/鉴权) 和 `AssetStore` (管云端图库)，消灭深层组件的 Prop Drilling。
* **请求接管**：引入 **SWR / React Query** 接管所有 GET 请求（如历史记录、素材列表），利用其自带的缓存与聚焦重验（Revalidate）特性，大幅消灭冗余的 `useEffect`。
* **强类型防线**：引入 **Zod + React Hook Form**。在向后端发送昂贵的 AI 生成载荷前，前端必须完成极度严格的数据结构校验。

### 2. 核心生图链路 (Core Generation Pipeline)
* **对象存储直传 (OSS)**：严禁向自建后端发送 Base64 高清大图（极易引发 413 Payload Too Large）。必须采用：`前端请求预签名 URL -> 客户端直传 OSS -> 后端获取云端 URL` 的现代化链路。
* **异步任务轮询 (Task Polling)**：基于 `fal-ai/idm-vton` 的生图动辄耗时 10s-1m。当前静态的 `setTimeout` Loading 必须重构为异步轮询：`提交生图请求 -> 后端返回 TaskID -> 前端每隔 2s 轮询状态接口 -> 渲染真实进度条`。