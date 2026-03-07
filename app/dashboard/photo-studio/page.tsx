"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { ImageLightbox } from "@/components/ui/image-lightbox"
import {
    Shirt,
    Settings,
    Gem,
    Glasses,
    Watch,
    Briefcase,
    Crown,
    Star,
    Trash2,
    Download,
    RefreshCw,
    X,
    UserCircle,
    Link,
    Info,
    Image as ImageIcon,
    Wallpaper,
    Wand2,
    Loader2,
    Check,
    ChevronDown,
    ChevronRight,
    Sparkles,
    Zap
} from "lucide-react"

import { aiModelsConfig, siteConfig } from "@/config/site-content"

// Custom Pants Icon
const PantsIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
    >
        <path d="M5 3h14a1 1 0 0 1 1 1v4l-2 13h-4l-2-8-2 8H6L4 8V4a1 1 0 0 1 1-1Z" />
        <path d="M12 4v4" />
    </svg>
)

// Custom Innerwear Icon
const InnerwearIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
    >
        <path d="M7 3v5" />
        <path d="M17 3v5" />
        <path d="M5 12a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7Z" />
        <path d="M5 12c3 1.5 9 1.5 14 0" />
    </svg>
)

// Custom Suit Icon
const SuitIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
    >
        <path d="M4 2v18a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2" />
        <path d="M4 2 12 10 20 2" />
        <path d="M12 10v12" />
        <path d="M12 14h-4" />
        <path d="M12 18h-4" />
    </svg>
)

interface OutfitBlock {
    id: string;
    label: string;
    type: string;
    icon: any;
    isRequired?: boolean;
    isOptional?: boolean;
    hasAi?: boolean;
    hasDetails?: boolean;
}

interface OutfitCategory {
    title: string;
    icon: any;
    blocks: OutfitBlock[];
}

// Reorganized categories for better cognitive flow
const outfitCategories: OutfitCategory[] = [
    {
        title: "基础构架 (Core)",
        icon: Gem,
        blocks: [
            { id: "model", label: "选择模特", type: "model", isRequired: true, hasDetails: true, icon: UserCircle },
            { id: "scene", label: "场景背景", type: "background", isOptional: true, hasAi: true, icon: Wallpaper },
        ]
    },
    {
        title: "主体着装 (Apparel)",
        icon: Shirt,
        blocks: [
            { id: "top", label: "选择上装", type: "garment", isOptional: true, hasAi: true, icon: Shirt },
            { id: "inner", label: "选择内搭", type: "garment", isOptional: true, hasAi: true, icon: InnerwearIcon },
            { id: "bottom", label: "选择下装", type: "garment", isOptional: true, hasAi: true, icon: PantsIcon },
        ]
    },
    {
        title: "细节修饰 (Details)",
        icon: Sparkles,
        blocks: [
            { id: "acc1", label: "饰品 1", type: "accessory", isOptional: true, icon: Watch },
            { id: "acc2", label: "饰品 2", type: "accessory", isOptional: true, icon: Glasses },
            { id: "style", label: "海报样式", type: "style", isOptional: true, icon: ImageIcon },
            { id: "ref", label: "参考图", type: "background", isOptional: true, icon: Link },
        ]
    }
]

const promptTags = [
    { label: "伦勃朗光", value: "Rembrandt lighting" },
    { label: "电影质感", value: "cinematic look" },
    { label: "8K 超清", value: "8k ultra high resolution" },
    { label: "影棚写实", value: "studio photography style" },
    { label: "低俯仰角", value: "low angle shot" },
    { label: "极简背景", value: "minimalist background" },
    { label: "面料质感", value: "macro fabric texture" },
]

export default function PhotoStudioPage() {
    const router = useRouter()
    // Flat list of blocks for lookup
    const allBlocks: OutfitBlock[] = outfitCategories.flatMap(c => c.blocks)
    // Top-level selections state for left blocks
    const [selections, setSelections] = useState<Record<string, any>>({})

    // Toggles states
    const [aiToggles, setAiToggles] = useState<Record<string, boolean>>({})
    const [fastToggles, setFastToggles] = useState({
        necktie: false, sunglasses: false,
        cufflinks: false, watch: false,
        belt: false, pocketSquare: false,
        shoes: false, hat: false,
        bag: false, tieClip: false
    })

    // Ratio & Count
    const [ratio, setRatio] = useState("1:1")
    const [count, setCount] = useState(1)
    const [isRatioDropdownOpen, setIsRatioDropdownOpen] = useState(false)

    // Modal state for Asset Picker
    const [isAssetPickerOpen, setIsAssetPickerOpen] = useState(false)
    const [assetPickerTarget, setAssetPickerTarget] = useState<string | null>(null)
    const [assetPickerType, setAssetPickerType] = useState<string>("")

    // Prompt Generator States
    const [selectedPromptModel, setSelectedPromptModel] = useState(aiModelsConfig.defaultSelected || "mock")
    const [isLoadingPrompt, setIsLoadingPrompt] = useState(false)
    const [imagePrompt, setImagePrompt] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    // We will hardcode some sample assets to mirror our assets page without needing a global context in this step
    const mockDbAssets = [
        { id: "M001-GRM", type: "garment", src: "/images/assets/suit.png", title: "高定深灰男士西装", productCategory: ["西装/套装"], prompt: "High-end product photography of a men's Italian charcoal grey suit, wool texture, plaid pattern, professional studio lighting." },
        { id: "M002-GRM", type: "garment", src: "/images/assets/shirt.png", title: "雅致白衬衫", productCategory: ["上装", "内搭"], prompt: "Crisp white business shirt with a royal blue silk tie, isolated on white background, sharp focus." },
        { id: "GRM-003", type: "garment", src: "/images/assets/business/suit_navy_blue.png", title: "正装深蓝西装", productCategory: ["西装/套装"], prompt: "Navy blue executive suit, slim fit, 100% wool, front view on ghost mannequin." },
        { id: "GRM-004", type: "garment", src: "/images/assets/batch2/garments/shirt_white_main.png", title: "免烫极简白衬衫", productCategory: ["上装", "内搭"], prompt: "Ultra-clean white business shirt, wrinkle-free cotton, spread collar, minimalist design." },
        // Bottoms
        { id: "GRM-005", type: "garment", src: "/images/assets/pants.png", title: "商务黑色西裤", productCategory: ["下装"], prompt: "Tailored black dress pants for men, straight leg, luxury wool fabric, studio lighting." },
        { id: "GRM-006", type: "garment", src: "/images/assets/batch2/garments/pants_grey.png", title: "雅致灰西裤", productCategory: ["下装"], prompt: "Elegant charcoal grey wool trousers, slim fit, professional photography, neutral background." },
        // Accessories
        { id: "ACC-001", type: "garment", src: "/images/assets/watch.png", title: "高端商务腕表", productCategory: ["领带/配饰"], prompt: "Close-up of a luxury silver watch with black leather strap, sapphire glass, macro photography, soft lighting." },
        { id: "ACC-002", type: "garment", src: "/images/assets/glasses.png", title: "复古半框眼镜", productCategory: ["领带/配饰"], prompt: "Half-frame glasses with wood or horn material, vintage style, top-down product photography." },

        { id: "MDL-AMB-MAIN", type: "model", src: "/images/assets/business/model_brand_ambassador_primary.png", title: "品牌首席代言人-虚拟资产", prompt: "A high-end fashion photograph of a handsome and sophisticated Asian male model in his 30s, wearing a premium tailored navy blue business suit, standing in a luxury modern office with floor-to-ceiling windows showing a city skyline at sunset. Professional studio lighting, 8k resolution, cinematic atmosphere, representing a brand ambassador." },
        { id: "M003-MDL", type: "model", src: "/images/assets/model-asian.png", title: "成熟亚洲男性模特", prompt: "Professional portrait of a middle-aged Asian male model, confident expression, high-end fashion lighting." },
        { id: "M004-MDL", type: "model", src: "/images/assets/model-western.png", title: "欧美街拍男模特", prompt: "Street style portrait of a tall western male model, walking in urban city, natural sunlight." },
        { id: "MDL-DIGI-01", type: "model", src: "/images/assets/business/digital_ambassador_3view.png", title: "数字孪生代言人-三视图", prompt: "A high-fidelity 3D digital male brand ambassador for a menswear brand. The avatar looks like a sophisticated 30-year-old Asian man with a sharp jawline and professional grooming. He is shown from three angles (front, side, profile) in a minimalist grid layout. He is wearing a white business shirt. Futuristic digital texture, clean white background. 8k resolution." },
        { id: "M005-BGD", type: "background", src: "/images/assets/bg-office.png", title: "高层办公室背景", prompt: "Modern top-floor office interior with floor-to-ceiling windows, city skyline visible outside, blurred background." },
        { id: "M006-BGD", type: "background", src: "/images/assets/bg-studio.png", title: "极简高级纯色棚拍背景", prompt: "Minimalist photography studio background, neutral grey color, soft cyclorama wall." },
    ]

    // Modal state for "More Details" model adjustment
    const [isModelDetailsOpen, setIsModelDetailsOpen] = useState(false)
    const [modelDetailTab, setModelDetailTab] = useState<"action" | "framing" | "outfit">("action")

    // Lightbox State
    const [lightboxData, setLightboxData] = useState<{ itemIndex: number, imageIndex: number } | null>(null)

    interface HistoryItem {
        id: string | number;
        creator: string;
        date: string;
        ratio: string;
        mainImg: string;
        sources: string[];
        prompt: string;
        sceneId?: string;
        modelId?: string;
        topId?: string;
        innerId?: string;
        bottomId?: string;
        isArchived?: boolean;
    }

    // History items state
    const [historyItems, setHistoryItems] = useState<HistoryItem[]>([
        {
            id: 35794,
            creator: "uto (ID: 20127)",
            date: "2026-03-02 15:50:02",
            ratio: "1:1",
            mainImg: "/images/assets/model-asian.png",
            sources: ["/images/assets/suit.png", "/images/assets/shirt.png", selections.scene?.src || "/images/assets/bg-studio.png"],
            prompt: "A high-end cinematic fashion photograph of a handsome Asian male model wearing a luxury charcoal grey three-piece suit. He is sitting in a sophisticated modern library with warm ambient lighting. Professional 8k photography, shallow depth of field, sharp focus on fabric texture."
        },
        {
            id: 35790,
            creator: "uto (ID: 20127)",
            date: "2026-03-02 15:33:15",
            ratio: "4:3",
            mainImg: "/images/assets/model-asian.png",
            sources: ["/images/assets/shirt.png", "/images/assets/suit.png"],
            prompt: "Studio lighting, portrait of a professional businessman in a crisp white shirt and silk tie. Neutral gray background, high-end fashion catalog style, extremely detailed skin and fabric textures."
        },
        {
            id: 35788,
            creator: "uto (ID: 20127)",
            date: "2026-03-02 11:20:10",
            ratio: "3:4",
            mainImg: "/images/assets/model-western.png",
            sources: ["/images/assets/suit.png", "/images/assets/bg-office.png"],
            prompt: "Executive lifestyle photography, western male model walking in a luxury skyscraper office. Sunlight streaming through windows, blurred city skyline, navy blue pinstripe suit, realistic movement."
        },
    ])

    useEffect(() => {
        try {
            const stored = localStorage.getItem("archived_studio_images")
            if (stored) {
                const archives: any[] = JSON.parse(stored)
                const archiveIds = new Set(archives.map(a => a.id))
                setHistoryItems(prev => prev.map(hi => ({
                    ...hi,
                    isArchived: archiveIds.has(hi.id)
                })))
            }
        } catch (e) { }
    }, [])

    const toggleArchive = (item: HistoryItem) => {
        try {
            const stored = localStorage.getItem("archived_studio_images")
            let archives: any[] = stored ? JSON.parse(stored) : []

            const isAlreadyArchived = archives.some(a => a.id === item.id)
            if (isAlreadyArchived) {
                archives = archives.filter(a => a.id !== item.id)
                alert("已取消收藏并从归档移除")
            } else {
                archives.push({
                    ...item,
                    isArchived: true
                })
                alert("收藏成功！该图片已归档至对应素材关联库。")
            }
            localStorage.setItem("archived_studio_images", JSON.stringify(archives))

            setHistoryItems(prev => prev.map(hi => hi.id === item.id ? { ...hi, isArchived: !isAlreadyArchived } : hi))
        } catch (e) {
            console.error(e)
            alert("归档操作失败")
        }
    }

    // Methods
    const handleBlockClick = (blockId: string, blockType: string) => {
        setAssetPickerTarget(blockId)
        setAssetPickerType(blockType)
        setIsAssetPickerOpen(true)
    }

    const selectAssetAndClose = (asset: any) => {
        if (assetPickerTarget) {
            setSelections(prev => ({
                ...prev,
                [assetPickerTarget]: asset
            }))
        }
        setIsAssetPickerOpen(false)
        setAssetPickerTarget(null)
    }

    const handleGeneratePrompt = async () => {
        if (Object.keys(selections).length === 0) {
            alert("请先选择一些元素进行创作！")
            return
        }

        setIsLoadingPrompt(true)
        setImagePrompt("")

        try {
            // Extract selections
            const outfit = selections.top || selections.inner || selections.bottom;

            // Get garment URL from selections
            const garmentUrl = outfit?.src || "/images/sample-suit.jpg";
            const category = outfit?.title || "未指明品类的服装";
            const accessories = [selections.acc1?.title, selections.acc2?.title].filter(Boolean).join(", ");
            const style = selections.style?.title || selections.ref?.title || "商业影棚写实";

            // Reusing API or mock call
            const resp = await fetch('/api/generate-prompt', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    garmentUrl,
                    category,
                    model: selections.model?.title || "随机默认模特",
                    bg: selections.scene?.title || "极简纯色背景",
                    pose: "自然展现服装特性的站姿",
                    style,
                    accessories,
                    promptModel: selectedPromptModel,
                    ratio
                })
            })

            const data = await resp.json()
            if (!data.success) {
                throw new Error(data.error || "Failed to generate prompt")
            }

            const formatPrompt = (promptData: any) => {
                let dataObj = promptData
                if (typeof promptData === "string") {
                    try { dataObj = JSON.parse(promptData) } catch (e) { return promptData }
                }
                if (typeof dataObj !== "object" || dataObj === null) return String(dataObj)

                const keyMap: Record<string, string> = {
                    "scene": "场景", "sceneDescription": "场景描述",
                    "model": "模特", "modelFeatures": "模特特征",
                    "pose": "姿态", "garmentFeatures": "服装特征",
                    "fabricDetails": "面料细节", "edgesAndStitching": "边缘与缝线",
                    "lighting": "光影", "accessories": "配饰",
                    "camera": "拍摄技巧", "prompt": "整体描述",
                    "visualTexture": "画面质感", "depthOfField": "景深处理"
                }

                return Object.entries(dataObj).map(([key, value]) => {
                    const translatedKey = keyMap[key] || key
                    const cleanValue = typeof value === 'object' ? JSON.stringify(value) : String(value).trim()
                    return `${translatedKey}: ${cleanValue}`
                }).join("\n")
            }

            const chineseFormatted = formatPrompt(data.chinesePrompt)
            const englishFormatted = formatPrompt(data.englishPrompt)

            const selectionDetails = Object.values(selections).map((v: any) => v.title).join(", ") || "未选择实体资产";
            const specsStr = `画面比例: ${ratio}，生成数量: ${count} 张`;

            const generatedStr = `[生成设定]\n${selectionDetails}\n${specsStr}\n\n[展示用中文描述]\n${chineseFormatted}\n\n[底层图像生成指令 (English)]\n${englishFormatted}`

            setImagePrompt(generatedStr)
        } catch (err: any) {
            console.error(err)
            alert("生成 Prompt 失败: " + err.message)
        } finally {
            setIsLoadingPrompt(false)
        }
    }

    const handleSubmitCreation = async () => {
        if (!imagePrompt) {
            alert("请先生成或输入提示词！")
            return
        }

        setIsSubmitting(true)

        try {
            // Simulation of image generation
            await new Promise(resolve => setTimeout(resolve, 2000))

            const timestamp = new Date().toISOString().replace(/[^\d]/g, '').slice(0, 14)
            const newId = `IMG-${timestamp}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`
            const now = new Date().toISOString().split('T')[0] + ' ' + new Date().toTimeString().split(' ')[0]

            // Get sources from selections
            const sources = Object.values(selections).map((s: any) => s.src).filter(Boolean) as string[]

            const newItem: HistoryItem = {
                id: newId,
                creator: "uto (ID: 20127)",
                date: now,
                ratio: ratio,
                mainImg: (selections.model?.src || selections.top?.src || selections.inner?.src || "/images/assets/model-asian.png") as string,
                sources: sources.slice(0, 4),
                prompt: imagePrompt,
                sceneId: selections.scene?.id,
                modelId: selections.model?.id,
                topId: selections.top?.id,
                innerId: selections.inner?.id,
                bottomId: selections.bottom?.id,
            }

            setHistoryItems(prev => [newItem, ...prev])
            setImagePrompt("")
            // Optional: reset prompt after submission
            // setImagePrompt("")
            alert("创作提交成功！作品已加入历史记录。")
        } catch (err: any) {
            alert("提交失败: " + err.message)
        } finally {
            setIsSubmitting(false)
        }
    }
    return (
        <div className="flex flex-col h-full w-full overflow-hidden text-sm">
            {/* Header */}
            <div className="flex h-20 shrink-0 items-center justify-between border-b border-border pl-8 pr-[400px] bg-white z-20">
                <div>
                    <h1 className="font-display text-2xl font-bold text-foreground tracking-tight">摄影室</h1>
                    <p className="text-sm text-muted-foreground mt-1">专业AI摄影，自定义多属性资产进行精细化成片创作</p>
                </div>
            </div>

            <div className="flex flex-1 w-full bg-[#f8f9fa] overflow-hidden">

                {/* LEFT PANEL - Configuration */}
                <div className="w-[464px] flex-shrink-0 flex flex-col border-r shadow-sm bg-white h-full relative z-10 p-5 overflow-y-auto custom-scrollbar">

                    {/* Reorganized Sectional Blocks */}
                    <div className="space-y-8 mb-8">
                        {outfitCategories.map((cat, catIdx) => (
                            <div key={catIdx} className="space-y-4">
                                <div className="flex items-center gap-2 px-1">
                                    <div className="h-4 w-4 rounded-sm bg-primary/10 flex items-center justify-center">
                                        <cat.icon className="w-2.5 h-2.5 text-primary" />
                                    </div>
                                    <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.1em]">{cat.title}</h3>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    {cat.blocks.map(block => {
                                        const isSelected = !!selections[block.id]
                                        const IconCmp = block.icon
                                        return (
                                            <div key={block.id} className="relative group">
                                                <button
                                                    onClick={() => handleBlockClick(block.id, block.type)}
                                                    className={cn(
                                                        "w-full h-[88px] rounded-xl border flex items-center justify-start gap-3 transition-all px-3 relative",
                                                        isSelected ? "border-primary/50 bg-primary/5 shadow-sm" : "border-slate-200 bg-white hover:border-slate-300 shadow-[0_2px_8px_rgba(0,0,0,0.02)]"
                                                    )}
                                                >
                                                    {/* Icon / Image */}
                                                    <div className={cn("w-[52px] h-[52px] rounded-xl flex items-center justify-center shrink-0 relative", isSelected ? "bg-transparent overflow-hidden border border-slate-200" : "bg-[#f4f6f9] border border-dashed border-slate-300")}>
                                                        {isSelected ? (
                                                            <Image src={selections[block.id].src} alt="" fill className="object-cover" />
                                                        ) : (
                                                            <IconCmp className="w-6 h-6 text-[#788596]" strokeWidth={1.5} />
                                                        )}
                                                        {!isSelected && (
                                                            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#ff6baf] rounded-full flex items-center justify-center border-2 border-white text-white z-10">
                                                                <span className="text-[14px] font-bold leading-none mb-0.5">+</span>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Texts */}
                                                    <div className="flex flex-col items-center justify-center flex-1 overflow-hidden h-full pt-1 pr-4">
                                                        {isSelected ? (
                                                            <span className="text-[13px] text-slate-700 font-bold truncate w-full text-center leading-tight" title={selections[block.id].title}>
                                                                {selections[block.id].title}
                                                            </span>
                                                        ) : (
                                                            <>
                                                                <span className={cn("text-[13px] font-medium tracking-tight mb-1 whitespace-nowrap overflow-hidden text-ellipsis w-full text-center", block.isRequired ? "text-[#f04438]" : "text-slate-700")}>
                                                                    {block.isRequired && <span className="mr-0.5">*</span>} {block.label}
                                                                </span>
                                                                {block.isOptional && <span className="text-[12px] text-[#2c68ff] font-medium leading-none w-full text-center text-[10px] opacity-80">(可选)</span>}
                                                                {block.isRequired && <span className="text-[12px] text-[#f04438] font-medium leading-none w-full text-center text-[10px]">(必选)</span>}
                                                            </>
                                                        )}
                                                    </div>
                                                </button>

                                                {/* Top right AI switch for specific blocks */}
                                                {block.hasAi && (
                                                    <div className="absolute top-2 right-2 flex items-center justify-end z-10 pointer-events-none">
                                                        <span className="text-[10px] text-[#8e99a8] font-medium mt-0.5 translate-x-4 opacity-75">AI</span>
                                                        <Switch
                                                            checked={aiToggles[block.id] || false}
                                                            onCheckedChange={(c) => setAiToggles(p => ({ ...p, [block.id]: c }))}
                                                            className="scale-[0.5] origin-right pointer-events-auto data-[state=checked]:bg-primary"
                                                        />
                                                    </div>
                                                )}

                                                {/* Bottom right Details trigger for model */}
                                                {block.hasDetails && (
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); setIsModelDetailsOpen(true); }}
                                                        className="absolute bottom-2 right-4 flex items-center gap-1 text-[10px] text-slate-400 hover:text-primary z-10 transition-colors"
                                                    >
                                                        细节 <ChevronRight className="w-2.5 h-2.5" />
                                                    </button>
                                                )}
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Fast Toggles */}
                    <div className="grid grid-cols-2 gap-x-4 gap-y-3 mb-8">
                        {Object.entries({
                            necktie: "给模特配上一条领带", sunglasses: "给模特配上一副墨镜",
                            cufflinks: "给模特配上一对袖扣", watch: "给模特配上一块名表",
                            belt: "给模特配上一条皮带", pocketSquare: "给模特配上一块口袋巾",
                            shoes: "给模特配上一双成品鞋", hat: "给模特配上一顶绅士帽",
                            bag: "给模特配上一个公文包", tieClip: "给模特配上一个领带夹"
                        }).map(([key, label]) => (
                            <div key={key} className="flex items-center justify-between bg-slate-50 border border-slate-100 rounded-lg px-3 py-2.5 hover:border-slate-200 transition-colors">
                                <span className="text-[12px] text-slate-600 font-medium whitespace-nowrap overflow-hidden text-ellipsis mr-2">{label}</span>
                                <Switch
                                    checked={fastToggles[key as keyof typeof fastToggles]}
                                    onCheckedChange={(c) => setFastToggles(p => ({ ...p, [key]: c }))}
                                    className="scale-[0.65] shrink-0"
                                />
                            </div>
                        ))}
                    </div>
                    {/* Settings: Ratio and Count */}
                    <div className="flex items-center gap-3 mb-4">
                        <div className="relative">
                            <button
                                onClick={() => setIsRatioDropdownOpen(!isRatioDropdownOpen)}
                                className={cn(
                                    "h-11 px-3 min-w-[124px] flex items-center justify-between gap-3 text-[14px] font-medium border rounded-[10px] transition-colors shadow-sm",
                                    isRatioDropdownOpen ? "border-primary bg-white text-primary" : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                                )}
                            >
                                <div className="flex items-center gap-2">
                                    <div className="w-5 flex items-center justify-center shrink-0">
                                        <div className={cn("border-[1.5px] border-slate-300 rounded-[2px]", {
                                            "1:1": "w-[18px] h-[18px]",
                                            "2:3": "w-[12px] h-[18px]",
                                            "3:4": "w-[12px] h-[16px]",
                                            "4:3": "w-[16px] h-[12px]",
                                            "9:16": "w-[10px] h-[18px]",
                                            "16:9": "w-[18px] h-[10px]"
                                        }[ratio] || "w-[18px] h-[18px]")} />
                                    </div>
                                    <span className="text-[15px] font-normal leading-none pt-0.5">{ratio}</span>
                                </div>
                                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn("transition-transform shrink-0", isRatioDropdownOpen ? "rotate-180" : "")}>
                                    <path d="M5 6L0 0H10L5 6Z" fill="#64748B" />
                                </svg>
                            </button>

                            {isRatioDropdownOpen && (
                                <>
                                    <div className="fixed inset-0 z-40" onClick={() => setIsRatioDropdownOpen(false)} />
                                    <div className="absolute left-0 bottom-full mb-2 w-max min-w-[210px] bg-[#f8f9fa] border border-slate-200 shadow-[0_12px_32px_-12px_rgba(0,0,0,0.15)] rounded-xl z-50 overflow-hidden">
                                        <div className="flex flex-col p-1">
                                            {[
                                                { value: "1:1", label: "1:1正方形，头像", w: "w-[16px] h-[16px]" },
                                                { value: "2:3", label: "2:3社交媒体，自拍", w: "w-[12px] h-[18px]" },
                                                { value: "3:4", label: "3:4经典比例，拍照", w: "w-[12px] h-[16px]" },
                                                { value: "4:3", label: "4:3文章配图，插画", w: "w-[16px] h-[12px]" },
                                                { value: "9:16", label: "9:16手机壁纸，人像", w: "w-[10px] h-[18px]" },
                                                { value: "16:9", label: "16:9桌面壁纸，风景", w: "w-[18px] h-[10px]" },
                                            ].map(opt => (
                                                <button
                                                    key={opt.value}
                                                    onClick={() => { setRatio(opt.value); setIsRatioDropdownOpen(false); }}
                                                    className={cn(
                                                        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] transition-all",
                                                        ratio === opt.value ? "bg-white shadow-sm" : "hover:bg-[#f1f3f5]"
                                                    )}
                                                >
                                                    <div className={cn(
                                                        "w-[18px] h-[18px] rounded-[4px] flex items-center justify-center shrink-0 border transition-colors",
                                                        ratio === opt.value ? "bg-primary border-primary text-white" : "border-slate-300 bg-white"
                                                    )}>
                                                        {ratio === opt.value && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                                                    </div>
                                                    <div className="w-6 flex items-center justify-center shrink-0">
                                                        <div className={cn("border-[1.5px] rounded-[2px]", ratio === opt.value ? "border-slate-500" : "border-[#cbd5e1]", opt.w)} />
                                                    </div>
                                                    <span className={cn("font-medium", ratio === opt.value ? "text-slate-800" : "text-slate-600")}>{opt.label}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="flex items-center border border-slate-200 rounded-[10px] h-11 bg-white px-3 focus-within:border-primary transition-colors shadow-sm gap-2.5">
                            <span className="text-[14px] text-slate-600 font-normal leading-none pt-0.5">生成数量</span>

                            <div className="flex items-center bg-[#e8eefa] rounded-lg h-[32px] min-w-[42px] px-1 select-none">
                                <input type="number" readOnly value={count} onChange={(e) => setCount(Number(e.target.value))} className="w-full h-full text-center text-[16px] text-slate-800 font-normal leading-none bg-transparent outline-none pointer-events-none pt-0.5" />
                            </div>

                            <div className="flex flex-col h-[32px] w-[30px] gap-1 shrink-0">
                                <button onClick={() => setCount(c => Math.min(10, c + 1))} className="flex-1 flex items-center justify-center bg-slate-50 hover:bg-slate-100 rounded-[6px] text-primary transition-colors border border-slate-100">
                                    <svg width="8" height="5" viewBox="0 0 8 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M4 0L8 5H0L4 0Z" fill="currentColor" />
                                    </svg>
                                </button>
                                <button onClick={() => setCount(c => Math.max(1, c - 1))} className="flex-1 flex items-center justify-center bg-slate-50 hover:bg-slate-100 rounded-[6px] text-primary transition-colors border border-slate-100">
                                    <svg width="8" height="5" viewBox="0 0 8 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M4 5L0 0H8L4 5Z" fill="currentColor" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* AI Prompt Generator with Smart Tag Lab */}
                    <div className="flex flex-col gap-3 rounded-2xl border border-primary/20 bg-primary/5 p-5 mb-4 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <div className="h-4 w-4 rounded-full bg-primary flex items-center justify-center">
                                    <Zap className="w-2.5 h-2.5 text-white" />
                                </div>
                                <h4 className="text-[12px] font-bold text-primary tracking-wide">SMART PROMPT LAB</h4>
                            </div>
                            <div className="relative flex items-center w-[160px]">
                                <select
                                    value={selectedPromptModel}
                                    onChange={(e) => setSelectedPromptModel(e.target.value)}
                                    className="h-8 w-full rounded-lg border border-[#b2eaf0] bg-white pl-3 pr-8 text-[12px] text-slate-700 outline-none focus:ring-1 focus:ring-[#b2eaf0] cursor-pointer appearance-none transition-colors"
                                    disabled={isLoadingPrompt}
                                >
                                    {aiModelsConfig.options.map(option => (
                                        <option key={option.id} value={option.id}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-2.5 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                            </div>
                        </div>

                        {/* Tag Lab Area */}
                        <div className="flex flex-wrap gap-2 mb-2 p-3 bg-white/50 rounded-xl border border-primary/5">
                            {promptTags.map(tag => (
                                <button
                                    key={tag.value}
                                    onClick={() => setImagePrompt(prev => prev + (prev.length > 0 ? ", " : "") + tag.value)}
                                    className="px-2 py-1 rounded-md bg-white border border-slate-100 text-[10px] text-slate-500 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all shadow-sm"
                                >
                                    + {tag.label}
                                </button>
                            ))}
                        </div>

                        <textarea
                            className="w-full rounded-xl border border-primary/10 bg-white p-4 text-[13px] text-slate-700 min-h-[160px] focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none custom-scrollbar shadow-inner placeholder:text-slate-300"
                            value={imagePrompt}
                            onChange={(e) => setImagePrompt(e.target.value)}
                            placeholder="点击上方标签或生成预览按钮内容..."
                        />

                        <div className="flex justify-end">
                            <Button
                                size="sm"
                                variant="outline"
                                className="h-9 px-6 gap-2 rounded-xl border border-primary text-primary bg-white hover:bg-primary/5 transition-all shadow-sm"
                                onClick={handleGeneratePrompt}
                                disabled={isLoadingPrompt || Object.keys(selections).length === 0}
                            >
                                {isLoadingPrompt ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        <span className="text-[13px] font-bold">{siteConfig.generatingText}</span>
                                    </>
                                ) : (
                                    <>
                                        <Wand2 className="h-4 w-4" />
                                        <span className="text-[13px] font-bold">智能预览 Prompt</span>
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>

                    {/* Bottom Sticky Action Bar */}
                    <div className="mt-auto flex pt-5 border-t border-slate-100 bg-white sticky bottom-0 z-20">
                        <Button
                            className="w-full bg-primary hover:bg-primary/90 text-white shadow-md shadow-primary/20 text-[13px] font-bold h-10 tracking-widest transition-all hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
                            onClick={handleSubmitCreation}
                            disabled={isSubmitting || !imagePrompt}
                        >
                            {isSubmitting ? (
                                <>正在生成... <Loader2 className="w-4 h-4 ml-2 animate-spin" /></>
                            ) : (
                                <>提交创作 <Gem className="w-3.5 h-3.5 ml-1.5 fill-white/40" /> 10</>
                            )}
                        </Button>
                    </div>
                </div>

                {/* RIGHT PANEL - Dashboard & History */}
                <div className="flex-1 flex flex-col h-full overflow-hidden bg-white">
                    {/* Right Header Filters */}
                    <div className="h-12 border-b flex items-center px-6 gap-6 bg-white/50 z-10">
                        <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
                            <input type="checkbox" className="rounded-sm border-slate-300 text-primary focus:ring-primary w-3.5 h-3.5" />
                            仅收藏
                        </label>
                        <div className="flex items-center gap-2 text-xs text-slate-600">
                            类型:
                            <select className="bg-transparent font-medium text-slate-800 outline-none cursor-pointer">
                                <option>全部作品</option>
                            </select>
                        </div>
                    </div>

                    {/* History List */}
                    <div className="flex-1 overflow-y-auto p-8 custom-scrollbar relative">
                        <div className="max-w-4xl mx-auto flex flex-col gap-10">
                            {historyItems.map((item, idx) => (
                                <div key={idx} className="flex gap-6 border-b border-slate-100 pb-8 relative group">
                                    {/* Fixed Square Frame, Image aspect correctly letterboxed within */}
                                    <button
                                        onClick={() => setLightboxData({ itemIndex: idx, imageIndex: 0 })}
                                        className="w-[200px] h-[200px] shrink-0 bg-white rounded-2xl flex items-center justify-center p-2 border border-slate-200/60 shadow-sm relative group/img cursor-zoom-in hover:border-primary/50 transition-colors"
                                    >
                                        <div
                                            className={cn(
                                                "relative overflow-hidden rounded-xl bg-slate-100",
                                                item.ratio === '4:3' || item.ratio === '16:9' ? "w-full" : "h-full",
                                                item.ratio === '1:1' && "w-full h-full"
                                            )}
                                            style={{
                                                aspectRatio: item.ratio === '4:3' ? '4/3' :
                                                    item.ratio === '3:4' ? '3/4' :
                                                        item.ratio === '16:9' ? '16/9' :
                                                            item.ratio === '9:16' ? '9/16' :
                                                                '1/1'
                                            }}
                                        >
                                            <Image
                                                src={item.mainImg}
                                                alt="Result"
                                                fill
                                                className="object-fill"
                                            />
                                        </div>
                                    </button>

                                    {/* Info & Sources */}
                                    <div className="flex-1">
                                        <div className="flex items-center text-[11px] text-slate-400 mb-4 bg-slate-50 w-fit px-3 py-1.5 rounded-full border border-slate-100">
                                            任务ID <span className="text-primary bg-primary/10 px-1.5 py-0.5 rounded ml-1.5 mr-3 font-mono">{item.id}</span>
                                            <span className="border-r h-2.5 mr-3 border-slate-300"></span>
                                            创建人 <span className="text-primary bg-primary/10 px-1.5 py-0.5 rounded ml-1.5 mr-3">{item.creator}</span>
                                            <span className="border-r h-2.5 mr-3 border-slate-300"></span>
                                            {item.date}
                                        </div>

                                        <div className="flex items-end gap-2 mb-6">
                                            {item.sources.map((src, i) => (
                                                <button
                                                    key={i}
                                                    onClick={() => setLightboxData({ itemIndex: idx, imageIndex: i + 1 })}
                                                    className="w-12 h-16 rounded overflow-hidden relative border border-slate-200 shadow-sm bg-slate-50 cursor-zoom-in hover:border-primary/50 transition-colors"
                                                >
                                                    <Image src={src} alt="Source" fill className="object-cover" />
                                                </button>
                                            ))}
                                        </div>

                                        <div className="mb-6">
                                            <h4 className="text-[10px] font-bold text-primary uppercase tracking-wider mb-2 flex items-center gap-1.5 px-0.5">
                                                <div className="w-1 h-1 bg-primary rounded-full" /> Prompt 指示词
                                            </h4>
                                            <div className="bg-slate-50/50 rounded-xl p-3 border border-slate-100 group-hover:border-primary/20 transition-all duration-300">
                                                <p className="text-[12px] text-slate-600 italic leading-relaxed line-clamp-2 group-hover:line-clamp-none">
                                                    {item.prompt}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Button variant="outline" size="sm" className="h-8 text-[11px] font-medium text-slate-600 border-slate-200">
                                                <RefreshCw className="w-3 h-3 mr-1.5" /> 重新生成
                                            </Button>
                                            <Button variant="outline" size="sm" className="h-8 text-[11px] font-medium text-slate-600 border-slate-200">
                                                多人物融合
                                            </Button>

                                            <div className="flex items-center gap-1.5 ml-2">
                                                <button className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50"><Download className="w-3.5 h-3.5" /></button>
                                                <button
                                                    className={cn("w-8 h-8 flex items-center justify-center rounded border transition-colors", item.isArchived ? "bg-yellow-50 border-yellow-200 text-yellow-500" : "border-slate-200 text-slate-400 hover:text-yellow-500 hover:bg-slate-50")}
                                                    onClick={() => toggleArchive(item)}
                                                >
                                                    <Star className={cn("w-3.5 h-3.5", item.isArchived && "fill-yellow-500")} />
                                                </button>
                                                <button className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 text-slate-400 hover:text-red-500 hover:bg-slate-50"><Trash2 className="w-3.5 h-3.5" /></button>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            ))}

                            <div className="text-center text-xs text-slate-400 py-10">没有更多数据了</div>
                        </div>
                    </div>
                </div>

                {/* Asset Picker Modal */}
                <Dialog open={isAssetPickerOpen} onOpenChange={setIsAssetPickerOpen}>
                    <DialogContent className="max-w-4xl max-h-[85vh] p-0 flex flex-col overflow-hidden bg-[#f8f9fa] border-none shadow-2xl">
                        <DialogHeader className="px-6 py-4 border-b bg-white">
                            <DialogTitle className="text-base font-bold text-slate-800">
                                从素材库选择 - {allBlocks.find(b => b.id === assetPickerTarget)?.label.replace('* ', '')}
                            </DialogTitle>
                        </DialogHeader>

                        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-4 gap-4">
                            {mockDbAssets
                                .filter(a => {
                                    // Base type filtering
                                    if (assetPickerType !== '' && assetPickerType !== 'text' && a.type !== assetPickerType) return false;

                                    // Product Category filtering for Garments
                                    if (a.type === 'garment' && assetPickerTarget) {
                                        const targetToCategory: Record<string, string[]> = {
                                            'top': ['上装', '西装/套装', '户外装备'],
                                            'bottom': ['下装'],
                                            'inner': ['内搭'],
                                            'acc1': ['领带/配饰'],
                                            'acc2': ['领带/配饰']
                                        };
                                        const requiredCategories = targetToCategory[assetPickerTarget];
                                        if (requiredCategories) {
                                            return (a as any).productCategory?.some((cat: string) => requiredCategories.includes(cat));
                                        }
                                    }
                                    return true;
                                })
                                .map((asset) => (
                                    <div
                                        key={asset.id}
                                        onClick={() => selectAssetAndClose(asset)}
                                        className="group relative aspect-[3/4] rounded-xl overflow-hidden cursor-pointer border-2 border-transparent hover:border-primary shadow-sm"
                                    >
                                        <Image src={asset.src} alt={asset.title} fill className="object-cover" />
                                        <div className="absolute inset-x-0 bottom-0 bg-black/60 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <p className="text-white text-[10px] truncate font-medium">{asset.title}</p>
                                        </div>
                                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <Button size="sm" className="bg-primary hover:bg-primary text-white pointer-events-none scale-90">选用</Button>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Model Details Super-Modal */}
                <Dialog open={isModelDetailsOpen} onOpenChange={setIsModelDetailsOpen}>
                    <DialogContent className="max-w-3xl h-[600px] p-0 flex flex-col gap-0 border-none shadow-2xl bg-white rounded-xl overflow-hidden">
                        <div className="h-[60px] flex items-center justify-between px-6 border-b shrink-0">
                            <span className="font-bold text-base text-slate-800">模特细节</span>
                            <button onClick={() => setIsModelDetailsOpen(false)} className="text-slate-400 hover:text-slate-700">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="flex h-[40px] px-8 bg-white border-b shrink-0 pt-3">
                            {[{ id: 'action', label: '动作要求' }, { id: 'framing', label: '模特景别' }, { id: 'outfit', label: '着装要求' }].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setModelDetailTab(tab.id as any)}
                                    className={cn(
                                        "flex-1 text-sm font-medium transition-colors border-b-2 pb-2",
                                        modelDetailTab === tab.id ? "text-primary border-primary" : "text-slate-500 hover:text-slate-800 border-transparent"
                                    )}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Silhoette background overlay */}
                        <div className="flex-1 overflow-y-auto p-8 relative bg-[#fafafc]">
                            <div className="absolute top-0 left-8 opacity-5 pointer-events-none w-[200px] h-[500px]">
                                <Image src="/images/assets/model-asian.png" alt="" fill className="object-contain object-left-top" />
                            </div>

                            {modelDetailTab === 'action' && (
                                <div className="space-y-6 relative z-10 w-1/3">
                                    {["单手叉腰", "单手插兜", "45度侧身", "走路姿态", "单手抓外套门襟", "双手叉腰"].map((item, idx) => (
                                        <label key={idx} className="flex items-center gap-3 cursor-pointer group">
                                            <div className="w-5 h-5 rounded-full border-2 border-slate-300 group-hover:border-primary flex items-center justify-center">
                                                {idx === 0 && <div className="w-3 h-3 rounded-full bg-primary" />}
                                            </div>
                                            <span className="text-[13px] text-slate-700 font-medium">{item}</span>
                                        </label>
                                    ))}
                                </div>
                            )}

                            {modelDetailTab === 'framing' && (
                                <div className="space-y-6 relative z-10 w-4/5 pt-4">
                                    {[
                                        { t: "头顶到脚底构图，全身取景" },
                                        { t: "头顶到胸部构图，上半身取景，画面截止到胸部，胸部以下不显示" },
                                        { t: "头顶到胯部构图，上半身取景，画面截止到胯部，胯部以下不显示" },
                                        { t: "下巴到脚底构图，下半身取景，画面截止到下巴，下巴以上不显示" },
                                        { t: "下巴到胯部构图，下半身取景，画面截止到下巴以下胯部以上，胯部以下和下巴以上都不显示" },
                                    ].map((item, idx) => (
                                        <label key={idx} className="flex items-center gap-3 cursor-pointer group">
                                            <div className="w-5 h-5 rounded-full border-2 border-slate-300 group-hover:border-primary flex items-center justify-center shrink-0">
                                                {idx === 0 && <div className="w-3 h-3 rounded-full bg-primary" />}
                                            </div>
                                            <span className="text-[13px] text-slate-700 font-medium leading-relaxed">{item.t}</span>
                                        </label>
                                    ))}
                                </div>
                            )}

                            {modelDetailTab === 'outfit' && (
                                <div className="space-y-6 relative z-10 w-1/3">
                                    {["撸起衣袖", "卷起裤子", "不扣钮扣", "把衣摆塞进裤子"].map((item, idx) => (
                                        <label key={idx} className="flex items-center gap-3 cursor-pointer group">
                                            <div className="w-5 h-5 rounded-full border-2 border-slate-300 group-hover:border-primary flex items-center justify-center"></div>
                                            <span className="text-[13px] text-slate-700 font-medium">{item}</span>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="h-[72px] shrink-0 border-t flex items-center justify-end px-6 gap-3 bg-white">
                            <Button variant="outline" className="w-[120px] font-medium border-slate-200" onClick={() => setIsModelDetailsOpen(false)}>取消</Button>
                            <Button className="w-[120px] font-medium bg-primary hover:bg-primary/90" onClick={() => setIsModelDetailsOpen(false)}>确定</Button>
                        </div>
                    </DialogContent>
                </Dialog>

            </div>

            {/* Global Lightbox for History Images Group */}
            {lightboxData !== null && historyItems[lightboxData.itemIndex] && (
                <ImageLightbox
                    images={[
                        { id: 'main', src: historyItems[lightboxData.itemIndex].mainImg, title: `任务ID: ${historyItems[lightboxData.itemIndex].id} - 创作结果` },
                        ...historyItems[lightboxData.itemIndex].sources.map((src, i) => ({ id: `src-${i}`, src, title: `使用素材 ${i + 1}` }))
                    ]}
                    initialIndex={lightboxData.imageIndex}
                    onClose={() => setLightboxData(null)}
                />
            )}
        </div>
    )
}
