"use client"

import { useState, useCallback, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import {
    Expand,
    Sparkles,
    Download,
    Loader2,
    Grid3X3,
    RectangleHorizontal,
    Square,
    RectangleVertical,
    Smartphone,
    Save,
    ImagePlus,
    Wand2,
    History as HistoryIcon,
    FileImage,
    ImageIcon,
    Box,
    Scissors,
    Eraser,
    Tag,
    Search,
    Monitor,
    ChevronRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { UploadDropzone } from "@/components/dashboard/upload-dropzone"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { IMAGE_TOOL_MODE_PROMPTS, type ImageToolMode, ONE_CLICK_MODES } from "@/lib/constants/image-tool-prompts"

const expandRatios = [
    { id: "1:1", label: "1:1", desc: "正方形 (Instagram/主图)", icon: Square },
    { id: "4:3", label: "4:3", desc: "标准横版 (电商详情)", icon: RectangleHorizontal },
    { id: "3:4", label: "3:4", desc: "经典竖版 (小红书/时尚刊)", icon: RectangleVertical },
    { id: "16:9", label: "16:9", desc: "高清宽屏 (Banner/封面)", icon: RectangleHorizontal },
    { id: "9:16", label: "9:16", desc: "沉浸手机屏 (抖音/竖屏广告)", icon: Smartphone },
]

const mockDbAssets = [
    { id: "M001", type: "garment", src: "/images/assets/suit.png", title: "意式西装" },
    { id: "M002", type: "garment", src: "/images/assets/shirt.png", title: "雅致白衬衫" },
    { id: "M003", type: "garment", src: "/images/assets/business/suit_navy_blue.png", title: "深蓝西装" },
    { id: "M004", type: "model", src: "/images/assets/model-asian.png", title: "亚洲男模" },
    { id: "M005", type: "model", src: "/images/assets/model-western.png", title: "欧美男模" },
    { id: "M006", type: "background", src: "/images/assets/bg-office.png", title: "行政办公室" },
    { id: "M007", type: "background", src: "/images/assets/bg-studio.png", title: "极简影棚" },
    { id: "M008", type: "garment", src: "/images/assets/pants.png", title: "商务西裤" },
]

export default function OneClickRetouchPage() {
    const router = useRouter()
    const [activeTab, setActiveTab] = useState<ImageToolMode>("white_bg")
    const [files, setFiles] = useState<File[]>([])
    const [toolPrompt, setToolPrompt] = useState("")
    const [selectedRatio, setSelectedRatio] = useState("1:1")
    const [selectedResolution, setSelectedResolution] = useState("2k")
    const [processing, setProcessing] = useState(false)
    const [processed, setProcessed] = useState(false)
    const [isAssetPickerOpen, setIsAssetPickerOpen] = useState(false)

    const handleProcess = useCallback(() => {
        if (files.length === 0) return
        setProcessing(true)
        setTimeout(() => {
            setProcessing(false)
            setProcessed(true)
            const messages = {
                expand: "图片智能扩充完成",
                flat3d: "平铺图已成功转换为3D立体图",
                pattern: "面料图案已成功提取",
                white_bg: "已成功一键去背并转为纯白底",
                usp_display: "产品卖点视觉化排版已完成",
                usp_analysis: "产品深度卖点分析报告已生成",
                splice: "", swap_outfit: "", swap_face: "", change_pose: ""
            }
            toast.success(messages[activeTab] || "处理完成")
        }, 2800)
    }, [files, activeTab])

    useEffect(() => {
        if (IMAGE_TOOL_MODE_PROMPTS[activeTab]) {
            setToolPrompt(IMAGE_TOOL_MODE_PROMPTS[activeTab])
        }
    }, [activeTab])

    const selectAssetAndAdd = async (asset: any) => {
        try {
            const response = await fetch(asset.src);
            const blob = await response.blob();
            const file = new File([blob], asset.title || "asset.png", { type: blob.type });
            setFiles([file]);
            setIsAssetPickerOpen(false);
            toast.success(`已添加素材: ${asset.title}`);
        } catch (err) {
            toast.error("素材加载失败");
        }
    };

    return (
        <div className="flex h-screen flex-col bg-slate-50 overflow-hidden">
            <header className="flex h-20 shrink-0 items-center justify-between border-b border-border pl-8 pr-[400px] bg-white z-20">
                <div className="flex flex-col">
                    <h1 className="font-display text-2xl font-bold text-foreground tracking-tight flex items-center gap-2">
                        一键精修 <span className="text-primary/40 font-light">|</span> <span className="text-[13px] font-medium text-slate-400 mt-1 uppercase tracking-widest">One-Click Retouch</span>
                    </h1>
                    <p className="text-[12px] text-muted-foreground mt-0.5">极速智能图像处理，一键生成标准化电商资产</p>
                </div>
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-slate-400 hover:text-primary transition-all">
                        <HistoryIcon className="h-4 w-4" />
                    </Button>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                <aside className="w-[464px] shrink-0 border-r border-border bg-white p-6 overflow-y-auto custom-scrollbar flex flex-col gap-8 shadow-[x-4px_20px_rgba(0,0,0,0.02)] z-10">
                    <section className="space-y-4">
                        <div className="flex items-center justify-between px-1">
                            <div className="flex items-center gap-2">
                                <div className="h-4 w-4 rounded-sm bg-primary/10 flex items-center justify-center">
                                    <FileImage className="w-2.5 h-2.5 text-primary" />
                                </div>
                                <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.1em]">素材来源 (Source)</h3>
                            </div>
                            <Button variant="outline" size="sm" className="h-7 text-[11px] font-bold border-primary/20 text-primary bg-primary/5 hover:bg-primary/10 px-3 rounded-lg" onClick={() => setIsAssetPickerOpen(true)}>
                                <ImagePlus className="w-3 h-3 mr-1.5" /> 素材库
                            </Button>
                        </div>
                        <UploadDropzone
                            onFileSelect={(selected) => {
                                setFiles(selected.slice(0, 1));
                                setProcessed(false);
                            }}
                            currentFiles={files}
                            onClear={() => {
                                setFiles([]);
                                setProcessed(false);
                            }}
                            label="选择或拖入需要处理的原图"
                        />
                    </section>

                    <section className="space-y-4">
                        <div className="flex items-center gap-2 px-1">
                            <div className="h-4 w-4 rounded-sm bg-primary/10 flex items-center justify-center">
                                <Wand2 className="w-2.5 h-2.5 text-primary" />
                            </div>
                            <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.1em]">处理模式 (Mode)</h3>
                        </div>
                        <Select value={activeTab} onValueChange={(val: ImageToolMode) => { setActiveTab(val); setProcessed(false); }}>
                            <SelectTrigger className="w-full h-11 rounded-xl border-slate-100 bg-white shadow-sm hover:border-slate-200 transition-all text-slate-700 font-bold text-[13px]">
                                <SelectValue placeholder="选择处理模式" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                                {ONE_CLICK_MODES.map(mode => {
                                    const Labels = {
                                        expand: { icon: Expand, label: "智能扩页 (Smart Expansion)" },
                                        white_bg: { icon: Eraser, label: "一键白底 (White Background)" },
                                        flat3d: { icon: Box, label: "平铺转3D (3D Flat-lay)" },
                                        pattern: { icon: Scissors, label: "图案提取 (Pattern Extraction)" },
                                        usp_display: { icon: Tag, label: "卖点展示 (USP Display)" },
                                        usp_analysis: { icon: Search, label: "卖点分析 (USP Analysis)" }
                                    };
                                    const config = Labels[mode as keyof typeof Labels];
                                    return config ? (
                                        <SelectItem key={mode} value={mode} className="py-2.5 px-3 rounded-lg focus:bg-primary/5 focus:text-primary transition-colors cursor-pointer">
                                            <div className="flex items-center gap-3">
                                                <config.icon className="w-4 h-4 text-primary" />
                                                <span className="font-bold">{config.label}</span>
                                            </div>
                                        </SelectItem>
                                    ) : null;
                                })}
                            </SelectContent>
                        </Select>
                    </section>

                    <section className="space-y-4">
                        <div className="flex items-center gap-2 px-1">
                            <div className="h-4 w-4 rounded-sm bg-primary/10 flex items-center justify-center">
                                <Sparkles className="w-2.5 h-2.5 text-primary" />
                            </div>
                            <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.1em]">生成建议 (Prompt)</h3>
                        </div>
                        <textarea
                            className="w-full h-24 bg-slate-50 rounded-xl border border-slate-100 p-3 text-[12px] text-slate-600 focus:outline-none focus:ring-1 focus:ring-primary/20 resize-none leading-relaxed"
                            placeholder="在此微调生成指令..."
                            value={toolPrompt}
                            onChange={(e) => setToolPrompt(e.target.value)}
                        />
                    </section>

                    <section className="space-y-4">
                        <div className="flex items-center gap-2 px-1">
                            <div className="h-4 w-4 rounded-sm bg-primary/10 flex items-center justify-center">
                                <Monitor className="w-2.5 h-2.5 text-primary" />
                            </div>
                            <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.1em]">输出分辨率 (Resolution)</h3>
                        </div>
                        <div className="flex p-1 bg-slate-50 rounded-xl border border-slate-100">
                            {["1k", "2k", "4k"].map((res) => (
                                <button
                                    key={res}
                                    onClick={() => setSelectedResolution(res)}
                                    className={cn(
                                        "flex-1 py-2 rounded-lg text-[12px] font-bold transition-all",
                                        selectedResolution === res ? "bg-white text-primary shadow-sm" : "text-slate-400"
                                    )}
                                >
                                    {res.toUpperCase()}
                                </button>
                            ))}
                        </div>
                    </section>

                    {activeTab === "expand" && (
                        <section className="space-y-4">
                            <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.1em] px-1">图片比例</h3>
                            <Select value={selectedRatio} onValueChange={setSelectedRatio}>
                                <SelectTrigger className="w-full h-11 rounded-xl border-slate-100 bg-white shadow-sm text-slate-700 font-bold text-[13px]">
                                    <SelectValue placeholder="选择比例" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                                    {expandRatios.map(ratio => (
                                        <SelectItem key={ratio.id} value={ratio.id} className="py-2.5">
                                            <div className="flex items-center gap-3">
                                                <ratio.icon className="w-4 h-4 text-slate-400" />
                                                <span className="font-bold">{ratio.label}</span>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </section>
                    )}

                    <div className="mt-auto pt-4 border-t border-slate-50">
                        <Button
                            size="lg"
                            className="w-full bg-primary hover:bg-primary/90 text-white gap-3 h-13 rounded-2xl shadow-lg shadow-primary/20"
                            disabled={files.length === 0 || processing}
                            onClick={handleProcess}
                        >
                            {processing ? <Loader2 className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5" />}
                            <span className="font-bold tracking-widest uppercase text-xs">
                                {processing ? "处理中..." : "立即一键生成"}
                            </span>
                        </Button>
                    </div>
                </aside>

                <main className="flex-1 flex flex-col p-8 bg-slate-50/50 relative overflow-hidden">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-sm font-bold text-slate-800">实时重构预览</h2>
                        {processed && (
                            <div className="flex gap-3 animate-in fade-in slide-in-from-right-2">
                                <Button variant="outline" size="sm" className="h-9 px-4 rounded-xl text-xs font-bold gap-2 text-slate-600 border-slate-200 bg-white" onClick={() => toast.success("已存入素材库")}>
                                    <Save className="h-3.5 w-3.5" /> 存档
                                </Button>
                                <Button size="sm" className="h-9 px-6 rounded-xl text-xs font-bold gap-2 bg-slate-900 text-white shadow-xl">
                                    <Download className="h-3.5 w-3.5" /> 导出结果
                                </Button>
                            </div>
                        )}
                    </div>

                    <div className="flex-1 flex items-center justify-center relative bg-white/40 rounded-[40px] border border-white/60">
                        {!files.length ? (
                            <div className="flex flex-col items-center opacity-40">
                                <ImageIcon className="w-16 h-16 text-slate-300 mb-4" />
                                <p className="text-sm font-medium text-slate-400">选择原图开始处理</p>
                            </div>
                        ) : processing ? (
                            <div className="flex flex-col items-center">
                                <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                                <p className="text-sm font-bold text-slate-600">正在应用 AI 重构...</p>
                            </div>
                        ) : processed ? (
                            <div className="w-full h-full p-4 relative flex items-center justify-center">
                                <div className="relative h-[85%] aspect-square shadow-2xl rounded-lg overflow-hidden border border-slate-100">
                                    <Image src="/images/feature-retouch.jpg" alt="Result" fill className="object-contain" />
                                    <div className="absolute inset-0 border-2 border-dashed border-primary/20 m-4 flex items-center justify-center">
                                        <span className="px-3 py-1 bg-primary text-white text-[9px] font-bold tracking-widest rounded shadow-lg uppercase">AI Generated</span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center animate-in zoom-in-95 duration-300">
                                <div className="w-[300px] aspect-square bg-white rounded-3xl shadow-xl border border-slate-100 relative overflow-hidden">
                                    <Image src={URL.createObjectURL(files[0])} alt="Preview" fill className="object-cover" />
                                </div>
                                <div className="mt-6 px-4 py-2 bg-slate-900 text-white rounded-full text-[10px] font-bold shadow-lg flex items-center gap-2">
                                    <Sparkles className="w-3 h-3" /> 点击右侧按钮开始处理
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>

            <Dialog open={isAssetPickerOpen} onOpenChange={setIsAssetPickerOpen}>
                <DialogContent className="max-w-4xl max-h-[85vh] p-0 overflow-hidden bg-[#f8f9fa] border-none shadow-2xl">
                    <DialogHeader className="px-6 py-4 border-b bg-white">
                        <DialogTitle className="text-base font-bold text-slate-800">从素材库选取</DialogTitle>
                    </DialogHeader>
                    <div className="flex-1 overflow-y-auto p-6 grid grid-cols-4 gap-4">
                        {mockDbAssets.map((asset) => (
                            <div key={asset.id} onClick={() => selectAssetAndAdd(asset)} className="group relative aspect-[3/4] rounded-xl overflow-hidden cursor-pointer border-2 border-transparent hover:border-primary shadow-sm bg-white">
                                <Image src={asset.src} alt={asset.title} fill className="object-cover" />
                                <div className="absolute inset-x-0 bottom-0 bg-black/60 p-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-between">
                                    <p className="text-white text-[10px] truncate font-medium flex-1 mr-2">{asset.title}</p>
                                    <Button size="sm" className="h-6 py-0 px-2 bg-primary hover:bg-primary text-[9px] scale-90">选用</Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
