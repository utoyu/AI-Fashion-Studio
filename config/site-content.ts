export const siteConfig = {
    title: "AI 鞋服视觉工作站",
    subtitle: "一键生成高定大片，重塑电商视觉体验",
    generateButtonText: "生成 Prompt",
    generatingText: "AI 思考中...",
    themeToggle: {
        light: "经典明亮",
        dark: "午夜暗色",
        cream: "高定暖白"
    }
};

export const aiModelsConfig = {
    defaultSelected: "mock",
    options: [
        { id: "mock", label: "演示专用极速模型 (Mock - Safe)" },
        { id: "deepseek", label: "DeepSeek V3 (国产开源之光)" },
        { id: "kimi", label: "Kimi 月之暗面" }
    ]
};

export const generationConfig = {
    modelStyles: [
        { id: "asian-male01", label: "亚洲男性", desc: "20-30岁" },
        { id: "asian-male02", label: "亚洲男性", desc: "31-40岁" },
        { id: "western-male01", label: "欧美男性", desc: "20-30岁" },
        { id: "western-male02", label: "欧美男性", desc: "31-40岁" },
    ],
    backgrounds: [
        { id: "studio-white", label: "纯白背景" },
        { id: "studio-gray", label: "灰色影棚" },
        { id: "outdoor-street", label: "城市街拍" },
        { id: "outdoor-park", label: "公园自然" },
        { id: "indoor-cafe", label: "咖啡店" },
        { id: "indoor-home", label: "居家场景" },
    ],
    poses: [
        { id: "standing", label: "站立正面" },
        { id: "half-body", label: "半身特写" },
        { id: "walking", label: "行走姿态" },
        { id: "sitting", label: "坐姿" },
        { id: "side", label: "侧身展示" },
        { id: "back", label: "背面展示" },
    ]
};
