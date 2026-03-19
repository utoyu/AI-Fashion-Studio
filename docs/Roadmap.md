🗺️ AI Fashion Studio - 项目总路线图 (Master Roadmap)
项目愿景: 打造工业级、低延迟、高保真的服装 AI 视觉 SaaS 平台。
核心架构: 云边混合架构 (Next.js 前端 + Supabase 云端中枢 + GPU 独立算力节点)。
最后更新: 2026-03-10

🟢 Phase 1: 物理管线铺设与基建 (Storage & UI) - [✅ 已完成]
目标：搭建极其稳健的前端交互底座，彻底打通云端存储直传。

[x] 架构选型与初始化: 确立 Next.js 14 + Tailwind + Supabase 技术栈。

[x] 云端存储接入: 配置 Supabase ai-fashion-images 存储桶及公有读写策略。

[x] 跨域与白屏排雷: 配置 next.config.mjs 中的 remotePatterns 域名白名单。

[x] 组件架构重构: 落实“傻瓜组件 (Dumb Component)”铁律，剥离底层 Dropzone 的上传逻辑，由页面级组件统一调度 File 对象。

[x] 状态管理过渡: 引入临时 localStorage，解决页面刷新导致上传记录与表单数据丢失的“幽灵 Bug”。

🟢 Phase 2: 搭建事件驱动中枢 (Task Queue System) - [✅ 已完成]
目标：摒弃传统的 API 阻塞等待，建立“派单-接单”的异步高并发调度模型。

[x] 核心数据库建表: 在 Supabase 创建 ai_tasks 任务队列表，建立完善的状态机 (pending, processing, completed, failed)。

[x] 解锁通信封印: 暂时解除 ai_tasks 的 RLS (行级安全性) 限制，确保前端能顺利读取数据。

[x] 雷达监听系统 (Realtime): 改造前端手搓精修页，通过 Supabase WebSocket 实现订单状态的无刷新自动流转与结果图渲染。

[x] 自动化主厨跑通 (Mock Worker): 在本地编写并成功运行 Python 守护进程，实现“自动轮询 -> 抢单 -> 模拟生图 -> 回传结果”的全闭环。

🟡 Phase 2.5: 算力实装与 AI 引擎对接 (The Real AI Engine) - [🚀 当前进行中]
目标：为系统注入真正的灵魂，连接真实的物理显卡，跑通 ComfyUI 工作流。

[ ] 算力基建部署: 采购本地 RTX 4090 工作站，或在 AutoDL 等平台租用云端 GPU 实例。

[ ] 引擎与环境配置: 在 GPU 节点上部署 ComfyUI，安装所需插件 (ControlNet 等) 及核心大模型 (Flux, IDM-VTON 等)。

[x] Worker 脚本终极进化 (comfyui_worker.py):

[x] 编写 Python 逻辑，将 Supabase 拉取到的任务组装成 ComfyUI 的 JSON Workflow 发送至本地 127.0.0.1:8188 接口。

[x] 监听 ComfyUI 生成进度，并在生成完毕后，调用 Supabase SDK 将本地物理硬盘中的结果图上传至云端 Storage。

[x] 将获取到的云端外网 URL 更新至 ai_tasks 的 result_image_url 字段，完成上菜。

[x] 前端健壮性优化: 为前端 subscribed 监听增加 Timeout 超时熔断机制（如 3 分钟无响应则提示“排队拥挤”并断开连接）。

⚪ Phase 3: 记忆注入与数据全面云端化 (Database Persistence) - [待启动]
目标：彻底摆脱前端本地缓存，构建真实的用户资产库。

[ ] 建立资产库表: 在 Supabase 创建 assets 数据表 (关联图片 URL、款式、模特参数等元数据)。

[ ] 前后端数据替换: 将前端所有的 localStorage 读写逻辑，全面替换为对 Supabase 数据库的 SELECT, INSERT, UPDATE, DELETE。

[ ] 联动任务流: 任务完成后，不仅更新 ai_tasks，同时自动向 assets 表写入一条生成记录，扩充用户的素材库。

⚪ Phase 4: 商业化封顶与上线 (Auth, Security & Launch) - [待启动]
目标：加上防盗门，绑定域名，正式推向市场。

[ ] 接入身份验证 (Auth): 启用 Supabase Auth，实现邮箱/密码或第三方登录。

[ ] 数据隔离 (RLS 终极防护): 重新开启所有表的 Row Level Security。编写严密的策略：“用户只能看到、修改自己上传的素材和派发的任务”。

[ ] Python Worker 权限加固: 确保后端 Python 脚本使用 Service Role Key 拥有全局最高权限，而前端只持有受限的 Anon Key。

[ ] 生产环境部署: 将 Next.js 部署至 Vercel 主站，配置正式的生产环境变量。

[ ] 域名与发布: 绑定你的正式域名，进行上线前的全链路压测！