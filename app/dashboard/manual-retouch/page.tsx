"use client"

import { useState, useCallback, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import {
    Layers,
    Sparkles,
    Download,
    Loader2,
    Grid3X3,
    Smartphone,
    Save,
    ImagePlus,
    Wand2,
    History as HistoryIcon,
    FileImage,
    ImageIcon,
    Shirt,
    User,
    Accessibility,
    Monitor,
    ChevronRight,
    Info,
    RotateCcw
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
import { IMAGE_TOOL_MODE_PROMPTS, type ImageToolMode, MANUAL_MODES } from "@/lib/constants/image-tool-prompts"
import { mockDbAssets } from "@/lib/mock-data"

const spliceTemplates = [
    { id: "split-2", label: "左右对半", desc: "经典对比排版", slots: 2 },
    { id: "layout-3", label: "三图杂志风", desc: "主次分明构图", slots: 3 },
    { id: "grid-4", label: "时尚四宫格", desc: "全方位多角展示", slots: 4 },
    { id: "detail-6", label: "细节瀑布流", desc: "精锐细节捕捉", slots: 6 },
]

export default function ManualRetouchPage() {
    const router = useRouter()
    const [activeTab, setActiveTab] = useState<ImageToolMode>("swap_outfit")
    const [sourceFiles, setSourceFiles] = useState<File[]>([])
    const [referenceFiles, setReferenceFiles] = useState<File[]>([])
    const [selectedTemplate, setSelectedTemplate] = useState("grid-4")
    const [toolPrompt, setToolPrompt] = useState("")
    const [selectedResolution, setSelectedResolution] = useState("2k")
    const [processing, setProcessing] = useState(false)
    const [processed, setProcessed] = useState(false)
    const [isAssetPickerOpen, setIsAssetPickerOpen] = useState(false)
    const [pickingFor, setPickingFor] = useState<"source" | "reference">("source")

    const handleProcess = useCallback(() => {
        if (sourceFiles.length === 0) return
        if (activeTab !== "splice" && referenceFiles.length === 0) {
            toast.error("请提供参考依据图片");
            return;
        }
        setProcessing(true)
        setTimeout(() => {
            setProcessing(false)
            setProcessed(true)
            const messages = {
                splice: "多图拼接排版完成",
                swap_outfit: "模特服装已成功更换",
                swap_face: "模特面部已成功替换",
                change_pose: "模特交互姿态已成功重塑",
                expand: "", white_bg: "", flat3d: "", pattern: "", usp_display: "", usp_analysis: ""
            }
            toast.success(messages[activeTab] || "处理完成")
        }, 2800)
    }, [sourceFiles, referenceFiles, activeTab])

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

            if (pickingFor === "source") {
                setSourceFiles(prev => activeTab === "splice" ? [...prev, file] : [file]);
            } else {
                setReferenceFiles([file]);
            }

            setIsAssetPickerOpen(false);
            toast.success(`已添加素材: ${asset.title}`);
        } catch (err) {
            toast.error("素材加载失败");
        }
    };

    const openPicker = (target: "source" | "reference") => {
        setPickingFor(target);
        setIsAssetPickerOpen(true);
    };

    return (
        <div className="flex h-screen flex-col bg-slate-50 overflow-hidden">
            <header className="flex h-20 shrink-0 items-center justify-between border-b border-border pl-8 pr-[400px] bg-white z-20">
                <div className="flex flex-col">
                    <h1 className="font-display text-2xl font-bold text-foreground tracking-tight flex items-center gap-2">
                        手搓精修 <span className="text-primary/40 font-light">|</span> <span className="text-[13px] font-medium text-slate-400 mt-1 uppercase tracking-widest">Manual Retouch</span>
                    </h1>
                    <p className="text-[12px] text-muted-foreground mt-0.5">深度定制视觉重构，基于参考图与模板的精准操控</p>
                </div>
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-slate-400 hover:text-primary transition-all">
                        <HistoryIcon className="h-4 w-4" />
                    </Button>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                <aside className="w-[464px] shrink-0 border-r border-border bg-white p-6 overflow-y-auto custom-scrollbar flex flex-col gap-6 shadow-[x-4px_20px_rgba(0,0,0,0.02)] z-10">

                    {/* Section: Mode Selection */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-2 px-1">
                            <div className="h-4 w-4 rounded-sm bg-primary/10 flex items-center justify-center">
                                <Wand2 className="w-2.5 h-2.5 text-primary" />
                            </div>
                            <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.1em]">处理模式 (Mode)</h3>
                        </div>
                        <Select value={activeTab} onValueChange={(val: ImageToolMode) => { setActiveTab(val); setProcessed(false); }}>
                            <SelectTrigger className="w-full h-11 rounded-xl border-slate-100 bg-white shadow-sm hover:border-slate-200 transition-all text-slate-700 font-bold text-[13px]">
                                <SelectValue placeholder="选择手搓模式" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                                {MANUAL_MODES.map(mode => {
                                    const Labels = {
                                        splice: { icon: Layers, label: "杂志拼接 (Magazine Stitching)" },
                                        swap_outfit: { icon: Shirt, label: "模特换装 (Outfit Change)" },
                                        swap_face: { icon: User, label: "模特换脸 (Face Swap)" },
                                        change_pose: { icon: Accessibility, label: "换姿势 (Pose Change)" }
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

                    <div className="grid grid-cols-1 gap-6">
                        {/* Input 1: Source Image */}
                        <section className="space-y-3">
                            <div className="flex items-center justify-between px-1">
                                <div className="flex items-center gap-2">
                                    <div className="h-4 w-4 rounded-sm bg-primary/10 flex items-center justify-center">
                                        <FileImage className="w-2.5 h-2.5 text-primary" />
                                    </div>
                                    <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.1em]">原图上传 (Source)</h3>
                                </div>
                                <Button variant="ghost" size="sm" className="h-6 text-[10px] text-primary" onClick={() => openPicker("source")}>素材库</Button>
                            </div>
                            <UploadDropzone
                                onFileSelect={(selected) => {
                                    setSourceFiles(selected);
                                    setProcessed(false);
                                }}
                                currentFiles={sourceFiles}
                                onClear={() => { setSourceFiles([]); setProcessed(false); }}
                                label={activeTab === "splice" ? "上传多张素材图" : "上传作为底图的原片"}
                            />
                        </section>

                        {/* Input 2: Reference/Template */}
                        {activeTab === "splice" ? (
                            <section className="space-y-3">
                                <div className="flex items-center gap-2 px-1">
                                    <div className="h-4 w-4 rounded-sm bg-primary/10 flex items-center justify-center">
                                        <Grid3X3 className="w-2.5 h-2.5 text-primary" />
                                    </div>
                                    <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.1em]">排版模版 (Layout)</h3>
                                </div>
                                <div className="grid grid-cols-1 gap-2">
                                    {spliceTemplates.map(tpl => (
                                        <button
                                            key={tpl.id}
                                            onClick={() => setSelectedTemplate(tpl.id)}
                                            className={cn(
                                                "flex items-center h-12 px-3 rounded-xl border transition-all text-left",
                                                selectedTemplate === tpl.id ? "border-primary bg-primary/5 shadow-sm" : "border-slate-100 bg-white hover:border-slate-200"
                                            )}
                                        >
                                            <div className="flex-1 min-w-0 ml-1">
                                                <p className={cn("text-[12px] font-bold", selectedTemplate === tpl.id ? "text-primary" : "text-slate-700")}>{tpl.label}</p>
                                            </div>
                                            <span className="text-[10px] font-bold text-slate-300 mr-2">{tpl.slots} 插槽</span>
                                        </button>
                                    ))}
                                </div>
                            </section>
                        ) : (
                            <section className="space-y-3">
                                <div className="flex items-center justify-between px-1">
                                    <div className="flex items-center gap-2">
                                        <div className="h-4 w-4 rounded-sm bg-primary/10 flex items-center justify-center">
                                            <ImageIcon className="w-2.5 h-2.5 text-primary" />
                                        </div>
                                        <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.1em]">参考依据 (Reference)</h3>
                                    </div>
                                    <Button variant="ghost" size="sm" className="h-6 text-[10px] text-primary" onClick={() => openPicker("reference")}>素材库</Button>
                                </div>
                                <UploadDropzone
                                    onFileSelect={(selected) => {
                                        setReferenceFiles(selected.slice(0, 1));
                                        setProcessed(false);
                                    }}
                                    currentFiles={referenceFiles}
                                    onClear={() => { setReferenceFiles([]); setProcessed(false); }}
                                    label={`上传参考${activeTab === 'swap_outfit' ? '服装' : activeTab === 'swap_face' ? '面部' : '姿势'}`}
                                />
                            </section>
                        )}
                    </div>

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

                    <div className="mt-auto pt-4 border-t border-slate-50">
                        <Button
                            size="lg"
                            className="w-full bg-primary hover:bg-primary/90 text-white gap-3 h-13 rounded-2xl shadow-lg shadow-primary/20"
                            disabled={sourceFiles.length === 0 || processing}
                            onClick={handleProcess}
                        >
                            {processing ? <Loader2 className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5" />}
                            <span className="font-bold tracking-widest uppercase text-xs">
                                {processing ? "深度重构中..." : "开始手搓生成"}
                            </span>
                        </Button>
                    </div>
                </aside>

                <main className="flex-1 flex flex-col p-8 bg-slate-50/50 relative overflow-hidden">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <h2 className="text-sm font-bold text-slate-800">创作中心预览</h2>
                            <div className="px-2 py-0.5 bg-white border border-slate-100 rounded text-[9px] font-bold text-slate-400">Manual_Override_Active</div>
                        </div>
                        {processed && (
                            <div className="flex gap-3 animate-in fade-in slide-in-from-right-2">
                                <Button size="sm" className="h-9 px-6 rounded-xl text-xs font-bold gap-2 bg-slate-900 text-white shadow-xl">
                                    <Download className="h-3.5 w-3.5" /> 导出高清原片
                                </Button>
                            </div>
                        )}
                    </div>

                    <div className="flex-1 flex items-center justify-center relative bg-white/60 rounded-[48px] border border-white p-12">
                        {!sourceFiles.length ? (
                            <div className="text-center">
                                <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-slate-100">
                                    <ImageIcon className="w-8 h-8 text-slate-200" />
                                </div>
                                <h3 className="font-bold text-slate-400">选择素材开始重构</h3>
                            </div>
                        ) : processing ? (
                            <div className="flex flex-col items-center">
                                <div className="w-16 h-16 relative mb-4">
                                    <div className="absolute inset-0 border-4 border-primary/10 rounded-full" />
                                    <div className="absolute inset-0 border-4 border-transparent border-t-primary rounded-full animate-spin" />
                                </div>
                                <p className="font-bold text-primary animate-pulse">正在精细化像素对齐...</p>
                            </div>
                        ) : processed ? (
                            <div className="relative w-full h-full flex items-center justify-center">
                                <div className="relative h-full aspect-[3/4] shadow-2xl rounded-2xl overflow-hidden border-4 border-white">
                                    <Image src="/images/feature-studio.jpg" alt="Manual Processed Result" fill className="object-cover" />
                                    <div className="absolute bottom-6 right-6 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-xl border border-slate-100 shadow-xl">
                                        <p className="text-[10px] font-bold text-slate-800 uppercase tracking-widest">Precision_Refactor</p>
                                        <p className="text-[8px] text-slate-400 mt-0.5">Confidence: 99.2%</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-8 animate-in zoom-in-95 duration-500">
                                <div className="flex flex-col items-center gap-3">
                                    <div className="w-[200px] aspect-[3/4] bg-white rounded-2xl shadow-xl border border-slate-100 relative overflow-hidden">
                                        <Image src={URL.createObjectURL(sourceFiles[0])} alt="Source" fill className="object-cover" />
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase">Input: Source</span>
                                </div>

                                <div className="flex flex-col items-center">
                                    <ChevronRight className="w-8 h-8 text-slate-200 mb-4" />
                                    <Sparkles className="w-10 h-10 text-primary/20" />
                                </div>

                                <div className="flex flex-col items-center gap-3">
                                    {activeTab !== "splice" && referenceFiles.length > 0 ? (
                                        <div className="w-[200px] aspect-[3/4] bg-white rounded-2xl shadow-xl border border-slate-100 relative overflow-hidden">
                                            <Image src={URL.createObjectURL(referenceFiles[0])} alt="Ref" fill className="object-cover" />
                                        </div>
                                    ) : (
                                        <div className="w-[200px] aspect-[3/4] bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center">
                                            <p className="text-[10px] font-bold text-slate-300">等待参考数据</p>
                                        </div>
                                    )}
                                    <span className="text-[10px] font-bold text-slate-400 uppercase">Input: Reference</span>
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>

            <Dialog open={isAssetPickerOpen} onOpenChange={setIsAssetPickerOpen}>
                <DialogContent className="max-w-4xl max-h-[85vh] p-0 overflow-hidden bg-[#f8f9fa] border-none shadow-2xl">
                    <DialogHeader className="px-6 py-4 border-b bg-white">
                        <DialogTitle className="text-base font-bold text-slate-800">
                            从素材库选取 - {pickingFor === 'source' ? '原图' : '参考依据'}
                        </DialogTitle>
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
