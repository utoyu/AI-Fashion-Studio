"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Upload,
    Search,
    Filter,
    Grid,
    List,
    Plus,
    Shirt,
    Users,
    Image as ImageIcon,
    X,
    Download,
    ZoomIn,
    ZoomOut,
    RotateCcw,
    RotateCw,
    ChevronLeft,
    ChevronRight,
    Pencil,
    ChevronDown,
    Minus,
    Check,
    Sparkles,
} from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { ImageLightbox } from "@/components/ui/image-lightbox"

const tabs = [
    { id: "garment", label: "衣物素材", icon: Shirt },
    { id: "model", label: "模特库", icon: Users },
    { id: "background", label: "场景背景", icon: ImageIcon },
]

const SLEEVE_LENGTHS = [
    "无袖（上装无袖管）",
    "短袖（上装袖管覆盖到大臂二分之一到三分之二位置）",
    "五分袖（上装袖管覆盖到肘部位置）",
    "七分袖（上装袖管覆盖到覆盖小臂二分之一位置）",
    "九分袖（上装袖管覆盖到手腕上方位置）",
    "全长袖（上装袖管覆盖到手腕或略过手腕）",
    "法式叠袖（双层袖口，需搭配袖扣使用）"
]

const BODY_LENGTHS = [
    "短款（上装覆盖到腰节以上）",
    "常规款（上装覆盖到腰节下方位置）",
    "中长款（上装覆盖到臀部二分之一到三分之处的位置）",
    "长款（上装覆盖至臀部以下到大腿中部之间位置）",
    "超长款（上装覆盖到大腿中部以下）",
    "加长版（外衣/风衣专项，长度及膝或过膝）"
]

const PRODUCT_CATEGORIES = ["上装", "下装", "内搭", "西装/套装", "户外装备", "领带/配饰"]

const SCENE_CATEGORIES = ["现代办公室", "豪华会议室", "行政大厅", "城市街道", "极简影棚", "户外露台", "高端商场", "公路/边际", "咖啡厅/酒廊", "私人公寓"]
const LIGHTING_FEATURES = ["明亮自然光", "柔和室内光", "正午强光", "夕阳光影", "霓虹夜景", "专业影棚光", "侧逆光/轮廓光", "舞台聚光", "阴天漫反射", "暖调环境光"]
const SCENE_ELEMENTS = ["自然景观", "现代建筑", "室内软装", "城市街景", "水系海景", "园林绿化", "交通工具", "品牌艺术", "极简空间", "现代科技"]

const MODEL_GENDERS = ["男", "通用"]
const MODEL_AGES = ["18-25岁", "26-30岁", "31-35岁", "36-40岁", "41-45岁", "46-50岁", "50岁以上"]
const MODEL_ETHNICITIES = ["东亚", "东南亚", "高加索(欧美)", "非洲裔", "南亚/印度", "拉丁/美西", "中东"]
const MODEL_HEIGHTS = ["170-175cm", "176-180cm", "181-185cm", "186-190cm", "191-195cm", "195cm以上"]
const MODEL_WEIGHTS = ["60-65kg", "66-70kg", "71-75kg", "76-80kg", "81-85kg", "86-90kg", "90kg以上"]
const MODEL_STYLES = ["职场精英", "正装绅士", "运动型男", "潮流街头", "知性儒雅", "硬朗粗犷", "高端质感", "邻家男孩", "资深管理", "欧美高冷"]

// Mock data mapped to types
const initialAssets = [
    {
        id: "11911",
        type: "garment",
        src: "/images/assets/suit.png",
        title: "意式深灰格纹西装",
        description: "高支羊毛免烫面料，展现质感的深灰平铺。",
        prompt: "High-end product photography of a men's Italian charcoal grey suit, wool texture, plaid pattern, professional studio lighting, macro details, high resolution.",
        productNum: "LS-2024-001",
        productPrice: "¥ 1299.00",
        productSize: "L, XL, XXL",
        productCategory: ["上装"],
        brandInfo: "Luxury Studio",
        salesCount: "156",
        composition: "90% 羊毛, 10% 蚕丝",
        designFeatures: "此款时尚灰咖色雅致格纹套装，高含毛高品辅料，全里（粘合衬）工艺，8.5cm枪驳头，经典二粒扣，斜圆角。",
        washMethod: "干洗, 不可漂白, 低温熨烫",
        afterSales: "7天无理由退换货",
        pos1: "衣领位置",
        pos2: "袖口细节",
        pos3: "扣眼缝制",
        pos4: "内饰口袋",
        pos5: "后背开叉",
        wechatLink: "https://shop.wechat.com/s/123",
        pinduoduoLink: "https://mobile.yangkeduo.com/goods.php?goods_id=456",
        taobaoLink: "https://item.taobao.com/item.htm?id=789",
        creator: "uto (ID: 20127)",
        createTime: "2026-03-02 15:29:45",
        modifier: "uto (ID: 20127)",
        modifyTime: "2026-03-02 15:39:44",
        sleeveLength: "标准袖长",
        bodyLength: "常规款",
        backImg: "",
        leftImg: "",
        rightImg: "",
        topImg: "",
        bottomImg: ""
    },
    { id: "M002-GRM", type: "garment", src: "/images/assets/shirt.png", title: "雅致白衬衫与真丝领带", description: "全棉抗皱白衬衫搭配高质感藏青色真丝领带。", prompt: "Crisp white business shirt with a royal blue silk tie, isolated on white background, sharp focus, consistent lighting." },
    {
        id: "GRM-003",
        type: "garment",
        src: "/images/assets/business/suit_navy_blue.png",
        title: "正装深蓝西装",
        description: "商务精英必选，修身版型深蓝色高级毛料。",
        prompt: "Navy blue executive suit, slim fit, 100% wool, front view on ghost mannequin, expensive feel, realistic shadows.",
        productNum: "BS-2024-002",
        productPrice: "¥ 2899.00",
        productCategory: ["上装"],
        composition: "100% 羊毛",
        designFeatures: "经典修身剪裁，平驳头两粒扣设计，面料挺括，光泽高级。",
        washMethod: "仅限干洗",
        afterSales: "提供终身免费改衣服务"
    },
    {
        id: "MDL-AMB-MAIN",
        type: "model",
        src: "/images/assets/business/model_brand_ambassador_primary.png",
        title: "品牌首席代言人-虚拟资产",
        description: "品牌视觉基石，32岁亚洲男性模特，气质沉稳、冷静，具备极强的品牌统摄力。适用于年度画册、官网封面及核心产品发布。",
        prompt: "A high-end fashion photograph of a handsome and sophisticated Asian male model in his 30s, wearing a premium tailored navy blue business suit, standing in a luxury modern office with floor-to-ceiling windows showing a city skyline at sunset. Professional studio lighting, 8k resolution, cinematic atmosphere, representing a brand ambassador.",
        gender: "男",
        age: "31-35岁",
        ethnicity: "东亚",
        height: "186-190cm",
        weight: "76-80kg",
        style: "正装绅士"
    },
    {
        id: "MDL-AMB-001",
        type: "model",
        src: "/images/assets/business/model_brand_ambassador_1.png",
        title: "阳光商务代言人-陈逸",
        description: "28岁东亚男模，拥有阳光健康的形象与迷人的职业微笑，完美契合高端商务男装品牌调性。",
        prompt: "Professional portrait of a 28-year-old Asian male model, friendly smile, clean-shaven, corporate style, soft key lighting, neutral studio background.",
        gender: "男",
        age: "26-30岁",
        ethnicity: "东亚",
        height: "181-185cm",
        weight: "71-75kg",
        style: "职场精英"
    },
    {
        id: "MDL-AMB-002",
        type: "model",
        src: "/images/assets/business/model_brand_ambassador_2.png",
        title: "雅致风尚代言人-佐野",
        description: "30岁日系风格男模，气质儒雅且身身形健硕，展现出极具亲和力的国际化商务风范。",
        prompt: "Sophisticated 30-year-old Japanese male model, elegant posture, calm expression, sharp jawline, cinematic portrait, museum interior background.",
        gender: "男",
        age: "26-30岁",
        ethnicity: "东亚",
        height: "181-185cm",
        weight: "76-80kg",
        style: "正装绅士"
    },
    {
        id: "MDL-DIGI-001",
        type: "model",
        src: "/images/assets/business/digital_ambassador_3view.png",
        title: "数字孪生代言人-三视图",
        description: "高精度3D数字男装模特，30岁亚洲男性形象，具备极高辨识度的冷峻轮廓。包含正面、侧面、剖面三视角视图，为品牌数字化建模提供标准参考。",
        prompt: "A high-fidelity 3D digital male brand ambassador for a menswear brand. The avatar looks like a sophisticated 30-year-old Asian man with a sharp jawline and professional grooming. He is shown from three angles (front, side, profile) in a minimalist grid layout. He is wearing a white business shirt. Futuristic digital texture, clean white background. 8k resolution.",
        gender: "男",
        age: "26-30岁",
        ethnicity: "东亚",
        height: "181-185cm",
        weight: "71-75kg",
        style: "精英管理"
    },
    {
        id: "BGD-INTL-001",
        type: "background",
        src: "/images/assets/business/bg_intl_asian_male_lounge.png",
        title: "高管奢华酒廊场景",
        description: "资深亚洲男模在胡桃木质感的奢华酒廊中，营造高端私享的国际品牌氛围。",
        prompt: "Interior design of a luxury private lounge, dark wood paneling, leather armchairs, ambient warm lighting, golden accents, ultra-high-end atmosphere.",
        category: ["咖啡厅/酒廊"],
        lighting: ["暖调环境光"],
        style: ["品牌艺术"]
    },
    {
        id: "BGD-INTL-002",
        type: "background",
        src: "/images/assets/business/bg_intl_asian_male_coastal.png",
        title: "高端沿海度假场景",
        description: "摩登亚洲男性在极简海景露台中，展示度假休闲系列的完美剪裁。",
        prompt: "Minimalist outdoor terrace overlooking the ocean during sunset, soft orange and purple sky, luxury vacation vibe, clean architectural lines.",
        category: ["户外露台"],
        lighting: ["夕阳光影"],
        style: ["水系海景"]
    },
    {
        id: "BGD-INTL-003",
        type: "background",
        src: "/images/assets/business/bg_intl_asian_male_tech.png",
        title: "未来科技展厅场景",
        description: "先锋亚洲男性在极简科技感的冷调空间中，诠释功能性服饰的质感。",
        prompt: "High-tech minimalist exhibition hall, glowing blue lines on floor, frosted glass walls, futuristic lab aesthetic, cool toned lighting.",
        category: ["极简影棚"],
        lighting: ["专业影棚光"],
        style: ["现代科技"]
    },
    {
        id: "BGD-INTL-004",
        type: "background",
        src: "/images/assets/business/bg_intl_asian_male_urban.png",
        title: "国际都市街景巡航",
        description: "职场精英漫步在国际化大都市街道，展现日常通勤装的高级感。",
        prompt: "Modern city street with high-rise buildings, glass facades, clean sidewalks, bright natural daylight, bustling but professional urban environment.",
        category: ["城市街道"],
        lighting: ["明亮自然光"],
        style: ["城市街景"]
    },
    {
        id: "BGD-INTL-005",
        type: "background",
        src: "/images/assets/business/bg_intl_asian_male_mountain.png",
        title: "山川秘境探索场景",
        description: "在壮阔的自然景观中，由亚洲男模演绎户外奢华系列的磅礴气场。",
        prompt: "Cinematic mountain range with misty peaks, epic natural landscape, dramatic lighting, high-end travel adventure vibe.",
        category: ["公路/边际"],
        lighting: ["明亮自然光"],
        style: ["自然景观"]
    },
    {
        id: "GRM-004",
        type: "garment",
        src: "/images/assets/batch2/garments/shirt_white_main.png",
        title: "免烫极简白衬衫",
        description: "职场必备单品，高支棉免烫工艺，挺括有型。",
        prompt: "Ultra-clean white business shirt, wrinkle-free cotton, spread collar, minimalist design, high-end retail photography.",
        productNum: "WT-S01",
        productPrice: "¥ 699.00",
        composition: "100% 精梳长绒棉",
        designFeatures: "意式小方领，修身裁剪，无痕拼接工艺。",
        washMethod: "不可漂白，中温熨烫",
        afterSales: "30天质保服务",
        productCategory: ["上装"],
        backImg: "/images/assets/batch2/garments/shirt_white_back.png",
        leftImg: "/images/assets/batch2/garments/shirt_white_left.png",
        rightImg: "/images/assets/batch2/garments/shirt_white_right.png"
    },
]

export default function AssetsPage() {
    const router = useRouter()
    const [activeTab, setActiveTab] = useState("model")
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
    const [searchQuery, setSearchQuery] = useState("")
    const [assets, setAssets] = useState(initialAssets)
    const [editingAsset, setEditingAsset] = useState<any>(null)
    const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null)
    const [zoom, setZoom] = useState(100)
    const [rotation, setRotation] = useState(0)
    const [pan, setPan] = useState({ x: 0, y: 0 })
    const [isDragging, setIsDragging] = useState(false)
    const dragStart = useRef({ x: 0, y: 0 })
    const fileInputRef = useRef<HTMLInputElement>(null)
    const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
    const [fieldEditor, setFieldEditor] = useState<{ open: boolean, key: string, label: string, value: string, maxLength: number }>({
        open: false,
        key: "",
        label: "",
        value: "",
        maxLength: 1000
    })
    const [sleeveMenuOpen, setSleeveMenuOpen] = useState(false)
    const [bodyMenuOpen, setBodyMenuOpen] = useState(false)
    const [categoryMenuOpen, setCategoryMenuOpen] = useState(false)
    const [sceneMenuOpen, setSceneMenuOpen] = useState(false)
    const [lightingMenuOpen, setLightingMenuOpen] = useState(false)
    const [elementMenuOpen, setElementMenuOpen] = useState(false)
    const [modelGenderOpen, setModelGenderOpen] = useState(false)
    const [modelAgeOpen, setModelAgeOpen] = useState(false)
    const [modelEthnicityOpen, setModelEthnicityOpen] = useState(false)
    const [modelHeightOpen, setModelHeightOpen] = useState(false)
    const [modelWeightOpen, setModelWeightOpen] = useState(false)
    const [modelStyleOpen, setModelStyleOpen] = useState(false)
    const angleFileInputRef = useRef<HTMLInputElement>(null)
    const [activeAngleField, setActiveAngleField] = useState<string | null>(null)

    // Advanced Model Filters State
    const [modelFilters, setModelFilters] = useState<{
        gender: string[],
        age: string[],
        ethnicity: string[],
        height: string[],
        weight: string[],
        style: string[]
    }>({
        gender: [],
        age: [],
        ethnicity: [],
        height: [],
        weight: [],
        style: []
    })

    const [filterGenderOpen, setFilterGenderOpen] = useState(false)
    const [filterAgeOpen, setFilterAgeOpen] = useState(false)
    const [filterEthnicityOpen, setFilterEthnicityOpen] = useState(false)
    const [filterHeightOpen, setFilterHeightOpen] = useState(false)
    const [filterWeightOpen, setFilterWeightOpen] = useState(false)
    const [filterStyleOpen, setFilterStyleOpen] = useState(false)

    // Global click listener to close all dropdowns when clicking outside
    useEffect(() => {
        const closeAllMenus = () => {
            setSleeveMenuOpen(false);
            setBodyMenuOpen(false);
            setCategoryMenuOpen(false);
            setSceneMenuOpen(false);
            setLightingMenuOpen(false);
            setElementMenuOpen(false);
            setModelGenderOpen(false);
            setModelAgeOpen(false);
            setModelEthnicityOpen(false);
            setModelHeightOpen(false);
            setModelWeightOpen(false);
            setModelStyleOpen(false);
            // Close filter dropdowns
            setFilterGenderOpen(false);
            setFilterAgeOpen(false);
            setFilterEthnicityOpen(false);
            setFilterHeightOpen(false);
            setFilterWeightOpen(false);
            setFilterStyleOpen(false);
        };
        window.addEventListener('click', closeAllMenus);
        return () => window.removeEventListener('click', closeAllMenus);
    }, []);

    const filteredAssets = assets.filter(a => {
        if (a.type !== activeTab) return false;
        if (searchQuery && !a.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;

        // Model specific filters
        if (activeTab === "model") {
            const m = a as any;
            if (modelFilters.gender.length > 0 && !modelFilters.gender.includes(m.gender)) return false;
            if (modelFilters.age.length > 0 && !modelFilters.age.includes(m.age)) return false;
            if (modelFilters.ethnicity.length > 0 && !modelFilters.ethnicity.includes(m.ethnicity)) return false;
            if (modelFilters.height.length > 0 && !modelFilters.height.includes(m.height)) return false;
            if (modelFilters.weight.length > 0 && !modelFilters.weight.includes(m.weight)) return false;
            if (modelFilters.style.length > 0 && !modelFilters.style.includes(m.style)) return false;
        }

        return true;
    })

    const handleUploadClick = () => {
        fileInputRef.current?.click()
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || [])
        if (files.length > 0) {
            const newAssets = files.map(file => {
                const isGarment = activeTab === "garment"
                const isBg = activeTab === "background"
                const prefix = isGarment ? "GRM" : (isBg ? "BGD" : "MDL")
                const newId = `M${Math.floor(100 + Math.random() * 900)}-${prefix}`

                return {
                    id: newId,
                    type: activeTab,
                    src: URL.createObjectURL(file), // Generate local preview URL
                    title: file.name,
                    description: "双击编辑完善资产信息..."
                } as any
            })

            setAssets(prev => [...newAssets, ...prev])

            // Clear input so the same file could be selected again if needed
            e.target.value = "" // Reset
        }
    }

    const handleAngleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file && activeAngleField) {
            const previewUrl = URL.createObjectURL(file)
            setEditingAsset((prev: any) => ({
                ...prev,
                [activeAngleField]: previewUrl
            }))
            e.target.value = "" // Reset
            setActiveAngleField(null)
        }
    }

    const handleSaveAsset = () => {
        if (!editingAsset) return;
        setAssets(prev => prev.map(a => a.id === editingAsset.id ? { ...editingAsset, modifier: "SysAdmin", modifyTime: new Date().toLocaleString() } : a));
        setEditingAsset(null);
    };

    return (
        <div className="flex flex-col h-full overflow-hidden bg-background">
            {/* Hidden File Input for trigger */}
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                multiple
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
            />

            {/* Header section with Title and main Upload Button */}
            <div className="flex h-20 shrink-0 items-center justify-between border-b border-border px-8 bg-white z-10 w-full">
                <div>
                    <h1 className="font-display text-2xl font-bold text-foreground tracking-tight">素材库</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        管理您的服装素材、模特和生成背景
                    </p>
                </div>
            </div>

            {/* Tabs Menu */}
            <div className="flex-none px-8 pb-4 border-b border-border/50">
                <div className="flex items-center gap-2">
                    {tabs.map((tab) => {
                        const isActive = activeTab === tab.id
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={cn(
                                    "flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-medium transition-all duration-200",
                                    isActive
                                        ? "bg-transparent border-b-2 border-primary text-primary" // Highlighting exact styling as per image
                                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                                )}
                                style={{
                                    borderBottomWidth: isActive ? "2px" : "0",
                                    borderBottomColor: isActive ? "hsl(var(--primary))" : "transparent",
                                    borderRadius: isActive ? "0" : "0.375rem" // Flat bottom when active underscore
                                }}
                            >
                                <tab.icon className={cn("w-4 h-4", isActive ? "text-primary" : "text-muted-foreground")} />
                                {tab.label}
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* Toolbar: Search, Filters, and View modes */}
            <div className="flex-none px-8 py-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            className="w-[300px] pl-9 h-10 bg-card border-border/60 focus-visible:ring-1 focus-visible:ring-primary/50 text-sm shadow-sm rounded-md"
                            placeholder="搜索素材名称..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    {activeTab === "model" && (
                        <div className="flex items-center gap-2">
                            {[
                                { key: 'gender', label: '性别', options: MODEL_GENDERS, open: filterGenderOpen, setOpen: setFilterGenderOpen },
                                { key: 'age', label: '年龄层', options: MODEL_AGES, open: filterAgeOpen, setOpen: setFilterAgeOpen },
                                { key: 'ethnicity', label: '族裔', options: MODEL_ETHNICITIES, open: filterEthnicityOpen, setOpen: setFilterEthnicityOpen },
                                { key: 'height', label: '身高', options: MODEL_HEIGHTS, open: filterHeightOpen, setOpen: setFilterHeightOpen },
                                { key: 'weight', label: '体重', options: MODEL_WEIGHTS, open: filterWeightOpen, setOpen: setFilterWeightOpen },
                                { key: 'style', label: '风格', options: MODEL_STYLES, open: filterStyleOpen, setOpen: setFilterStyleOpen },
                            ].map((f) => {
                                const activeCount = (modelFilters as any)[f.key].length;
                                return (
                                    <div key={f.key} className="relative">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                const currentOpen = f.open;
                                                // Close all other filter menus first
                                                setFilterGenderOpen(false);
                                                setFilterAgeOpen(false);
                                                setFilterEthnicityOpen(false);
                                                setFilterHeightOpen(false);
                                                setFilterWeightOpen(false);
                                                setFilterStyleOpen(false);
                                                f.setOpen(!currentOpen);
                                            }}
                                            className={cn(
                                                "h-9 px-3 border-border/60 text-[12px] font-medium transition-all gap-1.5",
                                                activeCount > 0 ? "border-primary text-primary bg-primary/5" : "text-slate-600 hover:bg-secondary",
                                                f.open && "ring-1 ring-primary/20 border-primary"
                                            )}
                                        >
                                            {f.label}
                                            {activeCount > 0 && (
                                                <span className="flex items-center justify-center min-w-[16px] h-4 px-1 rounded-full bg-primary text-white text-[10px] font-bold">
                                                    {activeCount}
                                                </span>
                                            )}
                                            <ChevronDown className={cn("w-3 h-3 transition-transform", f.open && "rotate-180")} />
                                        </Button>

                                        {f.open && (
                                            <div
                                                onClick={(e) => e.stopPropagation()}
                                                className="absolute top-full left-0 mt-2 w-48 bg-white border border-slate-200 rounded-lg shadow-xl z-[50] py-1 animate-in fade-in slide-in-from-top-1 duration-200 max-h-[300px] overflow-y-auto custom-scrollbar"
                                            >
                                                {f.options.map((opt) => {
                                                    const isSelected = (modelFilters as any)[f.key].includes(opt);
                                                    return (
                                                        <button
                                                            key={opt}
                                                            onClick={() => {
                                                                const current = (modelFilters as any)[f.key];
                                                                const next = isSelected
                                                                    ? current.filter((i: string) => i !== opt)
                                                                    : [...current, opt];
                                                                setModelFilters({ ...modelFilters, [f.key]: next });
                                                            }}
                                                            className={cn(
                                                                "w-full text-left px-3 py-2 text-[11px] flex items-center justify-between transition-colors",
                                                                isSelected ? "bg-primary/5 text-primary font-medium" : "text-slate-600 hover:bg-slate-50"
                                                            )}
                                                        >
                                                            {opt}
                                                            {isSelected && <Check className="w-3 h-3 text-primary" />}
                                                        </button>
                                                    );
                                                })}
                                                <div className="border-t border-slate-50 mt-1 pt-1 px-1">
                                                    <button
                                                        onClick={() => setModelFilters({ ...modelFilters, [f.key]: [] })}
                                                        className="w-full text-center py-1.5 text-[10px] text-slate-400 hover:text-primary transition-colors"
                                                    >
                                                        重置该项
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}

                            {Object.values(modelFilters).some(v => v.length > 0) && (
                                <button
                                    onClick={() => setModelFilters({ gender: [], age: [], ethnicity: [], height: [], weight: [], style: [] })}
                                    className="ml-2 text-[11px] text-muted-foreground hover:text-primary transition-colors"
                                >
                                    重置全部
                                </button>
                            )}
                        </div>
                    )}
                </div>

                <div className="flex items-center bg-secondary/50 p-1 rounded-md border border-border/60">
                    <button
                        onClick={() => setViewMode("grid")}
                        className={cn(
                            "p-1.5 rounded-sm transition-colors",
                            viewMode === "grid" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                        )}
                    >
                        <Grid className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => setViewMode("list")}
                        className={cn(
                            "p-1.5 rounded-sm transition-colors",
                            viewMode === "list" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                        )}
                    >
                        <List className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Main Grid View */}
            <div className="flex-1 overflow-y-auto px-8 pb-8 hide-scrollbar">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">

                    {/* Add New Asset Card */}
                    <button
                        onClick={handleUploadClick}
                        className="group flex flex-col items-center justify-center aspect-[3/4] rounded-2xl border-2 border-dashed border-border/60 bg-transparent hover:border-primary/40 hover:bg-primary/5 transition-all duration-200"
                    >
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-secondary text-primary group-hover:bg-primary/10 transition-colors mb-3">
                            <Plus className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">
                            添加新素材
                        </span>
                    </button>

                    {/* Render Mock Assets dynamically based on Selected Tab & Search Query */}
                    {filteredAssets.map((asset, index) => (
                        <div
                            key={asset.id}
                            onClick={() => {
                                if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current)
                                clickTimeoutRef.current = setTimeout(() => {
                                    setEditingAsset({ ...asset })
                                }, 250)
                            }}
                            onDoubleClick={(e) => {
                                e.stopPropagation()
                                if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current)
                                router.push(`/dashboard/assets/related/${asset.id}`)
                            }}
                            className="group relative aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer shadow-sm border border-border/40"
                        >
                            <Image
                                src={asset.src}
                                alt={asset.title}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            {asset.prompt && (
                                <div className="absolute top-3 left-3 z-10 bg-black/40 backdrop-blur-md rounded-full px-2 py-1 border border-white/20 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity translate-y-1 group-hover:translate-y-0 duration-300">
                                    <Sparkles className="w-2.5 h-2.5 text-primary fill-primary" />
                                    <span className="text-[9px] text-white font-bold tracking-widest leading-none mt-0.5">AI</span>
                                </div>
                            )}
                            {/* Hover Overlay with ID and Description */}
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-end p-4">
                                <span className="absolute top-3 right-3 bg-black/50 text-white/90 px-2 py-1 rounded-md text-[10px] font-medium backdrop-blur-sm pointer-events-none">双击编辑</span>
                                <span className="text-white/60 font-mono text-[10px] mb-1 leading-none">ID: {asset.id}</span>
                                <p className="text-white font-medium text-sm line-clamp-1">{asset.title}</p>
                                <p className="text-white/80 text-[11px] mt-1 line-clamp-2 leading-snug">{asset.description}</p>
                            </div>
                        </div>
                    ))}

                </div>
            </div>

            {/* Asset Detail Dialog - Conditional rendering based on type */}
            {editingAsset && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-xl shadow-2xl w-[1240px] max-w-[95vw] h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
                        {/* Header */}
                        <div className="h-14 flex items-center justify-between px-6 border-b shrink-0 bg-white">
                            <h2 className="text-base font-bold text-slate-800">
                                {editingAsset.type === 'garment' ? '产品详情' : (editingAsset.type === 'model' ? '模特详情' : '内容背景详情')}
                            </h2>
                            <button onClick={() => setEditingAsset(null)} className="p-2 -mr-2 text-slate-400 hover:text-slate-600 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Main Body - Scrollable */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-slate-50/30">
                            {editingAsset.type === 'garment' ? (
                                <div className="grid grid-cols-12 gap-6">
                                    {/* Existing Garment Layout (Row 1-4) */}
                                    {/* Row 1: Main Image & Bio/Composition/Design */}
                                    <div className="col-span-6">
                                        <div className="bg-white rounded-xl p-4 border border-slate-200/60 shadow-sm relative overflow-hidden group">
                                            <div className="aspect-square relative rounded-lg overflow-hidden bg-slate-100 flex items-center justify-center">
                                                <Image src={editingAsset.src} alt={editingAsset.title} fill className="object-contain" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-span-6 space-y-6">
                                        {/* Basic Info and Composition Side by Side */}
                                        <div className="grid grid-cols-2 gap-6 items-stretch">
                                            <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm overflow-visible p-5 flex flex-col h-[380px]">
                                                <h3 className="text-sm font-bold text-slate-800 mb-4 pb-3 border-b border-slate-100 shrink-0">基本信息</h3>
                                                <div className="space-y-3 pr-1">
                                                    <div className="flex items-center justify-between py-0.5">
                                                        <span className="text-[12px] text-slate-500">图片ID:</span>
                                                        <span className="text-[12px] text-slate-800 font-mono">{editingAsset.id}</span>
                                                    </div>
                                                    {[
                                                        { key: 'productNum', label: '产品编号' },
                                                        { key: 'productName', label: '产品名称' },
                                                        { key: 'productPrice', label: '产品价格' },
                                                        { key: 'productSize', label: '产品尺码' },
                                                    ].map((field) => (
                                                        <div key={field.key} className="flex items-center justify-between group/field py-0.5 border-b border-slate-50 last:border-0">
                                                            <span className="text-[12px] text-slate-500">{field.label}:</span>
                                                            <div className="flex items-center gap-2 max-w-[60%]">
                                                                <span className="text-[12px] text-slate-800 truncate">{(editingAsset as any)[field.key] || "-"}</span>
                                                                <button
                                                                    onClick={() => setFieldEditor({ open: true, key: field.key, label: field.label, value: (editingAsset as any)[field.key] || "", maxLength: 50 })}
                                                                    className="text-slate-300 hover:text-primary transition-colors opacity-0 group-hover/field:opacity-100"
                                                                >
                                                                    <Pencil className="w-3.5 h-3.5" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}

                                                    {/* Product Category Multi-select Dropdown */}
                                                    <div className="flex flex-col gap-1.5 py-1.5 border-b border-slate-50">
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-[12px] text-slate-500">产品类别:</span>
                                                            <div className="relative">
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        setCategoryMenuOpen(!categoryMenuOpen);
                                                                    }}
                                                                    className={cn(
                                                                        "flex items-center gap-1 px-2 py-1 rounded border text-[11px] transition-all",
                                                                        categoryMenuOpen ? "border-primary text-primary" : "border-slate-200 text-slate-600 hover:border-slate-300"
                                                                    )}
                                                                >
                                                                    <span>{(editingAsset.productCategory && editingAsset.productCategory.length > 0) ? `已选 ${editingAsset.productCategory.length}` : "未选择"}</span>
                                                                    <ChevronDown className={cn("w-3 h-3 transition-transform", categoryMenuOpen && "rotate-180")} />
                                                                </button>

                                                                {categoryMenuOpen && (
                                                                    <div
                                                                        onClick={(e) => e.stopPropagation()}
                                                                        className="absolute top-full right-0 mt-1 w-32 bg-white border border-slate-200 rounded-lg shadow-xl z-[40] py-1 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-200"
                                                                    >
                                                                        {PRODUCT_CATEGORIES.map((cat) => {
                                                                            const isSelected = (editingAsset.productCategory || []).includes(cat);
                                                                            return (
                                                                                <button
                                                                                    key={cat}
                                                                                    onClick={() => {
                                                                                        const current = editingAsset.productCategory || [];
                                                                                        const next = isSelected
                                                                                            ? current.filter((c: string) => c !== cat)
                                                                                            : [...current, cat];
                                                                                        setEditingAsset({ ...editingAsset, productCategory: next });
                                                                                    }}
                                                                                    className={cn(
                                                                                        "w-full text-left px-3 py-2 text-[11px] flex items-center justify-between transition-colors",
                                                                                        isSelected ? "bg-primary/5 text-primary font-medium" : "text-slate-600 hover:bg-slate-50"
                                                                                    )}
                                                                                >
                                                                                    {cat}
                                                                                    {isSelected && <Check className="w-3 h-3" />}
                                                                                </button>
                                                                            );
                                                                        })}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-wrap gap-1">
                                                            {(editingAsset.productCategory || []).length > 0 ? (
                                                                (editingAsset.productCategory || []).map((cat: string) => (
                                                                    <span key={cat} className="px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px]">
                                                                        {cat}
                                                                    </span>
                                                                ))
                                                            ) : (
                                                                <span className="text-[10px] text-slate-400 italic">尚未分类</span>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {[
                                                        { key: 'brandInfo', label: '品牌信息' },
                                                        { key: 'salesCount', label: '销售数量' },
                                                    ].map((field) => (
                                                        <div key={field.key} className="flex items-center justify-between group/field py-0.5 border-b border-slate-50 last:border-0">
                                                            <span className="text-[12px] text-slate-500">{field.label}:</span>
                                                            <div className="flex items-center gap-2 max-w-[60%]">
                                                                <span className="text-[12px] text-slate-800 truncate">{(editingAsset as any)[field.key] || "-"}</span>
                                                                <button
                                                                    onClick={() => setFieldEditor({ open: true, key: field.key, label: field.label, value: (editingAsset as any)[field.key] || "", maxLength: 50 })}
                                                                    className="text-slate-300 hover:text-primary transition-colors opacity-0 group-hover/field:opacity-100"
                                                                >
                                                                    <Pencil className="w-3.5 h-3.5" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm overflow-hidden p-5 flex flex-col h-[380px]">
                                                <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 shrink-0">
                                                    <h3 className="text-sm font-bold text-slate-800">成分信息</h3>
                                                    <button
                                                        onClick={() => setFieldEditor({ open: true, key: 'composition', label: '成分信息', value: editingAsset.composition || "", maxLength: 50 })}
                                                        className="text-slate-300 hover:text-primary transition-colors"
                                                    >
                                                        <Pencil className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                                <div className="text-[12px] text-slate-600 leading-relaxed overflow-y-auto custom-scrollbar flex-1">
                                                    {editingAsset.composition || "-"}
                                                </div>
                                            </div>
                                        </div>
                                        {/* Design Points Section */}
                                        <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm overflow-hidden p-5 flex-1 min-h-[140px]">
                                            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                                                <h3 className="text-sm font-bold text-slate-800">设计特点或产品卖点</h3>
                                                <button
                                                    onClick={() => setFieldEditor({ open: true, key: 'designFeatures', label: '设计特点或产品卖点', value: editingAsset.designFeatures || "", maxLength: 50 })}
                                                    className="text-slate-300 hover:text-primary transition-colors"
                                                >
                                                    <Pencil className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                            <div className="text-[13px] text-slate-600 leading-relaxed">
                                                {editingAsset.designFeatures || "-"}
                                            </div>
                                        </div>

                                        {/* Prompt Section for Garments */}
                                        <div className="bg-[#f8f9fa] rounded-xl border border-primary/20 shadow-sm overflow-hidden p-5 flex-1 min-h-[140px] flex flex-col">
                                            <div className="flex items-center justify-between mb-4 pb-3 border-b border-primary/10 shrink-0">
                                                <h3 className="text-sm font-bold text-primary flex items-center gap-2">
                                                    <Sparkles className="w-4 h-4" /> Prompt 指示词
                                                </h3>
                                                <button
                                                    onClick={() => setFieldEditor({ open: true, key: 'prompt', label: 'Prompt 指示词', value: editingAsset.prompt || "", maxLength: 1000 })}
                                                    className="text-primary/40 hover:text-primary transition-colors"
                                                >
                                                    <Pencil className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                            <div className="text-[13px] text-slate-600 italic leading-relaxed overflow-y-auto custom-scrollbar flex-1">
                                                {editingAsset.prompt || "暂无指示词记录..."}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Row 2: Angle Images & After-sales */}
                                    <div className="col-span-6">
                                        <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm relative h-[180px] flex flex-col overflow-hidden">
                                            <div className="bg-slate-50/50 px-4 py-3 border-b border-slate-200/60 shrink-0">
                                                <h3 className="text-sm font-bold text-slate-800">角度图</h3>
                                            </div>
                                            <div className="px-4 flex gap-3 overflow-x-auto py-4 flex-1 custom-scrollbar">
                                                {[
                                                    { key: 'backImg', label: '背面图' },
                                                    { key: 'leftImg', label: '左面图' },
                                                    { key: 'rightImg', label: '右面图' },
                                                    { key: 'topImg', label: '俯视图' },
                                                    { key: 'bottomImg', label: '仰视图' },
                                                ].map((angle) => {
                                                    const imgUrl = (editingAsset as any)[angle.key];
                                                    return (
                                                        <div key={angle.key} className="flex flex-col items-center gap-2 shrink-0">
                                                            <div className="relative">
                                                                {imgUrl ? (
                                                                    <div className="w-20 h-20 rounded-lg overflow-visible border border-slate-200 bg-slate-50 relative">
                                                                        <div className="w-full h-full rounded-lg overflow-hidden relative">
                                                                            <Image src={imgUrl} alt={angle.label} fill className="object-cover" />
                                                                        </div>
                                                                        <button
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                setEditingAsset({ ...editingAsset, [angle.key]: "" });
                                                                            }}
                                                                            className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#e1251b] rounded-full flex items-center justify-center text-white shadow-md hover:bg-red-600 transition-colors z-10 border-2 border-white"
                                                                        >
                                                                            <Minus className="w-3 h-3 stroke-[4]" />
                                                                        </button>
                                                                    </div>
                                                                ) : (
                                                                    <button
                                                                        onClick={() => {
                                                                            setActiveAngleField(angle.key);
                                                                            angleFileInputRef.current?.click();
                                                                        }}
                                                                        className="w-20 h-20 rounded-lg border-2 border-dashed border-slate-200 flex flex-col items-center justify-center hover:border-primary/40 hover:bg-primary/5 transition-all group"
                                                                    >
                                                                        <Plus className="w-4 h-4 text-slate-300 group-hover:text-primary mb-1" />
                                                                        <span className="text-[10px] text-slate-400 group-hover:text-primary">上传</span>
                                                                    </button>
                                                                )}
                                                            </div>
                                                            <span className="text-[11px] text-slate-500">{angle.label}</span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-span-6">
                                        <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm overflow-hidden p-5 h-[180px] flex flex-col">
                                            <h3 className="text-sm font-bold text-slate-800 mb-4 pb-3 border-b border-slate-100 shrink-0">产品售后信息</h3>
                                            <div className="space-y-4 flex-1 overflow-y-auto custom-scrollbar pr-1">
                                                <div className="flex items-start justify-between group/field">
                                                    <span className="text-[13px] text-slate-500 shrink-0">洗涤/维护方法:</span>
                                                    <div className="flex items-center gap-2 max-w-[70%]">
                                                        <span className="text-[13px] text-slate-800 text-right">{editingAsset.washMethod || "-"}</span>
                                                        <button
                                                            onClick={() => setFieldEditor({ open: true, key: 'washMethod', label: '洗涤/维护方法', value: editingAsset.washMethod || "", maxLength: 50 })}
                                                            className="text-slate-300 hover:text-primary transition-colors shrink-0"
                                                        >
                                                            <Pencil className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="flex items-start justify-between group/field">
                                                    <span className="text-[13px] text-slate-500 shrink-0">售后服务:</span>
                                                    <div className="flex items-center gap-2 max-w-[70%]">
                                                        <span className="text-[13px] text-slate-800 text-right">{editingAsset.afterSales || "-"}</span>
                                                        <button
                                                            onClick={() => setFieldEditor({ open: true, key: 'afterSales', label: '售后服务', value: editingAsset.afterSales || "", maxLength: 50 })}
                                                            className="text-slate-300 hover:text-primary transition-colors shrink-0"
                                                        >
                                                            <Pencil className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Row 3: Key Position & Purchase/Creator */}
                                    <div className="col-span-6">
                                        <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm overflow-hidden h-[320px] flex flex-col">
                                            <div className="bg-slate-50/50 px-4 py-3 border-b border-slate-200/60 shrink-0">
                                                <h3 className="text-sm font-bold text-slate-800">关键位置提醒</h3>
                                            </div>
                                            <div className="p-4 space-y-4 flex-1 overflow-y-auto custom-scrollbar">
                                                <p className="text-[11px] text-slate-400 leading-relaxed mb-1">
                                                    提醒AI试穿的时候需要注意哪些位置，只需要说出位置就可以了，无需描述细节。比如你可以说"注意领口位置"或者"注意裤腰前方位置"等等。
                                                </p>
                                                {[1, 2, 3, 4, 5].map((idx) => (
                                                    <div key={idx} className="flex items-center justify-between group/field py-1 border-b border-slate-50 last:border-0">
                                                        <span className="text-[12px] text-slate-500 shrink-0 w-24">位置{idx}:</span>
                                                        <span className="text-[12px] text-slate-800 flex-1 truncate text-right mr-3">{(editingAsset as any)[`pos${idx}`] || "-"}</span>
                                                        <button
                                                            onClick={() => setFieldEditor({ open: true, key: `pos${idx}`, label: `关键位置提醒 - 位置${idx}`, value: (editingAsset as any)[`pos${idx}`] || "", maxLength: 50 })}
                                                            className="text-slate-300 hover:text-primary transition-colors"
                                                        >
                                                            <Pencil className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-span-6 space-y-6">
                                        <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm overflow-hidden p-5 h-[205px] flex flex-col">
                                            <h3 className="text-sm font-bold text-slate-800 mb-4 pb-3 border-b border-slate-100 shrink-0">购买信息</h3>
                                            <div className="space-y-4 flex-1 overflow-y-auto custom-scrollbar pr-1">
                                                {[
                                                    { key: 'wechatLink', label: '微信小程序链接' },
                                                    { key: 'pinduoduoLink', label: '拼多多链接' },
                                                    { key: 'taobaoLink', label: '淘宝链接' },
                                                ].map((link) => (
                                                    <div key={link.key} className="flex items-center justify-between group/field">
                                                        <span className="text-[13px] text-slate-500">{link.label}:</span>
                                                        <div className="flex items-center gap-2 max-w-[70%]">
                                                            <span className="text-[13px] text-slate-400 truncate italic">{(editingAsset as any)[link.key] || "-"}</span>
                                                            <button
                                                                onClick={() => setFieldEditor({ open: true, key: link.key, label: link.label, value: (editingAsset as any)[link.key] || "", maxLength: 50 })}
                                                                className="text-slate-300 hover:text-primary transition-colors shrink-0"
                                                            >
                                                                <Pencil className="w-3.5 h-3.5" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="bg-slate-50 rounded-xl border border-slate-100 shadow-sm p-5 grid grid-cols-2 gap-y-4 gap-x-8 h-[115px] shrink-0 content-center">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-[11px] text-slate-400">创建人:</span>
                                                <span className="text-[12px] text-slate-600 font-medium">{editingAsset.creator || "SysAdmin"}</span>
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <span className="text-[11px] text-slate-400">创建时间:</span>
                                                <span className="text-[12px] text-slate-600 font-medium">{editingAsset.createTime || "2026-03-01"}</span>
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <span className="text-[11px] text-slate-400">修改人:</span>
                                                <span className="text-[12px] text-slate-600 font-medium">{editingAsset.modifier || "-"}</span>
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <span className="text-[11px] text-slate-400">修改时间:</span>
                                                <span className="text-[12px] text-slate-600 font-medium">{editingAsset.modifyTime || "-"}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Row 4: Length Selection */}
                                    <div className="col-span-6">
                                        <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm relative">
                                            <div className="bg-slate-50/50 px-4 py-3 border-b border-slate-200/60">
                                                <h3 className="text-sm font-bold text-slate-800">长度选择</h3>
                                            </div>
                                            <div className="p-4 space-y-4">
                                                {/* Sleeve Length Dropdown */}
                                                <div className="relative">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setSleeveMenuOpen(!sleeveMenuOpen);
                                                        }}
                                                        className={cn(
                                                            "w-full flex items-center justify-between h-10 px-4 text-[13px] text-slate-700 bg-white border rounded-lg transition-all",
                                                            sleeveMenuOpen ? "border-primary ring-1 ring-primary/20" : "border-slate-200 hover:border-slate-300"
                                                        )}
                                                    >
                                                        <span className={editingAsset.sleeveLength ? "text-slate-800" : "text-slate-400"}>
                                                            {editingAsset.sleeveLength || "袖长描述"}
                                                        </span>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-[12px] text-slate-400 font-medium">请选择</span>
                                                            <ChevronDown className={cn("w-4 h-4 text-slate-400 transition-transform duration-200", sleeveMenuOpen && "rotate-180")} />
                                                        </div>
                                                    </button>

                                                    {sleeveMenuOpen && (
                                                        <div
                                                            onClick={(e) => e.stopPropagation()}
                                                            className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-xl z-[30] py-1 max-h-[240px] overflow-y-auto custom-scrollbar animate-in fade-in slide-in-from-top-1 duration-200"
                                                        >
                                                            {editingAsset.sleeveLength && (
                                                                <button
                                                                    onClick={() => {
                                                                        setEditingAsset({ ...editingAsset, sleeveLength: "" });
                                                                        setSleeveMenuOpen(false);
                                                                    }}
                                                                    className="w-full text-left px-4 py-2.5 text-[12px] text-red-500 hover:bg-red-50 transition-colors border-b border-slate-100 mb-1 font-medium"
                                                                >
                                                                    清空
                                                                </button>
                                                            )}
                                                            {SLEEVE_LENGTHS.map((len) => (
                                                                <button
                                                                    key={len}
                                                                    onClick={() => {
                                                                        setEditingAsset({ ...editingAsset, sleeveLength: len });
                                                                        setSleeveMenuOpen(false);
                                                                    }}
                                                                    className={cn(
                                                                        "w-full text-left px-4 py-2.5 text-[12px] transition-colors whitespace-normal leading-relaxed",
                                                                        editingAsset.sleeveLength === len
                                                                            ? "bg-slate-50 text-primary font-medium"
                                                                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                                                    )}
                                                                >
                                                                    {len}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Body Length Dropdown */}
                                                <div className="relative">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setBodyMenuOpen(!bodyMenuOpen);
                                                        }}
                                                        className={cn(
                                                            "w-full flex items-center justify-between h-10 px-4 text-[13px] text-slate-700 bg-white border rounded-lg transition-all",
                                                            bodyMenuOpen ? "border-primary ring-1 ring-primary/20" : "border-slate-200 hover:border-slate-300"
                                                        )}
                                                    >
                                                        <span className={editingAsset.bodyLength ? "text-slate-800" : "text-slate-400"}>
                                                            {editingAsset.bodyLength || "身长描述"}
                                                        </span>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-[12px] text-slate-400 font-medium">请选择</span>
                                                            <ChevronDown className={cn("w-4 h-4 text-slate-400 transition-transform duration-200", bodyMenuOpen && "rotate-180")} />
                                                        </div>
                                                    </button>

                                                    {bodyMenuOpen && (
                                                        <div
                                                            onClick={(e) => e.stopPropagation()}
                                                            className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-xl z-[30] py-1 max-h-[240px] overflow-y-auto custom-scrollbar animate-in fade-in slide-in-from-top-1 duration-200"
                                                        >
                                                            {editingAsset.bodyLength && (
                                                                <button
                                                                    onClick={() => {
                                                                        setEditingAsset({ ...editingAsset, bodyLength: "" });
                                                                        setBodyMenuOpen(false);
                                                                    }}
                                                                    className="w-full text-left px-4 py-2.5 text-[12px] text-red-500 hover:bg-red-50 transition-colors border-b border-slate-100 mb-1 font-medium"
                                                                >
                                                                    清空
                                                                </button>
                                                            )}
                                                            {BODY_LENGTHS.map((len) => (
                                                                <button
                                                                    key={len}
                                                                    onClick={() => {
                                                                        setEditingAsset({ ...editingAsset, bodyLength: len });
                                                                        setBodyMenuOpen(false);
                                                                    }}
                                                                    className={cn(
                                                                        "w-full text-left px-4 py-2.5 text-[12px] transition-colors whitespace-normal leading-relaxed",
                                                                        editingAsset.bodyLength === len
                                                                            ? "bg-slate-50 text-primary font-medium"
                                                                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                                                    )}
                                                                >
                                                                    {len}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : editingAsset.type === 'model' ? (
                                <div className="grid grid-cols-12 gap-6">
                                    {/* Model Detail Layout */}
                                    <div className="col-span-6">
                                        <div className="bg-white rounded-xl p-4 border border-slate-200/60 shadow-sm relative overflow-hidden group">
                                            <div className="aspect-[3/4] relative rounded-lg overflow-hidden bg-slate-100">
                                                <Image src={editingAsset.src} alt={editingAsset.title} fill className="object-cover" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-span-6 space-y-6">
                                        <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm overflow-visible p-5 flex flex-col min-h-[400px]">
                                            <h3 className="text-sm font-bold text-slate-800 mb-4 pb-3 border-b border-slate-100 shrink-0">模特基本信息</h3>
                                            <div className="space-y-4 pr-1">
                                                <div className="flex items-center justify-between py-1">
                                                    <span className="text-[13px] text-slate-500">模特ID:</span>
                                                    <span className="text-[13px] text-slate-800 font-mono font-bold">{editingAsset.id}</span>
                                                </div>

                                                <div className="flex items-center justify-between group/field py-1 border-b border-slate-50">
                                                    <span className="text-[13px] text-slate-500">模特名称:</span>
                                                    <div className="flex items-center gap-2 max-w-[60%]">
                                                        <span className="text-[13px] text-slate-800 font-medium">{editingAsset.title || "-"}</span>
                                                        <button
                                                            onClick={() => setFieldEditor({ open: true, key: 'title', label: '模特名称', value: editingAsset.title || "", maxLength: 50 })}
                                                            className="text-slate-300 hover:text-primary transition-colors opacity-0 group-hover/field:opacity-100"
                                                        >
                                                            <Pencil className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Single-select Dropdowns for Model Fields */}
                                                {[
                                                    { key: 'gender', label: '性别', options: MODEL_GENDERS, open: modelGenderOpen, setOpen: setModelGenderOpen },
                                                    { key: 'age', label: '年龄层', options: MODEL_AGES, open: modelAgeOpen, setOpen: setModelAgeOpen },
                                                    { key: 'ethnicity', label: '族裔', options: MODEL_ETHNICITIES, open: modelEthnicityOpen, setOpen: setModelEthnicityOpen },
                                                    { key: 'height', label: '身高 (cm)', options: MODEL_HEIGHTS, open: modelHeightOpen, setOpen: setModelHeightOpen },
                                                    { key: 'weight', label: '体重 (kg)', options: MODEL_WEIGHTS, open: modelWeightOpen, setOpen: setModelWeightOpen },
                                                    { key: 'style', label: '模特风格', options: MODEL_STYLES, open: modelStyleOpen, setOpen: setModelStyleOpen },
                                                ].map((field) => (
                                                    <div key={field.key} className="flex items-center justify-between group/field py-1.5 border-b border-slate-50 last:border-0">
                                                        <span className="text-[13px] text-slate-500">{field.label}:</span>
                                                        <div className="relative">
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    field.setOpen(!field.open);
                                                                }}
                                                                className={cn(
                                                                    "flex items-center gap-2 px-3 py-1 rounded border text-[12px] transition-all min-w-[120px] justify-between",
                                                                    field.open ? "border-primary text-primary" : "border-slate-200 text-slate-700 hover:border-slate-300"
                                                                )}
                                                            >
                                                                <span className="truncate">{editingAsset[field.key] || "请选择"}</span>
                                                                <ChevronDown className={cn("w-3 h-3 transition-transform shrink-0", field.open && "rotate-180")} />
                                                            </button>

                                                            {field.open && (
                                                                <div
                                                                    onClick={(e) => e.stopPropagation()}
                                                                    className="absolute top-full right-0 mt-1 w-40 bg-white border border-slate-200 rounded-lg shadow-xl z-[40] py-1 overflow-y-auto max-h-[200px] custom-scrollbar animate-in fade-in slide-in-from-top-1 duration-200"
                                                                >
                                                                    {field.options.map((opt) => {
                                                                        const isSelected = editingAsset[field.key] === opt;
                                                                        return (
                                                                            <button
                                                                                key={opt}
                                                                                onClick={() => {
                                                                                    setEditingAsset({ ...editingAsset, [field.key]: opt });
                                                                                    field.setOpen(false);
                                                                                }}
                                                                                className={cn(
                                                                                    "w-full text-left px-3 py-2 text-[11px] flex items-center justify-between transition-colors",
                                                                                    isSelected ? "bg-primary/5 text-primary font-medium" : "text-slate-600 hover:bg-slate-50"
                                                                                )}
                                                                            >
                                                                                {opt}
                                                                                {isSelected && <Check className="w-3 h-3" />}
                                                                            </button>
                                                                        );
                                                                    })}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm overflow-hidden p-5 flex flex-col min-h-[140px]">
                                            <div className="text-[13px] text-slate-600 leading-relaxed overflow-y-auto custom-scrollbar flex-1">
                                                {editingAsset.description || "暂无说明..."}
                                            </div>
                                        </div>

                                        <div className="bg-[#f8f9fa] rounded-xl border border-primary/20 shadow-sm overflow-hidden p-5 flex flex-col min-h-[140px]">
                                            <h3 className="text-sm font-bold text-primary mb-4 pb-3 border-b border-primary/10 shrink-0 flex items-center gap-2">
                                                <Sparkles className="w-4 h-4" /> Prompt 指示词
                                            </h3>
                                            <div className="text-[13px] text-slate-600 italic leading-relaxed overflow-y-auto custom-scrollbar flex-1 relative group/prompt">
                                                {editingAsset.prompt || "暂无指示词记录..."}
                                                <button
                                                    onClick={() => setFieldEditor({ open: true, key: 'prompt', label: 'Prompt 指示词', value: editingAsset.prompt || "", maxLength: 1000 })}
                                                    className="absolute top-0 right-0 text-primary/40 hover:text-primary transition-colors opacity-0 group-hover/prompt:opacity-100"
                                                >
                                                    <Pencil className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="bg-slate-50 rounded-xl border border-slate-100 shadow-sm p-5 grid grid-cols-2 gap-y-4 gap-x-8 shrink-0 content-center">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-[11px] text-slate-400">资源创建:</span>
                                                <span className="text-[12px] text-slate-600 font-medium">{editingAsset.creator || "System"}</span>
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <span className="text-[11px] text-slate-400">创建时间:</span>
                                                <span className="text-[12px] text-slate-600 font-medium">{editingAsset.createTime || "2026-03-01"}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-12 gap-6">
                                    {/* Background Detail Layout */}
                                    <div className="col-span-8">
                                        <div className="bg-white rounded-xl p-4 border border-slate-200/60 shadow-sm relative overflow-hidden group">
                                            <div className="aspect-video relative rounded-lg overflow-hidden bg-slate-100">
                                                <Image src={editingAsset.src} alt={editingAsset.title} fill className="object-cover" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-span-4 space-y-6">
                                        <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm overflow-visible p-5 flex flex-col h-full">
                                            <h3 className="text-sm font-bold text-slate-800 mb-4 pb-3 border-b border-slate-100 shrink-0">场景信息</h3>
                                            <div className="space-y-4 pr-1">
                                                <div className="flex items-center justify-between py-1">
                                                    <span className="text-[13px] text-slate-500">背景ID:</span>
                                                    <span className="text-[13px] text-slate-800 font-mono font-bold">{editingAsset.id}</span>
                                                </div>

                                                <div className="flex items-center justify-between group/field py-1 border-b border-slate-50">
                                                    <span className="text-[13px] text-slate-500">场景名称:</span>
                                                    <div className="flex items-center gap-2 max-w-[60%]">
                                                        <span className="text-[13px] text-slate-800 font-medium">{editingAsset.title || "-"}</span>
                                                        <button
                                                            onClick={() => setFieldEditor({ open: true, key: 'title', label: '场景名称', value: editingAsset.title || "", maxLength: 50 })}
                                                            className="text-slate-300 hover:text-primary transition-colors opacity-0 group-hover/field:opacity-100"
                                                        >
                                                            <Pencil className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Multi-select Dropdowns for Background Fields */}
                                                {[
                                                    { key: 'category', label: '场景分类', options: SCENE_CATEGORIES, open: sceneMenuOpen, setOpen: setSceneMenuOpen },
                                                    { key: 'lighting', label: '光影特点', options: LIGHTING_FEATURES, open: lightingMenuOpen, setOpen: setLightingMenuOpen },
                                                    { key: 'style', label: '场景元素', options: SCENE_ELEMENTS, open: elementMenuOpen, setOpen: setElementMenuOpen },
                                                ].map((field) => (
                                                    <div key={field.key} className="flex flex-col gap-1.5 py-1 border-b border-slate-50">
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-[13px] text-slate-500">{field.label}:</span>
                                                            <div className="relative">
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        field.setOpen(!field.open);
                                                                    }}
                                                                    className={cn(
                                                                        "flex items-center gap-1 px-2 py-1 rounded border text-[11px] transition-all",
                                                                        field.open ? "border-primary text-primary" : "border-slate-200 text-slate-600 hover:border-slate-300"
                                                                    )}
                                                                >
                                                                    <span>
                                                                        {Array.isArray(editingAsset[field.key])
                                                                            ? (editingAsset[field.key].length > 0 ? `已选 ${editingAsset[field.key].length}` : "未选择")
                                                                            : (editingAsset[field.key] ? "已设置" : "未选择")}
                                                                    </span>
                                                                    <ChevronDown className={cn("w-3 h-3 transition-transform", field.open && "rotate-180")} />
                                                                </button>

                                                                {field.open && (
                                                                    <div
                                                                        onClick={(e) => e.stopPropagation()}
                                                                        className="absolute top-full right-0 mt-1 w-40 bg-white border border-slate-200 rounded-lg shadow-xl z-[40] py-1 overflow-y-auto max-h-[200px] custom-scrollbar animate-in fade-in slide-in-from-top-1 duration-200"
                                                                    >
                                                                        {field.options.map((opt) => {
                                                                            const currentValues = Array.isArray(editingAsset[field.key])
                                                                                ? editingAsset[field.key]
                                                                                : (editingAsset[field.key] ? editingAsset[field.key].split(' / ') : []);
                                                                            const isSelected = currentValues.includes(opt);
                                                                            return (
                                                                                <button
                                                                                    key={opt}
                                                                                    onClick={() => {
                                                                                        const next = isSelected
                                                                                            ? currentValues.filter((v: string) => v !== opt)
                                                                                            : [...currentValues, opt];
                                                                                        setEditingAsset({ ...editingAsset, [field.key]: next });
                                                                                    }}
                                                                                    className={cn(
                                                                                        "w-full text-left px-3 py-2 text-[11px] flex items-center justify-between transition-colors",
                                                                                        isSelected ? "bg-primary/5 text-primary font-medium" : "text-slate-600 hover:bg-slate-50"
                                                                                    )}
                                                                                >
                                                                                    {opt}
                                                                                    {isSelected && <Check className="w-3 h-3" />}
                                                                                </button>
                                                                            );
                                                                        })}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-wrap gap-1">
                                                            {(Array.isArray(editingAsset[field.key]) ? editingAsset[field.key] : (editingAsset[field.key] ? editingAsset[field.key].split(' / ') : [])).length > 0 ? (
                                                                (Array.isArray(editingAsset[field.key]) ? editingAsset[field.key] : editingAsset[field.key].split(' / ')).map((val: string) => (
                                                                    <span key={val} className="px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px]">
                                                                        {val}
                                                                    </span>
                                                                ))
                                                            ) : (
                                                                <span className="text-[10px] text-slate-400 italic">尚未配置</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="mt-6 pt-6 border-t border-slate-100 flex-1 flex flex-col min-h-[120px]">
                                                <h4 className="text-[12px] font-bold text-primary uppercase tracking-wider mb-3 flex items-center justify-between">
                                                    Prompt 指示词
                                                    <button
                                                        onClick={() => setFieldEditor({ open: true, key: 'prompt', label: 'Prompt 指示词', value: editingAsset.prompt || "", maxLength: 1000 })}
                                                        className="text-slate-300 hover:text-primary transition-colors"
                                                    >
                                                        <Pencil className="w-3.5 h-3.5" />
                                                    </button>
                                                </h4>
                                                <p className="text-[13px] text-slate-600 italic leading-relaxed overflow-y-auto custom-scrollbar flex-1">
                                                    {editingAsset.prompt || "暂无指示词记录..."}
                                                </p>
                                            </div>

                                            <div className="bg-slate-50 rounded-xl p-4 mt-6">
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="flex flex-col gap-1">
                                                        <span className="text-[10px] text-slate-400">录入人:</span>
                                                        <span className="text-[11px] text-slate-600 font-medium">{editingAsset.creator || "LibAdmin"}</span>
                                                    </div>
                                                    <div className="flex flex-col gap-1">
                                                        <span className="text-[10px] text-slate-400">分辨率:</span>
                                                        <span className="text-[11px] text-slate-600 font-medium">4K High-Res</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer Action Bar */}
                        <div className="h-[72px] shrink-0 border-t flex items-center justify-center px-8 gap-4 bg-white">
                            <Button
                                className="w-[160px] h-10 bg-primary/10 hover:bg-primary/20 text-primary font-bold transition-colors border-none shadow-none"
                                onClick={handleSaveAsset}
                            >
                                保存修改
                            </Button>
                            <Button
                                variant="outline"
                                className="w-[120px] h-10 border-slate-200 text-slate-600 bg-slate-50 hover:bg-slate-100 transition-colors"
                                onClick={() => setEditingAsset(null)}
                            >
                                取消
                            </Button>
                            <Button
                                className="w-[160px] h-10 bg-[#fdf2d0] hover:bg-[#fae8b0] text-[#856404] font-medium transition-colors border-none shadow-none"
                                onClick={() => {/* Optional clear logic */ }}
                            >
                                清空详细信息
                            </Button>
                            <Button
                                className="w-[160px] h-10 bg-[#fde2e1] hover:bg-[#fbd3d1] text-[#721c24] font-medium transition-colors border-none shadow-none"
                                onClick={() => setShowDeleteConfirm(true)}
                            >
                                删除当前产品
                            </Button>
                        </div>
                    </div>

                    {/* Nested Delete Confirm Overlay */}
                    {showDeleteConfirm && (
                        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm">
                            <div className="bg-white rounded-xl p-8 max-w-sm w-full text-center shadow-2xl">
                                <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <X className="w-8 h-8" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-800 mb-2">确定要永久删除吗？</h3>
                                <p className="text-sm text-slate-500 mb-8">此操作不可撤销，该素材将从您的资料库中彻底移除。</p>
                                <div className="flex gap-3">
                                    <Button variant="outline" className="flex-1" onClick={() => setShowDeleteConfirm(false)}>取消</Button>
                                    <Button variant="destructive" className="flex-1 bg-red-500" onClick={() => {
                                        setAssets(prev => prev.filter(a => a.id !== editingAsset.id))
                                        setEditingAsset(null)
                                        setShowDeleteConfirm(false)
                                    }}>确认删除</Button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Hidden Input for Angle Images */}
            <input
                type="file"
                ref={angleFileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleAngleFileChange}
            />

            {/* Field Edit Modal (Figure 4) */}
            {fieldEditor.open && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-xl shadow-2xl w-[640px] max-w-[90vw] overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="h-14 flex items-center justify-between px-6 border-b">
                            <h2 className="text-lg font-bold text-slate-800">{fieldEditor.label}</h2>
                            <button onClick={() => setFieldEditor(prev => ({ ...prev, open: false }))} className="p-2 -mr-2 text-slate-400 hover:text-slate-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6">
                            <div className="relative">
                                <textarea
                                    className="w-full h-48 p-4 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 text-sm text-slate-700 resize-none custom-scrollbar"
                                    value={fieldEditor.value}
                                    onChange={(e) => setFieldEditor(prev => ({ ...prev, value: e.target.value }))}
                                    placeholder={`请输入${fieldEditor.label}...`}
                                    maxLength={fieldEditor.maxLength}
                                />
                                <div className="absolute bottom-3 right-4 text-xs text-slate-400">
                                    {fieldEditor.value.length}/{fieldEditor.maxLength}
                                </div>
                            </div>
                        </div>
                        <div className="h-[72px] border-t flex items-center justify-center px-6 gap-4">
                            <Button
                                variant="outline"
                                className="w-[120px] h-11 border-slate-200"
                                onClick={() => setFieldEditor(prev => ({ ...prev, open: false }))}
                            >
                                取消
                            </Button>
                            <Button
                                className="w-[180px] h-11 bg-primary hover:bg-primary/90 text-white font-bold transition-all"
                                onClick={() => {
                                    setEditingAsset({ ...editingAsset, [fieldEditor.key]: fieldEditor.value });
                                    setFieldEditor(prev => ({ ...prev, open: false }));
                                    // In a real app, you'd also save this to the assets array here or when clicking the master "保存"
                                    setAssets(prev => prev.map(a => a.id === editingAsset.id ? { ...editingAsset, [fieldEditor.key]: fieldEditor.value } : a))
                                }}
                            >
                                保存
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Lightbox Overlay */}
            {selectedImageIndex !== null && filteredAssets.length > 0 && (
                <ImageLightbox
                    images={filteredAssets}
                    initialIndex={selectedImageIndex}
                    onClose={() => setSelectedImageIndex(null)}
                />
            )}
        </div>
    )
}
