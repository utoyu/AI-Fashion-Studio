"use client"

import { useState, useCallback, useEffect } from "react"
import Image from "next/image"
import {
  Users,
  Sparkles,
  Loader2,
  Download,
  RefreshCw,
  Check,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { UploadDropzone } from "@/components/dashboard/upload-dropzone"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { uploadImage } from "@/lib/storage"

const skinTones = [
  { id: "fair", label: "冷白皮", color: "bg-[#FDDCB5]" },
  { id: "natural", label: "自然色", color: "bg-[#E8B88A]" },
  { id: "warm", label: "暖阳色", color: "bg-[#D4956B]" },
  { id: "tan", label: "小麦色", color: "bg-[#B07848]" },
  { id: "deep", label: "古铜色", color: "bg-[#7B5138]" },
]

const bodyTypes = [
  { id: "slim", label: "精干修身", desc: "轻量裁剪适配" },
  { id: "athletic", label: "健美V型", desc: "倒三角模特身材" },
  { id: "standard", label: "稳重平衡", desc: "商务西装标配" },
  { id: "rugged", label: "硬朗魁梧", desc: "工装/户外风格" },
  { id: "mature", label: "资深管理", desc: "大气成熟体态" },
]

const ageRanges = [
  { id: "young", label: "20-25岁", desc: "潮流/都会" },
  { id: "elite", label: "26-35岁", desc: "职场/商务" },
  { id: "executive", label: "36-45岁", desc: "管理/睿智" },
  { id: "senior", label: "46岁以上", desc: "资深/名流" },
]

const hairStyles = [
  { id: "formal", label: "商务大背头" },
  { id: "buzz", label: "清爽寸头" },
  { id: "textured", label: "都会碎发" },
  { id: "medium", label: "雅致中长" },
  { id: "side-part", label: "经典偏分" },
  { id: "natural", label: "自然原生" },
]

const groomingStyles = [
  { id: "clean", label: "清爽净面" },
  { id: "stubble", label: "轻度胡茬" },
  { id: "shadow", label: "型格阴影" },
  { id: "full", label: "络腮胡须" },
  { id: "defined", label: "棱角修饰" },
  { id: "soft", label: "柔和修容" },
]

export default function CustomModelPage() {
  const [file, setFile] = useState<File | null>(null)
  // Cloud URL & Loading states
  const [uploadedUrl, setUploadedUrl] = useState<string>("")
  const [isUploading, setIsUploading] = useState(false);

  const [skinTone, setSkinTone] = useState("natural")
  const [bodyType, setBodyType] = useState("athletic")
  const [ageRange, setAgeRange] = useState("elite")
  const [hairStyle, setHairStyle] = useState("formal")
  const [groomingStyle, setGroomingStyle] = useState("clean")
  const [supplementalPrompt, setSupplementalPrompt] = useState("")

  const [generating, setGenerating] = useState(false)
  const [isArchiving, setIsArchiving] = useState(false)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [isHydrated, setIsHydrated] = useState(false)

  // Hydration Effect
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedUrl = localStorage.getItem('custom_model_uploaded_url');
        if (savedUrl) setUploadedUrl(savedUrl);

        const savedSkin = localStorage.getItem('custom_model_skin_tone');
        if (savedSkin) setSkinTone(savedSkin);

        const savedBody = localStorage.getItem('custom_model_body_type');
        if (savedBody) setBodyType(savedBody);

        const savedAge = localStorage.getItem('custom_model_age_range');
        if (savedAge) setAgeRange(savedAge);

        const savedHair = localStorage.getItem('custom_model_hair_style');
        if (savedHair) setHairStyle(savedHair);

        const savedGrooming = localStorage.getItem('custom_model_grooming_style');
        if (savedGrooming) setGroomingStyle(savedGrooming);

        const savedPrompt = localStorage.getItem('custom_model_prompt');
        if (savedPrompt) setSupplementalPrompt(savedPrompt);
      } catch (e) {
        console.error("Failed to load custom model settings", e);
      }
      setIsHydrated(true);
    }
  }, []);

  // Matrix result: 6 views as requested
  const [results, setResults] = useState<{
    portrait: { front: string; side: string; back: string };
    fullBody: { front: string; side: string; back: string };
  } | null>(null)

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handleSelectAll = () => {
    if (!results) return
    const allIds = [
      'p-front', 'p-side', 'p-back',
      'f-front', 'f-side', 'f-back'
    ]
    if (selectedIds.size === allIds.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(allIds))
    }
  }

  const handleArchive = useCallback(() => {
    if (selectedIds.size === 0) return

    setIsArchiving(true)
    const count = selectedIds.size

    // Simulate API call
    setTimeout(() => {
      toast.success(`成功归档 ${count} 项资产至素材库`, {
        description: "您可以在素材库的‘AI模特图’分类中查看这些资产",
        duration: 3000,
      })
      setIsArchiving(false)
      setSelectedIds(new Set()) // Clear selection after success
    }, 1200)
  }, [selectedIds])

  // Persistence Effect
  useEffect(() => {
    if (isHydrated && typeof window !== 'undefined') {
      localStorage.setItem('custom_model_uploaded_url', uploadedUrl);
      localStorage.setItem('custom_model_skin_tone', skinTone);
      localStorage.setItem('custom_model_body_type', bodyType);
      localStorage.setItem('custom_model_age_range', ageRange);
      localStorage.setItem('custom_model_hair_style', hairStyle);
      localStorage.setItem('custom_model_grooming_style', groomingStyle);
      localStorage.setItem('custom_model_prompt', supplementalPrompt);
    }
  }, [isHydrated, uploadedUrl, skinTone, bodyType, ageRange, hairStyle, groomingStyle, supplementalPrompt]);

  const handleGenerate = useCallback(() => {
    setGenerating(true)
    setTimeout(() => {
      setResults({
        portrait: {
          front: "/images/assets/business/model_brand_ambassador_1.png",
          side: "/images/assets/business/model_brand_ambassador_2.png",
          back: "/images/assets/business/bg_intl_asian_male_urban.png", // placeholders
        },
        fullBody: {
          front: "/images/assets/business/model_brand_ambassador_1.png",
          side: "/images/assets/business/model_brand_ambassador_2.png",
          back: "/images/assets/business/bg_intl_asian_male_mountain.png",
        }
      })
      setGenerating(false)
    }, 4000)
  }, [])

  return (
    <div className="flex h-full flex-col bg-background">
      {/* Header */}
      <div className="flex h-20 shrink-0 items-center justify-between border-b border-border px-8 bg-white z-10">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground tracking-tight italic">AI模特定制</h1>
          <p className="text-sm text-muted-foreground mt-1">根据上传形象或设定的多维参数，深度定制男装品牌专属 AI 形象资产</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto hide-scrollbar">
        <div className="mx-auto max-w-7xl p-8">
          <div className="grid gap-10 lg:grid-cols-12">

            {/* Left: Customization Console */}
            <div className="flex flex-col gap-8 lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm h-fit">
              <div className="flex items-center gap-2 mb-2 text-primary">
                <Sparkles className="h-4 w-4" />
                <span className="text-sm font-bold tracking-widest uppercase">参数设定控制台</span>
              </div>

              {/* Upload Persona Source */}
              <div>
                <h2 className="mb-3 text-xs font-bold text-slate-500 uppercase tracking-tighter flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  大使视觉雏形上传 (可选)
                </h2>
                <UploadDropzone
                  onFileSelect={async (files) => {
                    const selected = files[0];
                    if (!selected) return;
                    setFile(selected);

                    setIsUploading(true);
                    const toastId = toast.loading("形象雏形正在同步至云端...");
                    try {
                      const realUrl = await uploadImage(selected);
                      setUploadedUrl(realUrl);
                      toast.success("形象同步成功", { id: toastId });
                    } catch (err) {
                      toast.error("同步失败，请重试", { id: toastId });
                    } finally {
                      setIsUploading(false);
                    }
                  }}
                  currentFiles={file ? [file] : []}
                  onClear={() => {
                    setFile(null)
                    setUploadedUrl("")
                    setResults(null)
                  }}
                />
              </div>

              {/* Supplemental Prompt */}
              <div>
                <h2 className="mb-3 text-xs font-bold text-slate-500 uppercase tracking-tighter">补充建模指引 (Prompt)</h2>
                <Textarea
                  placeholder="在此输入更具体的额外要求，例如：眼神坚毅、五官深邃、具有亲和力的高层领导者气质..."
                  className="min-h-[100px] rounded-xl border-slate-100 bg-slate-50/50 text-xs font-medium placeholder:text-slate-300 resize-none focus-visible:ring-primary/20"
                  value={supplementalPrompt}
                  onChange={(e) => setSupplementalPrompt(e.target.value)}
                />
              </div>

              {/* Skin Tone */}
              <div>
                <h2 className="mb-4 text-xs font-bold text-slate-500 uppercase tracking-tighter">肤色调节</h2>
                <div className="flex justify-between px-2">
                  {skinTones.map((tone) => (
                    <button
                      key={tone.id}
                      onClick={() => setSkinTone(tone.id)}
                      className="group flex flex-col items-center gap-2"
                    >
                      <div
                        className={cn(
                          "h-8 w-8 rounded-full border-2 transition-all p-0.5",
                          skinTone === tone.id ? "border-primary ring-2 ring-primary/20 scale-110" : "border-slate-100"
                        )}
                      >
                        <div className={cn("w-full h-full rounded-full shadow-inner", tone.color)} />
                      </div>
                      <span className={cn("text-[10px] font-medium transition-colors", skinTone === tone.id ? "text-primary" : "text-slate-400 group-hover:text-slate-600")}>
                        {tone.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Age Range - Elite focus */}
              <div>
                <h2 className="mb-3 text-xs font-bold text-slate-500 uppercase tracking-tighter">大使职系 (年龄段)</h2>
                <div className="grid grid-cols-2 gap-3">
                  {ageRanges.map((age) => (
                    <button
                      key={age.id}
                      onClick={() => setAgeRange(age.id)}
                      className={cn(
                        "flex flex-col items-center rounded-xl border p-3 transition-all text-center",
                        ageRange === age.id
                          ? "border-primary bg-primary/[0.03] ring-1 ring-primary/20 shadow-sm"
                          : "border-slate-100 hover:border-slate-200"
                      )}
                    >
                      <span className={cn("text-xs font-bold", ageRange === age.id ? "text-primary" : "text-slate-700")}>
                        {age.label}
                      </span>
                      <span className="text-[10px] text-slate-400 mt-0.5">{age.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Body Type - Menswear specific */}
              <div>
                <h2 className="mb-3 text-xs font-bold text-slate-500 uppercase tracking-tighter">体型拓扑</h2>
                <div className="grid grid-cols-1 gap-2">
                  {bodyTypes.map((bt) => (
                    <button
                      key={bt.id}
                      onClick={() => setBodyType(bt.id)}
                      className={cn(
                        "flex items-center justify-between rounded-xl border px-4 py-3 transition-all",
                        bodyType === bt.id
                          ? "border-primary bg-primary/[0.03] shadow-sm"
                          : "border-slate-100 hover:border-slate-200"
                      )}
                    >
                      <span className={cn("text-xs font-bold", bodyType === bt.id ? "text-primary" : "text-slate-700")}>
                        {bt.label}
                      </span>
                      <span className="text-[10px] text-slate-400">{bt.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Grooming - Replacing Makeup */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h2 className="mb-3 text-xs font-bold text-slate-500 uppercase tracking-tighter text-center">发型模组</h2>
                  <div className="relative">
                    <select
                      value={hairStyle}
                      onChange={(e) => setHairStyle(e.target.value)}
                      className="w-full h-10 rounded-xl border border-slate-100 bg-slate-50/50 px-3 text-[11px] font-bold text-slate-700 outline-none appearance-none cursor-pointer focus:ring-2 focus:ring-primary/20"
                    >
                      {hairStyles.map(hs => <option key={hs.id} value={hs.id}>{hs.label}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <h2 className="mb-3 text-xs font-bold text-slate-500 uppercase tracking-tighter text-center">面部修容</h2>
                  <div className="relative">
                    <select
                      value={groomingStyle}
                      onChange={(e) => setGroomingStyle(e.target.value)}
                      className="w-full h-10 rounded-xl border border-slate-100 bg-slate-50/50 px-3 text-[11px] font-bold text-slate-700 outline-none appearance-none cursor-pointer focus:ring-2 focus:ring-primary/20"
                    >
                      {groomingStyles.map(gs => <option key={gs.id} value={gs.id}>{gs.label}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              <Button
                size="lg"
                className="w-full bg-primary hover:bg-primary/90 text-white gap-3 h-14 rounded-2xl shadow-xl shadow-primary/20 mt-4 overflow-hidden group"
                disabled={generating || isUploading}
                onClick={handleGenerate}
              >
                {generating || isUploading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span className="font-bold tracking-widest italic">{isUploading ? "同步中..." : "建模中..."}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 fill-white/20" />
                    <span className="font-bold tracking-widest italic">开始高精度建模同步</span>
                  </div>
                )}
              </Button>
            </div>

            {/* Right: Asset Matrix Output */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-white font-mono text-xs">
                    MT.
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-800">大使数字模型矩阵 (Asset Matrix)</h2>
                    <p className="text-[11px] text-slate-400 font-medium">六轴视角资产实时输出</p>
                  </div>
                </div>
                {results && (
                  <div className="flex items-center gap-4">
                    <button
                      onClick={handleSelectAll}
                      className="text-[11px] font-bold text-primary hover:underline underline-offset-4"
                    >
                      {selectedIds.size === 6 ? '取消全选' : '全选所有视角'}
                    </button>
                    <div className="h-4 w-[1px] bg-slate-200" />
                    <div className="flex gap-3">
                      <Button variant="outline" size="sm" className="rounded-full border-slate-200 text-xs font-bold px-4" onClick={handleGenerate}>
                        <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
                        重新校准
                      </Button>
                      <Button
                        size="sm"
                        disabled={selectedIds.size === 0 || isArchiving}
                        onClick={handleArchive}
                        className="bg-primary hover:bg-primary/90 text-white rounded-full px-5 text-xs font-bold shadow-lg shadow-primary/20"
                      >
                        {isArchiving ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
                        ) : (
                          <Download className="h-3.5 w-3.5 mr-1.5" />
                        )}
                        {isArchiving ? '正在归档...' : (selectedIds.size > 0 ? `归档所选 (${selectedIds.size})` : '归档至素材库')}
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {generating ? (
                <div className="flex-1 flex flex-col items-center justify-center bg-slate-50/50 rounded-[32px] border-2 border-dashed border-slate-100 mt-10">
                  <div className="relative mb-8">
                    <div className="h-32 w-32 rounded-full border-4 border-primary/5 shadow-2xl shadow-primary/10" />
                    <div className="absolute inset-0 h-32 w-32 animate-spin rounded-full border-4 border-transparent border-t-primary" />
                    <Users className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-10 w-10 text-primary opacity-50" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 italic tracking-wider">正在构建多维数字孪生</h3>
                  <p className="text-sm text-slate-400 mt-2 font-medium">计算人物三维拓扑特征与面部光影重映射...</p>
                </div>
              ) : results ? (
                <div className="flex flex-col gap-10">
                  {/* Portrait Section (Face Matrix) */}
                  <section>
                    <div className="flex items-center gap-2 mb-6">
                      <div className="h-4 w-1 bg-primary rounded-full" />
                      <h3 className="text-sm font-bold text-slate-700 tracking-widest uppercase">面部视觉系统 (Portrait Views)</h3>
                    </div>
                    <div className="grid grid-cols-3 gap-6">
                      {[
                        { key: "p-front", label: "001 正视视角", src: results.portrait.front },
                        { key: "p-side", label: "002 侧颜视角", src: results.portrait.side },
                        { key: "p-back", label: "003 后枕视角", src: results.portrait.back }
                      ].map((view) => (
                        <div key={view.key} className="group relative cursor-pointer" onClick={() => toggleSelect(view.key)}>
                          <div className="absolute -top-3 left-4 px-2 py-0.5 bg-slate-800 text-white text-[9px] font-mono tracking-tighter rounded z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                            {view.label}
                          </div>

                          {/* Selection Checkbox Overlay */}
                          <div className={cn(
                            "absolute top-3 right-3 z-20 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                            selectedIds.has(view.key)
                              ? "bg-primary border-primary scale-110 shadow-lg"
                              : "bg-white/50 border-white/80 group-hover:bg-white"
                          )}>
                            {selectedIds.has(view.key) && <Check className="w-3 h-3 text-white stroke-[3px]" />}
                          </div>

                          <div className={cn(
                            "relative aspect-square rounded-[24px] overflow-hidden border-2 transition-all duration-500",
                            selectedIds.has(view.key)
                              ? "border-primary shadow-xl -translate-y-1"
                              : "border-slate-100 shadow-sm group-hover:shadow-lg"
                          )}>
                            <Image src={view.src} alt={view.label} fill className="object-cover" />
                            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* Full Body Section (Body Matrix) */}
                  <section>
                    <div className="flex items-center gap-2 mb-6">
                      <div className="h-4 w-1 bg-primary rounded-full" />
                      <h3 className="text-sm font-bold text-slate-700 tracking-widest uppercase">全身剪裁系统 (Full Body Views)</h3>
                    </div>
                    <div className="grid grid-cols-3 gap-6">
                      {[
                        { key: "f-front", label: "F-001 正向姿态", src: results.fullBody.front },
                        { key: "f-side", label: "S-001 侧向动态", src: results.fullBody.side },
                        { key: "f-back", label: "B-001 背向剪裁", src: results.fullBody.back }
                      ].map((view) => (
                        <div key={view.key} className="group relative cursor-pointer" onClick={() => toggleSelect(view.key)}>
                          <div className="absolute -top-3 left-4 px-2 py-0.5 bg-slate-800 text-white text-[9px] font-mono tracking-tighter rounded z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                            {view.label}
                          </div>

                          {/* Selection Checkbox Overlay */}
                          <div className={cn(
                            "absolute top-3 right-3 z-20 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                            selectedIds.has(view.key)
                              ? "bg-primary border-primary scale-110 shadow-lg"
                              : "bg-white/50 border-white/80 group-hover:bg-white"
                          )}>
                            {selectedIds.has(view.key) && <Check className="w-3 h-3 text-white stroke-[3px]" />}
                          </div>

                          <div className={cn(
                            "relative aspect-[3/4] rounded-[24px] overflow-hidden border-2 transition-all duration-500",
                            selectedIds.has(view.key)
                              ? "border-primary shadow-xl -translate-y-1"
                              : "border-slate-100 shadow-sm group-hover:shadow-lg"
                          )}>
                            <Image src={view.src} alt={view.label} fill className="object-cover" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center bg-slate-50/50 rounded-[32px] border-2 border-dashed border-slate-100 mt-10 p-20 text-center">
                  <div className="w-20 h-20 rounded-3xl bg-white border border-slate-100 shadow-inner flex items-center justify-center mb-6">
                    <Sparkles className="h-8 w-8 text-slate-200" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-700">等待资产指派</h3>
                  <p className="text-sm text-slate-400 mt-2 max-w-xs mx-auto leading-relaxed">
                    请在左侧控制台配置大师参数并上传雏形，系统将为您生成标准的六轴视图建模结果
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
