# 🧠 提示词工程手册 (PROMPTS.md)

## 1. 视觉解析 System Prompt (Analysis)
用于引导 LLM 观测服装平铺图并提取结构化特征。
> "你是一个资深的时尚买手和服装分析师。请仔细观察图片中的服装，提取其材质（Fabric）、廓形（Silhouette）、细节（Lapels/Cuffs/Zippers）以及洗涤保养建议。"

## 2. 图像生成 Prompt 模板 (Image Generation)
### 2.1 商务男装 (Business Menswear)
- **核心词汇**：Sharp edges, high structural integrity, premium wool texture, professional lighting.
- **负面词汇 (Negative)**：Wrinkly, messy, distortion, low quality, soft tailoring.

### 2.2 户外装备 (Outdoor Gear)
- **核心词汇**：Puffy volume, dynamic shadow, realistic environment, snow mountain/forest ambiance.

## 3. 营销文案 Prompt
用于生成 50 字社媒传播文案。
- **逻辑**：基于生成的图片细节 + 目标受众（如：职场精英、户外玩家）+ 品牌调性（如：极简商务）。

---
*最后更新：2026-03-05*
