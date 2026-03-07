export const IMAGE_TOOL_MODE_PROMPTS = {
    expand: "延展背景，无缝融合，影棚光效，极简空间，高清细节补全",
    splice: "杂志排版布局，时尚画册风格，优雅构图，高级感社论，干净极简美学",
    flat3d: "平铺转3D立体，模拟模特穿着形态，真实面料褶皱，多角度立体阴影，商业摄影质感",
    pattern: "提取核心图案，无缝四方连续纹理，高分辨率面料细节，去除背景干扰，色彩准确还原",
    swap_outfit: "保持模特特征不变，更换指定时尚服饰，保持自然的光影重合，面料细节逼真，完美贴合身形",
    swap_face: "高精度面部替换，保留原始光照环境，五官自然融合，肤质细腻匹配，维持原有发型与神态",
    change_pose: "重新塑造模特姿态，保持原有服装与外貌，动作自然协调，肢体比例准确，光影逻辑真实重构",
    white_bg: "一键智能去背，边缘过度自然无锯齿，转为纯白色背景 (#FFFFFF)，适应各大电商平台标准主图要求",
    usp_display: "自动识别产品核心卖点，添加时尚标签与排版，突出面料科技、廓形设计、五官细节，生成卖点图",
    usp_analysis: "基于视觉算法深度分析产品卖点，识别材质、工艺、风格倾向，提供专业且具有转化率的文案建议",
} as const;

export type ImageToolMode = keyof typeof IMAGE_TOOL_MODE_PROMPTS;

export const ONE_CLICK_MODES: ImageToolMode[] = [
    "expand",
    "white_bg",
    "flat3d",
    "pattern",
    "usp_display",
    "usp_analysis",
];

export const MANUAL_MODES: ImageToolMode[] = [
    "splice",
    "swap_outfit",
    "swap_face",
    "change_pose",
];
