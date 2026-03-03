"use client"

import { useState } from "react"
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
    CopyPlus,
    Link,
    Info,
    Image as ImageIcon
} from "lucide-react"

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

// Custom Dress Icon
const DressIcon = (props: React.SVGProps<SVGSVGElement>) => (
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
        <path d="M9 3h6" />
        <path d="M9 3v4" />
        <path d="M15 3v4" />
        <path d="M7 7l-2 5h14l-2-5" />
        <path d="M6 12l-2 9h16l-2-9" />
        <path d="M6 12c3 1.5 9 1.5 12 0" />
    </svg>
)

// Layout definition for left sidebar modular blocks
const outfitBlocks = [
    { id: "top", label: "选择上装", type: "garment", isOptional: true, hasAi: true, icon: Shirt },
    { id: "bottom", label: "选择下装", type: "garment", isOptional: true, hasAi: true, icon: PantsIcon },
    { id: "fullbody", label: "选择连衣裙/裤", type: "garment", isOptional: true, hasAi: true, icon: DressIcon },
    { id: "model", label: "选择模特", type: "model", isRequired: true, hasDetails: true, icon: UserCircle },
    { id: "inner", label: "选择内搭服", type: "garment", isOptional: true, hasAi: true, icon: InnerwearIcon },
    { id: "ref", label: "选择参考图", type: "background", isOptional: true, icon: Link },
    { id: "prompt", label: "提示词", type: "text", isOptional: true, icon: Info },
    { id: "style", label: "选择海报样式", type: "style", isOptional: true, icon: ImageIcon },
    { id: "acc1", label: "选择饰品1", type: "accessory", isOptional: true, icon: Watch },
    { id: "acc2", label: "选择饰品2", type: "accessory", isOptional: true, icon: Glasses },
]

export default function PhotoStudioPage() {
    // Top-level selections state for left blocks
    const [selections, setSelections] = useState<Record<string, any>>({})

    // Toggles states
    const [aiToggles, setAiToggles] = useState<Record<string, boolean>>({})
    const [fastToggles, setFastToggles] = useState({
        necktie: false, sunglasses: false,
        earrings: false, bracelet: false,
        belt: false, watch: false,
        shoes: false, hat: false,
        bag: false, scarf: false
    })

    // Ratio & Count
    const [ratio, setRatio] = useState("1:1")
    const [count, setCount] = useState(1)

    // Modal state for Asset Picker
    const [isAssetPickerOpen, setIsAssetPickerOpen] = useState(false)
    const [assetPickerTarget, setAssetPickerTarget] = useState<string | null>(null)
    const [assetPickerType, setAssetPickerType] = useState<string>("")

    // We will hardcode some sample assets to mirror our assets page without needing a global context in this step
    const mockDbAssets = [
        { id: "M001-GRM", type: "garment", src: "/images/assets/suit.png", title: "高定深灰男士西装" },
        { id: "M002-GRM", type: "garment", src: "/images/assets/shirt.png", title: "雅致白衬衫" },
        { id: "M003-MDL", type: "model", src: "/images/assets/model-asian.png", title: "成熟亚洲男性模特" },
        { id: "M004-MDL", type: "model", src: "/images/assets/model-western.png", title: "欧美街拍男模特" },
        { id: "M005-BGD", type: "background", src: "/images/assets/bg-office.png", title: "高层办公室背景" },
    ]

    // Modal state for "More Details" model adjustment
    const [isModelDetailsOpen, setIsModelDetailsOpen] = useState(false)
    const [modelDetailTab, setModelDetailTab] = useState<"action" | "framing" | "outfit">("action")

    // Mock history items
    const mockHistory = [
        { id: 35794, creator: "uto (ID: 20127)", date: "2026-03-02 15:50:02", mainImg: "/images/assets/model-asian.png", sources: ["/images/assets/suit.png", "/images/assets/shirt.png", "/images/assets/bg-studio.png"] },
        { id: 35790, creator: "uto (ID: 20127)", date: "2026-03-02 15:33:15", mainImg: "/images/assets/model-asian.png", sources: ["/images/assets/shirt.png", "/images/assets/suit.png"] },
    ]

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
    }

    return (
        <div className="flex flex-col h-full w-full overflow-hidden text-sm">
            {/* Header */}
            <div className="flex h-20 shrink-0 items-center justify-between border-b border-border px-8 bg-white z-20">
                <div>
                    <h1 className="font-display text-2xl font-bold text-foreground tracking-tight">摄影室</h1>
                    <p className="text-sm text-muted-foreground mt-1">专业AI摄影，自定义多属性资产进行精细化成片创作</p>
                </div>
            </div>

            <div className="flex flex-1 w-full bg-[#f8f9fa] overflow-hidden">

                {/* LEFT PANEL - Configuration */}
                <div className="w-[464px] flex-shrink-0 flex flex-col border-r shadow-sm bg-white h-full relative z-10 p-5 overflow-y-auto custom-scrollbar">

                    {/* 10 Block Grid */}
                    <div className="grid grid-cols-2 gap-x-4 gap-y-4 mb-8">
                        {outfitBlocks.map(block => {
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
                                                    {block.isOptional && <span className="text-[12px] text-[#2c68ff] font-medium leading-none w-full text-center">(非必选)</span>}
                                                    {block.isRequired && <span className="text-[12px] text-[#f04438] font-medium leading-none w-full text-center">(必选项)</span>}
                                                </>
                                            )}
                                        </div>
                                    </button>

                                    {/* Top right AI switch for specific blocks */}
                                    {block.hasAi && (
                                        <div className="absolute top-2 right-2 flex items-center justify-end gap-1 z-10 pointer-events-none">
                                            <span className="text-[11px] text-[#8e99a8] font-medium mt-0.5">AI配</span>
                                            <Switch
                                                checked={aiToggles[block.id] || false}
                                                onCheckedChange={(c) => setAiToggles(p => ({ ...p, [block.id]: c }))}
                                                className="scale-[0.55] origin-right pointer-events-auto data-[state=checked]:bg-primary"
                                            />
                                        </div>
                                    )}

                                    {/* Bottom right Details trigger for model */}
                                    {block.hasDetails && (
                                        <button
                                            onClick={(e) => { e.stopPropagation(); setIsModelDetailsOpen(true); }}
                                            className="absolute bottom-2 right-4 flex items-center gap-1 text-[11px] text-slate-500 hover:text-primary z-10 transition-colors"
                                        >
                                            更多细节 <span className="text-[10px] leading-none mb-0.5">→</span>
                                        </button>
                                    )}
                                </div>
                            )
                        })}
                    </div>

                    {/* Fast Toggles */}
                    <div className="grid grid-cols-2 gap-x-4 gap-y-3 mb-8">
                        {Object.entries({
                            necktie: "给模特配上一条领带", sunglasses: "给模特配上一副墨镜",
                            earrings: "给模特配上一对耳环", bracelet: "给模特配上一条手链",
                            belt: "给模特配上一条腰带", watch: "给模特配上一副眼镜",
                            shoes: "给模特配上一双鞋", hat: "给模特配上一顶帽子",
                            bag: "给模特配上一个包", scarf: "给模特配上一条围巾"
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

                    {/* Bottom Sticky Action Bar */}
                    <div className="mt-auto flex items-center gap-3 pt-5 border-t border-slate-100 bg-white sticky bottom-0 z-20">
                        <select
                            value={ratio}
                            onChange={(e) => setRatio(e.target.value)}
                            className="h-10 px-3 text-[13px] font-medium border border-slate-200 rounded-lg bg-[#f8f9fa] text-slate-700 outline-none focus:border-primary focus:bg-white transition-colors cursor-pointer"
                        >
                            <option value="1:1">1:1</option>
                            <option value="3:4">3:4</option>
                            <option value="9:16">9:16</option>
                        </select>

                        <div className="flex items-center border border-slate-200 rounded-lg h-10 bg-[#f8f9fa] overflow-hidden focus-within:border-primary focus-within:bg-white transition-colors">
                            <span className="px-3 text-[13px] font-medium text-slate-500 border-r border-slate-200">生成数量</span>
                            <input type="number" value={count} onChange={(e) => setCount(Number(e.target.value))} className="w-12 h-full text-center text-[13px] text-primary font-bold bg-transparent outline-none" />
                            <div className="flex flex-col border-l border-slate-200 h-full w-5 cursor-pointer">
                                <button onClick={() => setCount(c => c + 1)} className="flex-1 flex items-center justify-center bg-transparent hover:bg-slate-200 border-b border-slate-200 border-b-[0.5px] text-slate-500 transition-colors">▴</button>
                                <button onClick={() => setCount(c => Math.max(1, c - 1))} className="flex-1 flex items-center justify-center bg-transparent hover:bg-slate-200 text-slate-500 transition-colors">▾</button>
                            </div>
                        </div>

                        <Button className="flex-1 bg-[#6c5dd3] hover:bg-[#5a4cb5] text-white shadow-md shadow-[#6c5dd3]/20 text-[13px] font-bold h-10 tracking-widest transition-all hover:scale-[1.02]">
                            提交创作 <Gem className="w-3.5 h-3.5 ml-1.5 fill-white/40" /> 10
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
                    <div className="flex-1 overflow-y-auto px-6 py-6 pb-20 custom-scrollbar">
                        <div className="max-w-4xl mx-auto space-y-8">
                            {mockHistory.map((item, idx) => (
                                <div key={idx} className="flex gap-6 border-b border-slate-100 pb-8 relative group">
                                    {/* Result Large Image */}
                                    <div className="w-[180px] h-[240px] shrink-0 bg-slate-100 rounded-lg overflow-hidden relative shadow-sm border border-slate-200/60">
                                        <Image src={item.mainImg} alt="Result" fill className="object-cover" />
                                    </div>

                                    {/* Info & Sources */}
                                    <div className="flex-1">
                                        <div className="flex items-center text-[11px] text-slate-400 mb-4 bg-slate-50 w-fit px-3 py-1.5 rounded-full border border-slate-100">
                                            任务ID <span className="text-[#6c5dd3] bg-[#6c5dd3]/10 px-1.5 py-0.5 rounded ml-1.5 mr-3 font-mono">{item.id}</span>
                                            <span className="border-r h-2.5 mr-3 border-slate-300"></span>
                                            创建人 <span className="text-[#6c5dd3] bg-[#6c5dd3]/10 px-1.5 py-0.5 rounded ml-1.5 mr-3">{item.creator}</span>
                                            <span className="border-r h-2.5 mr-3 border-slate-300"></span>
                                            {item.date}
                                        </div>

                                        <div className="flex items-end gap-2 mb-6">
                                            {item.sources.map((src, i) => (
                                                <div key={i} className="w-12 h-16 rounded overflow-hidden relative border border-slate-200 shadow-sm bg-slate-50">
                                                    <Image src={src} alt="Source" fill className="object-cover" />
                                                </div>
                                            ))}
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center gap-2">
                                            <Button variant="outline" size="sm" className="h-8 text-[11px] font-medium text-slate-600 border-slate-200">
                                                <RefreshCw className="w-3 h-3 mr-1.5" /> 重新生成
                                            </Button>
                                            <Button variant="outline" size="sm" className="h-8 text-[11px] font-medium text-slate-600 border-slate-200">
                                                多人物融合
                                            </Button>
                                            <Button variant="outline" size="sm" className="h-8 text-[11px] font-medium text-slate-600 border-slate-200">
                                                二次创作
                                            </Button>

                                            <div className="flex items-center gap-1.5 ml-2">
                                                <button className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50"><Download className="w-3.5 h-3.5" /></button>
                                                <button className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 text-slate-400 hover:text-yellow-500 hover:bg-slate-50"><Star className="w-3.5 h-3.5" /></button>
                                                <button className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 text-slate-400 hover:text-red-500 hover:bg-slate-50"><Trash2 className="w-3.5 h-3.5" /></button>
                                            </div>
                                        </div>
                                    </div>

                                    <button className="absolute top-0 right-0 text-slate-300 hover:text-primary p-2">
                                        <CopyPlus className="w-4 h-4" />
                                    </button>
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
                                从素材库选择 - {outfitBlocks.find(b => b.id === assetPickerTarget)?.label.replace('* ', '')}
                            </DialogTitle>
                        </DialogHeader>

                        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-4 gap-4">
                            {mockDbAssets
                                .filter(a => assetPickerType === '' || assetPickerType === 'text' || a.type === assetPickerType || (assetPickerType === 'garment' && a.type === 'garment'))
                                .map((asset) => (
                                    <div
                                        key={asset.id}
                                        onClick={() => selectAssetAndClose(asset)}
                                        className="group relative aspect-[3/4] rounded-xl overflow-hidden cursor-pointer border-2 border-transparent hover:border-primary shadow-sm"
                                    >
                                        <Image src={asset.src} alt={asset.title} fill className="object-cover" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <Button size="sm" className="bg-primary hover:bg-primary text-white pointer-events-none">选用此项</Button>
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
                                        modelDetailTab === tab.id ? "text-[#5a4cb5] border-[#5a4cb5]" : "text-slate-500 hover:text-slate-800 border-transparent"
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
                            <Button className="w-[120px] font-medium bg-[#5a4cb5] hover:bg-[#4a3ea3]" onClick={() => setIsModelDetailsOpen(false)}>确定</Button>
                        </div>
                    </DialogContent>
                </Dialog>

            </div>
        </div>
    )
}
