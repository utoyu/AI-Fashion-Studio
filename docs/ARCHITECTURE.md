# 🏗️ 技术架构说明书 (ARCHITECTURE.md)

## 1. 总体架构
本项目采用 **Next.js 14+ (App Router)** 架构，前端 UI 基于 **Tailwind CSS** 和 **Shadcn UI** 构建。深度集成了多模态大模型（LLM）与扩散模型（Diffusion Models）。

## 2. 核心模块说明
### 2.1 AI 摄影室 (Photo Studio)
- **视觉分析层**：调用 LLM (Kimi/DeepSeek) 对用户上传的平铺图进行语义解析。
- **提示词构建策略**：
    - 将视觉特征转化为技术性英文 Prompt（绘图模型输入）。
    - 转化为高度商业化的中文营销描述（用户审核预览）。
- **生成链路**：通过 `fal-ai/idm-vton` 模型实现虚拟试穿，支持多图批处理。

### 2.2 智能素材库 (Assets Library)
- **多态数据模型**：
    - `Garment` (衣物)：包含产品构成、洗涤信息、多角度图、关键位置提醒。
    - `Model` (模特)：包含生物特征数据（族裔、年龄层、身高体重）。
    - `Background` (背景)：包含环境光影数据、场景分类、装修风格。
- **交互规范**：采用自适应 90vh 全屏 Detail Dialog，根据资产类型动态渲染布局。

## 3. 关键组件依赖
- `UploadDropzone`: 统一的文件上传入口，支持 `File[]` 数组。
- `CustomScrollbar`: 全局统一的极简滚动条风格。
- `StandardizedHeader`: 像素级对齐的全局顶部导航。

---
*最后更新：2026-03-05*
