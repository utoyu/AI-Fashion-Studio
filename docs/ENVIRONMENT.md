# 🌐 环境变量与 API 治理 (ENVIRONMENT.md)

## 1. 核心 API 密钥说明
| 变量名 | 作用 | 平台 |
| :--- | :--- | :--- |
| `DEEPSEEK_API_KEY` | 视觉分析与 Prompt 生成 | DeepSeek |
| `KIMI_API_KEY` | 视觉分析与 Prompt 生成 | Moonshot (Kimi) |
| `FAL_AI_KEY` | 核心虚拟试穿引擎 (`idm-vton`) | Fal.ai |
| `GEMINI_API_KEY` | 辅助营销文案及代码辅助 | Google Gemini |

## 2. 代理与网络治理
- 本项目针对中国大陆环境做了特殊优化：
    - **Fallback 机制**：若外网 API 超时，自动切换至 `Mock API` 数据流，确保 UI 不卡死。
    - **镜像代理**：在 `idm-vton` 调用中内置了图片处理代理逻辑。

## 3. 本地存储规范
- 临时生成的预览图使用 `URL.createObjectURL` 挂载。
- 模拟数据（Mock Data）存放在 `app/dashboard/assets/page.tsx` 的 `initialAssets` 中。

---
*最后更新：2026-03-05*
