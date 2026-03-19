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

### 1. 组件与状态架构设计 (Component & State Architecture)
* **“傻瓜组件”铁律**：底层 UI 组件（如 `<UploadDropzone>`）必须是“绝对的傻瓜”。只负责渲染样式交互，通过 props (如 `onFileSelect`) 原封不动地传递原始数据。严禁在其中调用 API 或执行业务逻辑。
* **外科手术式重构**：逻辑注入严禁破坏 UI。接入云端逻辑时，必须保持所有 DOM 结构、CSS 类名、动画效果 (`animate-in`, `hover:`, `group-hover`) 绝对不变，仅替换数据绑定。
* **交互冲突处理**：涉及单击/双击冲突时（如素材格子），在 `onClick` 中挂载 250ms 防抖。若触发双击，立刻 `clearTimeout` 阻断。
* **原型期状态持久化**：在正式接入数据库前，核心状态（如 assets 列表）需通过 `localStorage` “保活”。初始化 State 时优先读取本地缓存，并使用 `useEffect` 实时同步，防止刷新丢失。

### 2. Next.js 与前端避坑指南 (Next.js Pitfalls)
* **水合防护**：涉及本地缓存或 `localStorage` 的组件，强制采用 Mounted 延迟挂载模式 (`if(!mounted) return null`)。
* **跨域图片白屏防御**：外网链接传入 `<Image>` 需在 `next.config.mjs` 注册域名。临时方案可使用原生 `<img />` 绕过审查。
* **自适应栅格**：弹出层采用“固定 Header/Footer + `flex-1` Body”，内容区强制使用 `grid-cols-12` 维持像素级对齐。

### 3. Windows / Agent 自动化防坑
* **原子性操作**：废弃 `mkdir -p`，强制使用 PowerShell `New-Item -ItemType Directory -Force`，规避句柄延迟。
* **路径免疫**：所有 CLI 文件搬运路径必须使用**双引号包裹绝对路径**。

## 三、 云端与接口通信机制 (Cloud & API Mechanism)

### 1. 核心变量防死锁 (Strict Env Validation)
* **显式防御**：初始化 Supabase 或 AI 配置时，严禁使用隐式断言 `!`。必须编写显式检查，让错误“大声报错” (Fail Loudly)：
  ```typescript
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    throw new Error("❌ 致命错误：找不到 Supabase URL！请检查 .env.local")
  }
  ```

### 2. 异步任务的用户反馈 (Mandatory Loading States)
* **凡请求必有 Loading**：触发 async 函数首行必须开启反馈（如 `toast.loading(...)`），并在 `finally` block 中解除锁定，确保即使报错也能恢复交互，防止重复点击。

