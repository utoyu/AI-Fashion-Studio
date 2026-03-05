"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import {
  Expand,
  Layers,
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
  Zap,
  Wand2,
  ChevronRight,
  RotateCcw,
  History as HistoryIcon,
  Info,
  FileImage,
  ImageIcon
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { UploadDropzone } from "@/components/dashboard/upload-dropzone"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

type ActiveTab = "expand" | "splice"

const expandRatios = [
  { id: "1:1", label: "1:1", desc: "正方形 (Instagram/主图)", icon: Square },
  { id: "4:3", label: "4:3", desc: "标准横版 (电商详情)", icon: RectangleHorizontal },
  { id: "3:4", label: "3:4", desc: "经典竖版 (小红书/时尚刊)", icon: RectangleVertical },
  { id: "16:9", label: "16:9", desc: "高清宽屏 (Banner/封面)", icon: RectangleHorizontal },
  { id: "9:16", label: "9:16", desc: "沉浸手机屏 (抖音/竖屏广告)", icon: Smartphone },
]

const expandTags = [
  { label: "延伸背景", value: "extended background" },
  { label: "无缝融合", value: "seamless blending" },
  { label: "摄影棚光效", value: "studio lighting" },
  { label: "极简空间", value: "minimalist room" },
  { label: "自然溢出", value: "natural surroundings" },
  { label: "高清补全", value: "high fidelity detail" },
]

const spliceTemplates = [
  { id: "split-2", label: "左右对半", desc: "经典对比排版", slots: 2 },
  { id: "layout-3", label: "三图杂志风", desc: "主次分明构图", slots: 3 },
  { id: "grid-4", label: "时尚四宫格", desc: "全方位多角展示", slots: 4 },
  { id: "detail-6", label: "细节瀑布流", desc: "精锐细节捕捉", slots: 6 },
]

const platformSizes = [
  { id: "taobao", label: "淘宝 Tmall", size: "800 x 800 px" },
  { id: "xhs", label: "小红书 XHS", size: "1080 x 1440 px" },
  { id: "dy", label: "抖音/TikTok", size: "1080 x 1920 px" },
  { id: "pdd", label: "拼多多", size: "750 x 750 px" },
  { id: "manual", label: "手动定义", size: "Custom Ratio" },
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

export default function ImageToolsPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<ActiveTab>("expand")
  const [files, setFiles] = useState<File[]>([])
  const [expandPrompt, setExpandPrompt] = useState("")
  const [selectedRatio, setSelectedRatio] = useState("1:1")
  const [selectedTemplate, setSelectedTemplate] = useState("grid-4")
  const [selectedPlatform, setSelectedPlatform] = useState("taobao")
  const [processing, setProcessing] = useState(false)
  const [processed, setProcessed] = useState(false)
  const [expandAiEnabled, setExpandAiEnabled] = useState(true)
  const [isAssetPickerOpen, setIsAssetPickerOpen] = useState(false)

  const handleProcess = useCallback(() => {
    if (files.length === 0) return
    setProcessing(true)
    setTimeout(() => {
      setProcessing(false)
      setProcessed(true)
      toast.success(activeTab === "expand" ? "图片智能扩充完成" : "多图拼接排版完成")
    }, 2800)
  }, [files, activeTab])

  const selectAssetAndAdd = async (asset: any) => {
    try {
      const response = await fetch(asset.src);
      const blob = await response.blob();
      const file = new File([blob], asset.title || "asset.png", { type: blob.type });

      if (activeTab === "expand") {
        setFiles([file]);
      } else {
        setFiles(prev => [...prev, file]);
      }
      setIsAssetPickerOpen(false);
      toast.success(`已添加素材: ${asset.title}`);
    } catch (err) {
      toast.error("素材加载失败");
    }
  };

  const handleSelectFromAssets = useCallback(() => {
    setIsAssetPickerOpen(true);
  }, [])

  return (
    <div className="flex h-screen flex-col bg-slate-50 overflow-hidden">
      {/* HEADER: Standard 20px centered content height */}
      <header className="flex h-20 shrink-0 items-center justify-between border-b border-border px-8 bg-white z-20">
        <div className="flex flex-col">
          <h1 className="font-display text-2xl font-bold text-foreground tracking-tight flex items-center gap-2">
            图片中心 <span className="text-primary/40 font-light">|</span> <span className="text-[13px] font-medium text-slate-400 mt-1 uppercase tracking-widest">Image Lab</span>
          </h1>
          <p className="text-[12px] text-muted-foreground mt-0.5">跨平台视觉适配与智能构图排版工作站</p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-slate-400 hover:text-primary transition-all">
            <HistoryIcon className="h-4 w-4" />
          </Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* LEFT SIDEBAR: Standard 464px configuration panel */}
        <aside className="w-[464px] shrink-0 border-r border-border bg-white p-6 overflow-y-auto custom-scrollbar flex flex-col gap-8 shadow-[x-4px_20px_rgba(0,0,0,0.02)] z-10">

          {/* Section: Upload & Source */}
          <section className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded-sm bg-primary/10 flex items-center justify-center">
                  <FileImage className="w-2.5 h-2.5 text-primary" />
                </div>
                <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.1em]">素材来源 (Source)</h3>
              </div>
              <Button variant="outline" size="sm" className="h-7 text-[11px] font-bold border-primary/20 text-primary bg-primary/5 hover:bg-primary/10 px-3 rounded-lg" onClick={handleSelectFromAssets}>
                <ImagePlus className="w-3 h-3 mr-1.5" /> 素材库
              </Button>
            </div>
            <div className="group transition-all duration-300">
              <UploadDropzone
                onFileSelect={(selected) => {
                  if (activeTab === "expand") {
                    // If we already had a file and the new list is larger, prioritize the most recently added one
                    if (selected.length > files.length && files.length > 0) {
                      setFiles([selected[selected.length - 1]]);
                    } else {
                      setFiles(selected.slice(0, 1));
                    }
                  } else {
                    setFiles(selected);
                  }
                  setProcessed(false);
                }}
                currentFiles={files}
                onClear={(idx) => {
                  if (typeof idx === 'number') setFiles(p => p.filter((_, i) => i !== idx));
                  else setFiles([]);
                  setProcessed(false);
                }}
                label={activeTab === "expand" ? "选择或拖入扩充原图" : "选择多张图片进行拼接"}
              />
            </div>
          </section>

          {activeTab === "expand" ? (
            <>
              {/* Section: Ratios */}
              <section className="space-y-4">
                <div className="flex items-center gap-2 px-1">
                  <div className="h-4 w-4 rounded-sm bg-primary/10 flex items-center justify-center">
                    <Grid3X3 className="w-2.5 h-2.5 text-primary" />
                  </div>
                  <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.1em]">目标比例 (Dimension)</h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {expandRatios.map(ratio => (
                    <button
                      key={ratio.id}
                      onClick={() => setSelectedRatio(ratio.id)}
                      className={cn(
                        "flex items-center h-[72px] px-4 rounded-xl border transition-all text-left relative overflow-hidden group",
                        selectedRatio === ratio.id ? "border-primary bg-primary/5 shadow-sm" : "border-slate-100 bg-white hover:border-slate-200"
                      )}
                    >
                      <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center mr-3 transition-colors", selectedRatio === ratio.id ? "bg-primary text-white" : "bg-slate-50 text-slate-400")}>
                        <ratio.icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={cn("text-[12px] font-bold", selectedRatio === ratio.id ? "text-primary" : "text-slate-700")}>{ratio.label}</p>
                        <p className="text-[10px] text-slate-400 truncate">{ratio.desc.split(' (')[0]}</p>
                      </div>
                      {selectedRatio === ratio.id && <div className="absolute right-0 top-0 bottom-0 w-1 bg-primary" />}
                    </button>
                  ))}
                </div>
              </section>

              {/* Section: Platforms */}
              <section className="space-y-4">
                <div className="flex items-center gap-2 px-1">
                  <div className="h-4 w-4 rounded-sm bg-primary/10 flex items-center justify-center">
                    <Smartphone className="w-2.5 h-2.5 text-primary" />
                  </div>
                  <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.1em]">平台规范 (Platform)</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {platformSizes.map(p => (
                    <button
                      key={p.id}
                      onClick={() => setSelectedPlatform(p.id)}
                      className={cn(
                        "px-3 py-2 rounded-lg border text-[11px] font-bold transition-all",
                        selectedPlatform === p.id ? "bg-primary text-white border-primary shadow-sm" : "bg-white text-slate-500 border-slate-100 hover:border-slate-200"
                      )}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </section>

              {/* Section: Generative Lab */}
              <section className="space-y-4">
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded-sm bg-primary/10 flex items-center justify-center">
                      <Zap className="w-2.5 h-2.5 text-primary" />
                    </div>
                    <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.1em]">补全实验室 (Lab)</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-400 font-bold">AI填充</span>
                    <Switch checked={expandAiEnabled} onCheckedChange={setExpandAiEnabled} className="scale-75" />
                  </div>
                </div>
                <div className="p-4 rounded-2xl border border-primary/10 bg-primary/[0.02] space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {expandTags.map(tag => (
                      <button
                        key={tag.value}
                        onClick={() => setExpandPrompt(p => p + (p ? ", " : "") + tag.value)}
                        className="px-2 py-1 rounded bg-white border border-slate-100 text-[10px] text-slate-500 hover:border-primary hover:text-primary transition-all shadow-sm"
                      >
                        + {tag.label}
                      </button>
                    ))}
                  </div>
                  <textarea
                    className="w-full h-24 bg-white/80 rounded-xl border border-primary/5 p-3 text-[12px] text-slate-600 focus:outline-none focus:ring-1 focus:ring-primary/20 resize-none custom-scrollbar"
                    placeholder="描述扩充区域的环境，如：延伸的白色大理石地面..."
                    value={expandPrompt}
                    onChange={(e) => setExpandPrompt(e.target.value)}
                  />
                </div>
              </section>
            </>
          ) : (
            <>
              {/* Splicing Templates */}
              <section className="space-y-4">
                <div className="flex items-center gap-2 px-1">
                  <div className="h-4 w-4 rounded-sm bg-primary/10 flex items-center justify-center">
                    <ImageIcon className="w-2.5 h-2.5 text-primary" />
                  </div>
                  <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.1em]">排版布局 (Templates)</h3>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  {spliceTemplates.map(tpl => (
                    <button
                      key={tpl.id}
                      onClick={() => setSelectedTemplate(tpl.id)}
                      className={cn(
                        "flex items-center h-16 px-4 rounded-xl border transition-all text-left relative group",
                        selectedTemplate === tpl.id ? "border-primary bg-primary/5" : "border-slate-100 bg-white hover:border-slate-200"
                      )}
                    >
                      <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center mr-3", selectedTemplate === tpl.id ? "bg-primary text-white" : "bg-slate-50 text-slate-400")}>
                        <Grid3X3 className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={cn("text-[13px] font-bold", selectedTemplate === tpl.id ? "text-primary" : "text-slate-700")}>{tpl.label}</p>
                        <p className="text-[10px] text-slate-400">{tpl.desc}</p>
                      </div>
                      <div className="flex items-center gap-1.5 ml-4">
                        <span className="text-[12px] font-bold text-slate-300">Slots: {tpl.slots}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                      </div>
                    </button>
                  ))}
                </div>
              </section>

              {/* Composition Hint */}
              <section className="p-4 rounded-2xl bg-amber-50/50 border border-amber-100">
                <div className="flex gap-3">
                  <span className="shrink-0 mt-0.5"><Info className="w-4 h-4 text-amber-500" /></span>
                  <div>
                    <p className="text-[11px] font-bold text-amber-900">排版助手建议</p>
                    <p className="text-[10px] text-amber-800/70 mt-1 leading-relaxed">当前选用的排版建议同时上传包括主图、细节图及模特局部图，AI将自动均衡构图中心。</p>
                  </div>
                </div>
              </section>
            </>
          )}

          {/* Persistent Action Bar in Sidebar */}
          <div className="mt-4 pt-4 border-t border-slate-50">
            <Button
              size="lg"
              className="w-full bg-[#5a4cb5] hover:bg-[#4a3ea3] text-white gap-3 h-13 rounded-2xl shadow-lg shadow-[#5a4cb5]/20"
              disabled={files.length === 0 || processing}
              onClick={handleProcess}
            >
              {processing ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span className="font-bold tracking-widest uppercase text-xs">Processing Neurons...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5" />
                  <span className="font-bold tracking-widest uppercase text-xs">
                    {activeTab === "expand" ? "执行智能扩页" : "开始杂志排版"}
                  </span>
                </>
              )}
            </Button>
          </div>
        </aside>

        {/* MAIN WORKSPACE: Adaptive immersive canvas */}
        <main className="flex-1 flex flex-col p-8 bg-[#f8f9fb] relative overflow-hidden">

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <h2 className="text-sm font-bold text-slate-800">创作中心预览</h2>
                <div className="h-4 w-px bg-slate-200" />
                <div className="flex items-center gap-2 px-2 py-1 bg-white rounded-md border border-slate-100 text-[10px] font-bold text-slate-400">
                  <Smartphone className="w-3 h-3" /> {selectedPlatform === 'taobao' ? '淘宝规格 800x800' : '适配显示'}
                </div>
              </div>

              {/* Moved Tab Switcher: Now at the top of the Results Area */}
              <div className="flex bg-slate-100/80 backdrop-blur-sm rounded-lg p-0.5 border border-slate-200 shadow-inner ml-2">
                {[
                  { id: "expand" as const, label: "智能扩页", icon: Expand },
                  { id: "splice" as const, label: "杂志拼接", icon: Layers },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => { setActiveTab(tab.id); setProcessed(false); }}
                    className={cn(
                      "flex items-center gap-2 px-4 py-1.5 rounded-md text-[11px] font-bold transition-all",
                      activeTab === tab.id
                        ? "bg-white text-primary shadow-sm"
                        : "text-slate-500 hover:text-slate-700 hover:bg-white/50"
                    )}
                  >
                    <tab.icon className="h-3.5 w-3.5" />
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {processed && (
              <div className="flex gap-3 animate-in fade-in slide-in-from-right-2 duration-500">
                <Button variant="outline" size="sm" className="h-9 px-4 rounded-xl text-xs font-bold gap-2 text-primary border-primary/20 bg-primary/5 hover:bg-primary/10 shadow-sm" onClick={() => router.push('/dashboard/smart-retouch')}>
                  <Wand2 className="h-3.5 w-3.5" /> 发送至精修
                </Button>
                <div className="h-9 w-px bg-slate-200" />
                <Button variant="outline" size="sm" className="h-9 px-4 rounded-xl text-xs font-bold gap-2 text-slate-600 border-slate-200 bg-white" onClick={() => toast.success("已存入素材库")}>
                  <Save className="h-3.5 w-3.5" /> 存档
                </Button>
                <Button size="sm" className="h-9 px-6 rounded-xl text-xs font-bold gap-2 bg-slate-900 text-white shadow-xl">
                  <Download className="h-3.5 w-3.5" /> 导出原片
                </Button>
              </div>
            )}
          </div>

          <div className="flex-1 flex items-center justify-center relative">
            {!files.length ? (
              <div className="w-full max-w-xl aspect-[4/3] bg-white rounded-[32px] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.04)] flex flex-col items-center justify-center p-12 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
                <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mb-6 border border-slate-100">
                  {activeTab === 'expand' ? <Expand className="w-8 h-8 text-slate-300" /> : <Layers className="w-8 h-8 text-slate-300" />}
                </div>
                <h3 className="text-lg font-bold text-slate-800">等待加载视觉素材</h3>
                <p className="text-sm text-slate-400 mt-2 text-center max-w-[280px]">请在左侧面板上传或从素材库中选择需要处理的时尚资产</p>
              </div>
            ) : processing ? (
              <div className="relative w-full max-w-4xl aspect-[16/9] bg-white rounded-[32px] border border-slate-200 p-24 flex flex-col items-center justify-center shadow-sm overflow-hidden animate-pulse">
                <div className="absolute inset-0 bg-slate-50/30 backdrop-blur-[2px] z-10" />
                <div className="relative z-20 flex flex-col items-center">
                  <div className="w-24 h-24 mb-6 relative">
                    <div className="absolute inset-0 rounded-full border-4 border-primary/10" />
                    <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary animate-spin" />
                    <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-primary" />
                  </div>
                  <p className="text-xl font-bold text-slate-800 tracking-tight">AI 视觉引擎重构中...</p>
                  <p className="text-[10px] text-slate-400 mt-2 font-mono uppercase tracking-widest text-center">Neural_Vision_Lab_active // Layering_Pixels</p>
                </div>
              </div>
            ) : processed ? (
              <div className="w-full h-full p-4 relative flex flex-col items-center justify-center">
                {activeTab === 'expand' ? (
                  <div className={cn(
                    "bg-white shadow-2xl rounded-sm border border-slate-200 relative transition-all duration-700",
                    selectedRatio === '1:1' ? 'aspect-square h-[85%]' :
                      selectedRatio === '3:4' ? 'aspect-[3/4] h-[90%]' :
                        selectedRatio === '16:9' ? 'aspect-[16/9] w-[90%]' : 'aspect-square h-[85%]'
                  )}>
                    {/* Outpainting Canvas Visuals */}
                    <Image src="/images/feature-retouch.jpg" alt="Result" fill className="object-contain p-4 transition-all duration-1000" />

                    {/* AI Indication Overlay */}
                    <div className="absolute inset-0 border-[2px] border-dashed border-primary/20 pointer-events-none m-4 flex items-center justify-center">
                      <div className="px-4 py-2 bg-primary text-white text-[10px] font-bold tracking-widest rounded shadow-xl -mt-2">RECONSTRUCTED AREA</div>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 grid-rows-2 gap-4 w-full h-full max-h-[700px] max-w-[500px] animate-in zoom-in-95 duration-700">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="bg-white rounded-lg shadow-xl overflow-hidden border border-slate-100 relative group">
                        <Image src="/images/feature-studio.jpg" alt="Part" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/40 to-transparent h-12 flex items-end p-3">
                          <span className="text-[9px] font-bold text-white/90 uppercase tracking-widest">Detail_Slot_0{i}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center p-8">
                <div className="flex flex-wrap items-center justify-center gap-6 max-w-5xl">
                  {files.map((file, idx) => (
                    <div key={idx} className="relative group animate-in zoom-in-95 duration-300">
                      <div className="w-[180px] aspect-[3/4] bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200 relative">
                        <Image
                          src={URL.createObjectURL(file)}
                          alt="Upload preview"
                          fill
                          className="object-cover"
                          onLoadingComplete={() => {
                            // Cleanup to avoid memory leaks
                            // URL.revokeObjectURL(src); 
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                        <div className="absolute top-3 left-3 px-2 py-0.5 bg-white/90 backdrop-blur-sm rounded text-[9px] font-bold text-slate-500 shadow-sm border border-slate-200">
                          #{idx + 1}
                        </div>
                      </div>
                      <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-slate-900 text-white text-[9px] font-bold rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        待处理素材
                      </div>
                    </div>
                  ))}

                  {files.length > 0 && (
                    <div className="flex items-center gap-4">
                      <ChevronRight className="w-6 h-6 text-slate-200 animate-pulse" />
                      <div className="w-[320px] aspect-[16/9] bg-white/40 rounded-[28px] border-2 border-dashed border-slate-200 flex items-center justify-center relative overflow-hidden group">
                        <div className="flex flex-col items-center">
                          <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-3">
                            <Sparkles className="w-6 h-6 text-primary/40" />
                          </div>
                          <p className="text-[11px] font-bold text-slate-300 tracking-widest">期望输出全景预判点</p>
                        </div>
                        {/* Visual Decoration */}
                        <div className="absolute top-6 left-6 w-3 h-3 border-t-2 border-l-2 border-slate-200" />
                        <div className="absolute bottom-6 right-6 w-3 h-3 border-b-2 border-r-2 border-slate-200" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      <Dialog open={isAssetPickerOpen} onOpenChange={setIsAssetPickerOpen}>
        <DialogContent className="max-w-4xl max-h-[85vh] p-0 flex flex-col overflow-hidden bg-[#f8f9fa] border-none shadow-2xl">
          <DialogHeader className="px-6 py-4 border-b bg-white">
            <DialogTitle className="text-base font-bold text-slate-800">从素材库选取</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto p-6 grid grid-cols-4 gap-4">
            {mockDbAssets.map((asset) => (
              <div
                key={asset.id}
                onClick={() => selectAssetAndAdd(asset)}
                className="group relative aspect-[3/4] rounded-xl overflow-hidden cursor-pointer border-2 border-transparent hover:border-primary shadow-sm bg-white"
              >
                <Image src={asset.src} alt={asset.title} fill className="object-cover" />
                <div className="absolute inset-x-0 bottom-0 bg-black/60 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-white text-[10px] truncate font-medium">{asset.title}</p>
                </div>
                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button size="sm" className="bg-primary hover:bg-primary text-white pointer-events-none scale-90">选用</Button>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <style jsx global>{`
        .glow-border {
          box-shadow: 0 0 20px rgba(90, 76, 181, 0.1);
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  )
}
