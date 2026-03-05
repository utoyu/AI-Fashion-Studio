"use client"

import { useState, useCallback, useRef, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Image from "next/image"
import {
  Wand2,
  SunMedium,
  Palette,
  Eraser,
  Maximize2,
  Contrast,
  Sparkles,
  Download,
  Loader2,
  RotateCcw,
  Sliders,
  Settings,
  Check,
  ChevronRight,
  ChevronLeft,
  Search,
  ZoomIn,
  Move,
  History,
  Save,
  Scan,
  Zap,
  Shirt,
  User,
  Layout,
  ScanEye
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { UploadDropzone } from "@/components/dashboard/upload-dropzone"
import { cn } from "@/lib/utils"

const retouchTools = [
  { id: "master-enhance", icon: Wand2, label: "大师级增强", desc: "全局AI光影与色彩重构", category: "preset", prompt: "Professional studio lighting, high-end fashion retouching, balanced exposure, global contrast enhancement, deep shadows, 8k resolution, realistic skin texture, master color grading" },
  { id: "wrinkle-remover", icon: Shirt, label: "全自动除皱", desc: "智能抚平衣物褶皱纹路", category: "fabric", prompt: "Texture-aware cloth smoothing, wrinkle removal, maintain fabric weave, smooth textile surfaces, clean appearance, professional fabric steamer effect" },
  { id: "texture-boost", icon: Layout, label: "面料质感增强", desc: "强化丝路与羊毛细腻感", category: "fabric", prompt: "Micro-texture enhancement, fabric detail preservation, enhance weave depth, soft shadows in fabric folds, premium textile look, high definition fibers" },
  { id: "portrait-sharp", icon: User, label: "男士人像深邃", desc: "轮廓雕刻与肤质净化", category: "portrait", prompt: "Masculine facial contouring, skin blemish removal, sharpen jawline, deep eye focus, natural skin pore preservation, cool tone purification" },
  { id: "scene-bokeh", icon: ScanEye, label: "智能景深调节", desc: "虚化背景突出商品", category: "background", prompt: "Optical bokeh simulation, shallow depth of field, sharp foreground product, blurred background architectural elements, professional lens blur, focus on central subject" },
  { id: "high-res-scale", icon: Maximize2, label: "4K超清放大", desc: "无损像素重构技术", category: "output", prompt: "Neural super-resolution, upscaling 4x, edge sharpening, noise reduction, reconstruct missing details, high fidelity digital restoration" },
]

const adjustments = [
  { id: "exposure", label: "曝光度", value: 50 },
  { id: "contrast", label: "对比度", value: 50 },
  { id: "details", label: "细节质感", value: 75 },
  { id: "smoothing", label: "平滑度", value: 40 },
  { id: "color_grade", label: "色调倾向", value: 60 },
]

export function SmartRetouchContent() {
  const searchParams = useSearchParams()
  const [file, setFile] = useState<File | null>(null)
  const [workingImage, setWorkingImage] = useState<string | null>(null)
  const [selectedTool, setSelectedTool] = useState("master-enhance")
  const [processing, setProcessing] = useState(false)
  const [processed, setProcessed] = useState(false)
  const [sliderPos, setSliderPos] = useState(50)
  const [isResizing, setIsResizing] = useState(false)
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "done">("idle")

  useEffect(() => {
    const src = searchParams.get('src')
    if (src) {
      setWorkingImage(decodeURIComponent(src))
    }
  }, [searchParams])

  const [params, setParams] = useState<Record<string, number>>(
    Object.fromEntries(adjustments.map((a) => [a.id, a.value]))
  )

  const containerRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent | MouseEvent) => {
    if (!isResizing || !containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = ((e as MouseEvent).clientX - rect.left) / rect.width
    setSliderPos(Math.max(0, Math.min(100, x * 100)))
  }

  const handleMouseUp = () => setIsResizing(false)

  useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isResizing])

  const handleProcess = useCallback(() => {
    if (!workingImage && !file) return
    setProcessing(true)
    setProcessed(false)
    setTimeout(() => {
      setProcessing(false)
      setProcessed(true)
      setSliderPos(50)
    }, 2800)
  }, [file, workingImage])

  const handleSaveToAssets = () => {
    setSaveStatus("saving")
    setTimeout(() => {
      setSaveStatus("done")
      setTimeout(() => setSaveStatus("idle"), 2000)
    }, 1500)
  }

  const activeTool = retouchTools.find(t => t.id === selectedTool)

  return (
    <main className="flex h-full flex-col bg-slate-50">
      {/* Header aligned with Dashboard style */}
      <div className="flex h-20 shrink-0 items-center justify-between border-b border-border px-8 bg-white z-10">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground tracking-tight">智能精修 (Smart Retouch)</h1>
          <p className="text-sm text-muted-foreground mt-1">基于AI神经网络的高精密视角修复与商业级资产质感重构</p>
        </div>
        <div className="flex items-center gap-3">
          {processed && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSaveToAssets}
                disabled={saveStatus !== "idle"}
                className={cn(
                  "h-9 px-4 rounded-xl text-xs font-bold gap-2 transition-all border-slate-200",
                  saveStatus === "done" ? "bg-green-50 text-green-600 border-green-200" : "bg-white text-slate-600 hover:bg-slate-50"
                )}
              >
                {saveStatus === "saving" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : saveStatus === "done" ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
                {saveStatus === "saving" ? "正在同步..." : saveStatus === "done" ? "已同步素材库" : "存入素材库"}
              </Button>
              <Button size="sm" className="bg-[#6c5dd3] hover:bg-[#5a4cb5] h-9 px-4 rounded-xl text-xs font-bold gap-2 shadow-sm">
                <Download className="w-3.5 h-3.5" /> 导出 4K 原片
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="mx-auto max-w-[1400px] p-6 lg:p-8">
          <div className="grid gap-8 lg:grid-cols-12">

            {/* Left: Professional Tools Sidebar */}
            <div className="flex flex-col gap-6 lg:col-span-3">
              <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-8">

                {/* AI Modules */}
                <section>
                  <h2 className="text-xs font-bold text-slate-800 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-primary" /> 精修核心模组
                  </h2>
                  <div className="flex flex-col gap-2">
                    {retouchTools.map((tool) => (
                      <button
                        key={tool.id}
                        onClick={() => setSelectedTool(tool.id)}
                        className={cn(
                          "flex items-center gap-3 p-3 rounded-xl border transition-all text-left group",
                          selectedTool === tool.id
                            ? "bg-primary/5 border-primary shadow-sm"
                            : "bg-slate-50 border-slate-100 hover:border-slate-200"
                        )}
                      >
                        <div className={cn(
                          "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors",
                          selectedTool === tool.id ? "bg-primary text-white" : "bg-white text-slate-400 border border-slate-100 group-hover:text-slate-600"
                        )}>
                          <tool.icon className="h-4.5 w-4.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={cn("text-xs font-bold mb-0.5", selectedTool === tool.id ? "text-primary" : "text-slate-700")}>
                            {tool.label}
                          </p>
                          <p className="text-[10px] text-slate-400 truncate">{tool.desc}</p>
                        </div>
                        {selectedTool === tool.id && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
                      </button>
                    ))}
                  </div>
                </section>

                {/* Adjustment Sliders */}
                <section>
                  <h2 className="text-xs font-bold text-slate-800 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-primary" /> 参数精细微调
                  </h2>
                  <div className="space-y-5 p-4 rounded-xl border border-slate-100 bg-slate-50/50">
                    {adjustments.map((adj) => (
                      <div key={adj.id}>
                        <div className="mb-2 flex items-center justify-between">
                          <span className="text-[11px] font-bold text-slate-600">{adj.label}</span>
                          <span className="text-[10px] font-mono text-slate-400">{params[adj.id]}%</span>
                        </div>
                        <input
                          type="range"
                          min={0}
                          max={100}
                          value={params[adj.id]}
                          onChange={(e) => setParams(prev => ({ ...prev, [adj.id]: Number(e.target.value) }))}
                          className="w-full h-1 bg-slate-200 rounded-full appearance-none cursor-pointer accent-primary"
                        />
                      </div>
                    ))}
                  </div>
                </section>

                <Button
                  size="lg"
                  className="w-full bg-[#5a4cb5] hover:bg-[#4a3ea3] text-white gap-3 h-13 rounded-2xl shadow-lg shadow-[#5a4cb5]/20"
                  disabled={(!workingImage && !file) || processing}
                  onClick={handleProcess}
                >
                  {processing ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span className="font-bold tracking-widest">正在智能解析中...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5" />
                      <span className="font-bold tracking-widest">启动 AI 处理引擎</span>
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Right: Preview Canvas */}
            <div className="lg:col-span-9">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  工作台预览 <span className="text-[11px] font-normal text-slate-400">| 全局视图分析视角</span>
                </h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => { setFile(null); setWorkingImage(null); setProcessed(false); }}
                    title="重置更改"
                    className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-primary transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                  <button
                    title="精修历史"
                    className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-primary transition-colors"
                  >
                    <History className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {!workingImage && !file ? (
                <div className="bg-white rounded-2xl border-2 border-dashed border-slate-200 p-24 shadow-sm">
                  <UploadDropzone
                    onFileSelect={(files) => {
                      const f = files[0]
                      if (f) {
                        setFile(f)
                        setWorkingImage(URL.createObjectURL(f))
                      }
                    }}
                    currentFiles={file ? [file] : []}
                    onClear={() => { setFile(null); setWorkingImage(null); setProcessed(false); }}
                    label="解析原始视觉素材 (Raw Assets)"
                    hint="系统将自动识别品类并加载专项修图模组库"
                  />
                </div>
              ) : processing ? (
                <div className="relative bg-white rounded-3xl border border-slate-200 p-12 aspect-[4/3] flex flex-col items-center justify-center shadow-sm overflow-hidden">
                  <div className="absolute inset-0 bg-slate-50/50 backdrop-blur-[2px] z-10" />
                  <div className="relative z-20 flex flex-col items-center">
                    <div className="w-24 h-24 mb-6 relative">
                      <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
                      <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary animate-spin" />
                      <Wand2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-primary" />
                    </div>
                    <p className="text-xl font-bold text-slate-800 tracking-tight">AI 神经网络协同中</p>
                    <p className="text-sm text-slate-400 mt-2 font-mono">NEURAL_RETOUCH_ENGINE_ACTIVE [v4.2]</p>
                  </div>
                </div>
              ) : processed ? (
                <>
                  <div
                    ref={containerRef}
                    className="relative w-full aspect-[4/3] bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-xl cursor-col-resize group"
                    onMouseDown={() => setIsResizing(true)}
                  >
                    {/* Result Image */}
                    <div className="absolute inset-0">
                      <Image
                        src={workingImage || "/images/feature-retouch-shirt.png"}
                        alt="Processed"
                        fill
                        className="object-contain p-8 brightness-[1.05] contrast-[1.02]"
                      />
                    </div>

                    {/* Original Image (Clipped using clip-path) */}
                    <div
                      className="absolute inset-0 z-10 border-r-2 border-white/50"
                      style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
                    >
                      <Image
                        src={workingImage || "/images/assets/shirt.png"}
                        alt="Original"
                        fill
                        className="object-contain p-8 grayscale-[0.2]"
                      />
                    </div>

                    {/* Slider Drag Handle */}
                    <div className="absolute inset-y-0 z-20" style={{ left: `calc(${sliderPos}% - 1px)` }}>
                      <div className="h-full w-[2px] bg-primary">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white border-2 border-primary flex items-center justify-center shadow-xl">
                          <div className="flex gap-1">
                            <div className="w-1 h-3 bg-primary/40 rounded-full" />
                            <div className="w-1 h-3 bg-primary/40 rounded-full" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Comparison Indicators */}
                    <div className="absolute bottom-6 left-6 z-30 px-3 py-1.5 bg-white/90 backdrop-blur rounded-lg text-[10px] font-bold text-slate-500 border border-slate-100 shadow-sm">
                      BEFORE: 原始素材
                    </div>
                    <div className="absolute bottom-6 right-6 z-30 px-3 py-1.5 bg-primary/10 backdrop-blur rounded-lg text-[10px] font-bold text-primary border border-primary/20 shadow-sm">
                      AFTER: AI 智能精修
                    </div>
                  </div>

                  {/* Prompt Info Box */}
                  <div className="mt-6 p-5 rounded-2xl bg-primary/[0.03] border border-primary/10 transition-all animate-in fade-in slide-in-from-top-2">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="h-5 w-5 rounded bg-primary/10 flex items-center justify-center">
                        <Zap className="w-3 h-3 text-primary" />
                      </div>
                      <h3 className="text-xs font-bold text-slate-700">当前精修 Prompt 溯源</h3>
                    </div>
                    <p className="text-[11px] leading-relaxed text-slate-500 font-mono bg-white/50 p-3 rounded-lg border border-primary/5">
                      {activeTool?.prompt}
                    </p>
                  </div>
                </>
              ) : (
                <div className="relative w-full aspect-[4/3] bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm flex flex-col">
                  <div className="flex-1 relative">
                    <Image
                      src={workingImage || "/images/assets/shirt.png"}
                      alt="Pending"
                      fill
                      className="object-contain p-12 opacity-80"
                    />
                  </div>
                  <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                      <p className="text-xs font-bold text-slate-700">素材已就绪：等待开启精修任务</p>
                    </div>
                    <p className="text-[11px] text-slate-400">检测到商品：高定棉质衬衫 | 建议：开启“全自动除皱”</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <style jsx global>{`
        @keyframes scan {
          0% { top: 0; }
          100% { top: 100%; }
        }
      `}</style>
    </main>
  )
}

export default function SmartRetouchPage() {
  return (
    <Suspense fallback={
      <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-50 gap-4">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-sm text-slate-400 font-medium">深度加载 AI 视觉实验室...</p>
      </div>
    }>
      <SmartRetouchContent />
    </Suspense>
  )
}
