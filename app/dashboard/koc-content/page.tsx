"use client"

import { useState, useCallback } from "react"
import Image from "next/image"
import {
  Heart,
  Sparkles,
  Loader2,
  Download,
  RefreshCw,
  MessageCircle,
  Share2,
  Bookmark,
  Star,
  ThumbsUp,
  Image as ImageIcon,
  Check,
  ChevronDown,
  LayoutGrid,
  Smartphone,
  FileText,
  Type,
  Palette,
  X,
  Plus,
  Maximize2,
  Upload,
  Link2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { mockDbAssets } from "@/lib/mock-data"
const platforms = [
  { id: "xiaohongshu", label: "小红书", color: "bg-[#FF2442]", icon: "XHS" },
  { id: "douyin", label: "抖音", color: "bg-black", icon: "DY" },
  { id: "poizon", label: "得物 (Poizon)", color: "bg-[#00D0D1]", icon: "DW" },
  { id: "moments", label: "微信朋友圈", color: "bg-[#07C160]", icon: "PYQ" },
]

const contentDirections = [
  { id: "pro-review", label: "专业评测", desc: "侧重面料、工艺、剪裁逻辑", icon: FileText },
  { id: "scene", label: "场景演绎", desc: "商务汇报、社交、高尔夫等场合", icon: LayoutGrid },
  { id: "gift", label: "礼赠逻辑", desc: "高端仪式感、体面送礼建议", icon: Heart },
]

const toneOptions = [
  { id: "authoritative", label: "权威内敛", desc: "稳重、值得信赖" },
  { id: "wise", label: "睿智儒雅", desc: "文化底蕴、绅士感" },
  { id: "urban", label: "都会干练", desc: "现代、利落、律政精英" },
  { id: "minimalist", label: "极简主义", desc: "不费力的声明感" },
]

const sampleResults = [
  {
    image: "/images/feature-photo-studio-male.png",
    title: "16:9 全屏展示无裁切",
  },
  {
    image: "/images/result-model.jpg",
    title: "商品核心卖点特写",
  },
  {
    image: "/images/assets/business/model_brand_ambassador_2.png",
    title: "场景组合全身图",
  },
  {
    image: "/images/assets/business/bg_intl_asian_male_urban.png",
    title: "拼接版式长图展示",
  }
]

export default function EliteCatalogPage() {
  const [selectedAsset, setSelectedAsset] = useState<any>(null)
  const [referenceImages, setReferenceImages] = useState<any[]>([null, null, null]) // Up to 3 additional outfit images
  const [isAssetPickerOpen, setIsAssetPickerOpen] = useState(false)
  const [pickerTarget, setPickerTarget] = useState<"main" | "main_attributes" | number>("main") // Track which slot is being picked

  // Product Attributes Form State
  const [attributes, setAttributes] = useState({
    composition: "",
    features: "",
    care: "",
    service: "",
    size: "",
    price: ""
  })

  const [selectedPlatform, setSelectedPlatform] = useState("xiaohongshu")
  const [prompt, setPrompt] = useState("")
  const [mainImageCount, setMainImageCount] = useState(3)
  const [detailImageCount, setDetailImageCount] = useState(6)

  const [generating, setGenerating] = useState(false)
  const [results, setResults] = useState<any[]>([])

  // Automatically fill attributes when a main garment with data is selected
  const handleSelectAsset = (asset: any) => {
    if (pickerTarget === "main") {
      setSelectedAsset(asset)
      if (asset.attributes) {
        setAttributes(asset.attributes)
      } else {
        // Reset if no attributes to avoid confusion
        setAttributes({ composition: "", features: "", care: "", service: "", size: "", price: "" })
      }
    } else if (pickerTarget === "main_attributes") {
      // User has a local image uploaded, but wants to link it with library attributes
      if (asset.attributes) {
        setAttributes(asset.attributes)
      }
    } else {
      const newRef = [...referenceImages]
      newRef[pickerTarget] = asset
      setReferenceImages(newRef)
    }
    setIsAssetPickerOpen(false)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, target: "main" | number) => {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    const mockAsset = {
      id: "local-" + Date.now(),
      src: url,
      title: "本地上传图片",
      isLocal: true,
      type: "uploaded"
    }

    if (target === "main") {
      setSelectedAsset(mockAsset)
      setAttributes({ composition: "", features: "", care: "", service: "", size: "", price: "" })
    } else {
      const newRef = [...referenceImages]
      newRef[target] = mockAsset
      setReferenceImages(newRef)
    }
  }

  const openPickerFor = (target: "main" | "main_attributes" | number) => {
    setPickerTarget(target)
    setIsAssetPickerOpen(true)
  }

  const handleGenerate = useCallback(() => {
    if (!selectedAsset) return
    setGenerating(true)
    setTimeout(() => {
      // Simulate generating multiple format images based on requested count
      const totalRequested = mainImageCount + detailImageCount;
      const actualCount = Math.min(totalRequested, sampleResults.length);
      setResults(sampleResults.slice(0, actualCount))
      setGenerating(false)
    }, 2500)
  }, [selectedAsset, mainImageCount, detailImageCount])

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex h-20 shrink-0 items-center justify-between border-b border-border px-8 bg-white z-10">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground tracking-tight">电商组图 (E-Commerce Catalog)</h1>
          <p className="text-sm text-muted-foreground mt-1">品牌资产的一键部署与全球化全平台内容分发矩阵</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="max-w-[1600px] w-full mx-auto px-8 py-6">
          <div className="grid gap-10 xl:grid-cols-12">
            {/* Left: Configuration */}
            <div className="flex flex-col gap-8 xl:col-span-5">
              {/* 1. Asset & Reference Images Selection */}
              <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm">
                <h2 className="text-base font-bold text-slate-800 flex items-center gap-2.5 mb-5">
                  <ImageIcon className="w-5 h-5 text-primary" /> 选择推广资产与参考图
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  {/* Main Product Slot */}
                  {selectedAsset ? (
                    <div className="relative aspect-[4/3] rounded-xl overflow-hidden group cursor-pointer border-2 border-primary" onClick={() => !selectedAsset.isLocal && openPickerFor("main")}>
                      <Image src={selectedAsset.src} alt={selectedAsset.title} fill className="object-cover" />
                      <div className="absolute top-2 left-2 bg-primary text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm">主推产品</div>

                      {selectedAsset.isLocal && (
                        <div className="absolute top-2 right-2 flex flex-col gap-1 z-10 w-auto text-left">
                          <Button variant="secondary" size="sm" className="h-[22px] px-2 text-[9px] font-bold bg-white/95 text-primary shadow-sm whitespace-nowrap" onClick={(e) => { e.stopPropagation(); openPickerFor("main_attributes"); }}>
                            <Link2 className="w-3 h-3 mr-1" /> 关联属性提取
                          </Button>
                        </div>
                      )}

                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="secondary" size="sm" className="h-7 text-[10px] gap-1.5" onClick={(e) => { e.stopPropagation(); setSelectedAsset(null); }}>
                          重新选择 <RefreshCw className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full aspect-[4/3] rounded-xl border-dashed border-2 border-primary/30 bg-primary/5 p-2 flex flex-col items-center justify-center gap-1 group relative">
                      <p className="text-[11px] font-bold text-primary mb-1"><span className="text-red-500">*</span> 选择主推产品</p>
                      <div className="flex gap-2 w-full h-full pb-1">
                        <button onClick={() => openPickerFor("main")} className="flex-1 bg-white flex flex-col items-center justify-center rounded-lg border border-primary/20 hover:bg-primary/5 transition-colors shadow-sm">
                          <ImageIcon className="w-4 h-4 text-primary mb-1" />
                          <span className="text-[9px] text-primary/80 font-bold">从素材库选用</span>
                        </button>
                        <label className="flex-1 bg-white flex flex-col items-center justify-center rounded-lg border border-primary/20 hover:bg-primary/5 transition-colors shadow-sm cursor-pointer">
                          <Upload className="w-4 h-4 text-primary mb-1" />
                          <span className="text-[9px] text-primary/80 font-bold">本地上传主图</span>
                          <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, "main")} />
                        </label>
                      </div>
                    </div>
                  )}

                  {/* Reference Slots */}
                  {referenceImages.map((ref, idx) => (
                    ref ? (
                      <div key={idx} className="relative aspect-[4/3] rounded-xl overflow-hidden group cursor-pointer border border-slate-200" onClick={() => !ref.isLocal && openPickerFor(idx)}>
                        <Image src={ref.src} alt="Reference" fill className="object-cover" />
                        <div className="absolute top-2 left-2 bg-slate-800 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm">穿搭图 {idx + 1}</div>
                        <div className="absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-black/50 to-transparent flex justify-end p-1 pointer-events-none">
                          <button onClick={(e) => { e.stopPropagation(); const newArr = [...referenceImages]; newArr[idx] = null; setReferenceImages(newArr); }} className="w-5 h-5 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-red-500 backdrop-blur-sm transition-colors pointer-events-auto">
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                          <Button variant="secondary" size="sm" className="h-7 text-[10px] gap-1.5 pointer-events-auto" onClick={(e) => { e.stopPropagation(); const newArr = [...referenceImages]; newArr[idx] = null; setReferenceImages(newArr); }}>
                            重新选择
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div key={idx} className="w-full aspect-[4/3] rounded-xl border-dashed border-2 border-slate-200 bg-slate-50 p-2 flex flex-col items-center justify-center gap-1 group relative">
                        <p className="text-[10px] font-bold text-slate-500 mb-1">穿搭图 {idx + 1}</p>
                        <div className="flex gap-2 w-full h-full pb-1">
                          <button onClick={() => openPickerFor(idx)} className="flex-1 bg-white flex flex-col items-center justify-center rounded-lg border border-slate-200 hover:border-primary/40 transition-colors shadow-sm">
                            <ImageIcon className="w-4 h-4 text-slate-400 mb-0.5 group-hover:text-primary transition-colors" />
                            <span className="text-[8px] text-slate-500">素材库</span>
                          </button>
                          <label className="flex-1 bg-white flex flex-col items-center justify-center rounded-lg border border-slate-200 hover:border-primary/40 transition-colors shadow-sm cursor-pointer">
                            <Upload className="w-4 h-4 text-slate-400 mb-0.5 group-hover:text-primary transition-colors" />
                            <span className="text-[8px] text-slate-500">本地上传</span>
                            <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, idx)} />
                          </label>
                        </div>
                      </div>
                    )
                  ))}
                </div>
              </div>

              {/* 2. Product Attributes */}
              <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-base font-bold text-slate-800 flex items-center gap-2.5">
                    <FileText className="w-5 h-5 text-primary" /> 产品信息属性
                  </h2>
                  <span className="text-xs text-slate-400">选择资产后自动提取</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { id: "composition", label: "成分描述" },
                    { id: "features", label: "产品特点" },
                    { id: "care", label: "洗涤说明" },
                    { id: "service", label: "售后服务" },
                    { id: "size", label: "产品尺码" },
                    { id: "price", label: "产品价格" }
                  ].map(field => (
                    <div key={field.id} className="bg-slate-50 border border-slate-100 p-3 rounded-xl">
                      <label className="text-[11px] font-bold text-slate-700 block mb-2">{field.label}</label>
                      <textarea
                        className="w-full bg-transparent text-xs text-slate-500 focus:outline-none resize-none overflow-hidden h-14 custom-scrollbar placeholder:text-slate-300"
                        placeholder="-"
                        value={attributes[field.id as keyof typeof attributes]}
                        onChange={(e) => setAttributes(prev => ({ ...prev, [field.id]: e.target.value }))}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. Target Platforms */}
              <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm">
                <h2 className="mb-5 text-base font-bold text-slate-800 flex items-center gap-2.5">
                  <Smartphone className="w-5 h-5 text-primary" /> 目标投放平台
                </h2>
                <div className="flex flex-wrap gap-3">
                  {platforms.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setSelectedPlatform(p.id)}
                      className={cn(
                        "flex items-center gap-2 rounded-lg border px-3 py-2 transition-all",
                        selectedPlatform === p.id
                          ? "border-primary bg-primary/5 shadow-sm"
                          : "border-slate-100 bg-slate-50 hover:border-slate-200"
                      )}
                    >
                      <div className={cn("h-5 w-5 rounded-[4px] flex items-center justify-center text-[7px] font-bold text-white", p.color)}>
                        {p.icon}
                      </div>
                      <span className={cn("text-xs font-bold", selectedPlatform === p.id ? "text-primary" : "text-slate-600")}>
                        {p.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. Generation Controls & Prompt */}
              <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-5">
                <div>
                  <h2 className="text-base font-bold text-slate-800 mb-3">创作要求</h2>
                  <textarea
                    className="w-full h-28 bg-slate-50 rounded-xl border border-slate-200 p-4 text-[13px] text-slate-600 focus:outline-none focus:ring-1 focus:ring-primary/30 focus:border-primary/30 resize-none custom-scrollbar placeholder:text-slate-400"
                    placeholder="请输入创作要求，例如：需要展现都市白领的干练气质，主图需要一张全身半身构图的爆款图..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                  />
                </div>

                <div className="flex items-center gap-5 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-3 flex-1 pl-3">
                    <span className="text-xs font-bold text-slate-600">主图数量</span>
                    <div className="flex items-center bg-white border border-slate-200 rounded-md overflow-hidden h-8">
                      <button className="px-3 text-slate-400 hover:text-primary hover:bg-slate-50" onClick={() => setMainImageCount(Math.max(1, mainImageCount - 1))}>-</button>
                      <div className="w-8 text-center text-[13px] font-bold text-slate-700">{mainImageCount}</div>
                      <button className="px-3 text-slate-400 hover:text-primary hover:bg-slate-50" onClick={() => setMainImageCount(Math.min(5, mainImageCount + 1))}>+</button>
                    </div>
                  </div>
                  <div className="w-px h-8 bg-slate-200" />
                  <div className="flex items-center gap-3 flex-1">
                    <span className="text-xs font-bold text-slate-600">详情图数量</span>
                    <div className="flex items-center bg-white border border-slate-200 rounded-md overflow-hidden h-8">
                      <button className="px-3 text-slate-400 hover:text-primary hover:bg-slate-50" onClick={() => setDetailImageCount(Math.max(1, detailImageCount - 1))}>-</button>
                      <div className="w-8 text-center text-[13px] font-bold text-slate-700">{detailImageCount}</div>
                      <button className="px-3 text-slate-400 hover:text-primary hover:bg-slate-50" onClick={() => setDetailImageCount(Math.min(10, detailImageCount + 1))}>+</button>
                    </div>
                  </div>
                </div>

                <Button
                  size="lg"
                  className="w-full bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 gap-2 h-12 rounded-xl transition-all hover:scale-[1.01]"
                  disabled={!selectedAsset || generating}
                  onClick={handleGenerate}
                >
                  {generating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="font-bold text-sm">正在组配图文矩阵...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      <span className="font-bold text-sm">10积分生成该组图</span>
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Right: Results */}
            <div className="flex flex-col gap-4 xl:col-span-7">
              <div className="flex items-center justify-between">
                <h2 className="text-[15px] font-bold text-slate-800">生成结果矩阵预览</h2>
                {results.length > 0 && (
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="h-9 px-4 rounded-xl text-xs font-bold border-slate-200" onClick={handleGenerate}>
                      <RefreshCw className="h-3.5 w-3.5 mr-1.5" /> 批量刷新
                    </Button>
                    <Button size="sm" className="bg-primary hover:bg-primary/90 h-9 px-4 rounded-xl text-xs font-bold shadow-sm">
                      <Download className="h-3.5 w-3.5 mr-1.5" /> 批量发布部署
                    </Button>
                  </div>
                )}
              </div>

              {generating ? (
                <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card/50 py-32">
                  <div className="relative">
                    <div className="h-20 w-20 rounded-full border-2 border-primary/20" />
                    <div className="absolute inset-0 h-20 w-20 animate-spin rounded-full border-2 border-transparent border-t-primary" />
                    <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-8 text-primary" />
                  </div>
                  <p className="mt-6 font-display text-lg font-semibold text-foreground">电商矩阵数据组装中</p>
                  <p className="mt-1 text-sm text-muted-foreground">AI正在为目标平台自动排版主图与高转化详情图...</p>
                </div>
              ) : results.length > 0 ? (
                <div className="grid grid-cols-2 gap-4">
                  {results.map((item, idx) => (
                    <div
                      key={idx}
                      className="group overflow-hidden rounded-2xl border border-slate-200/60 bg-white transition-all shadow-sm hover:shadow-md flex flex-col"
                    >
                      {/* Image Preview Area */}
                      <div className="relative aspect-[3/4] w-full shrink-0 bg-slate-50 overflow-hidden">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute top-3 left-3 px-2 py-0.5 rounded flex items-center gap-1.5 bg-black/60 backdrop-blur-md text-white text-[9px] font-bold tracking-[0.05em] border border-white/10">
                          {platforms.find((p) => p.id === selectedPlatform)?.label} {idx === 0 ? "主图" : "详情图"}
                        </div>
                      </div>

                      {/* Action Area */}
                      <div className="flex items-center justify-between p-3 border-t border-slate-100 bg-slate-50/50">
                        <p className="text-[11px] font-bold text-slate-700 truncate min-w-0 pr-2">
                          {item.title}
                        </p>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-primary hover:bg-white rounded-md">
                            <Maximize2 className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="outline" size="icon" className="h-7 w-7 text-slate-400 hover:text-primary hover:bg-white border-slate-200 shadow-sm rounded-md">
                            <Download className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="col-span-2 text-center text-[10px] font-bold text-slate-400 py-4 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                    已基于主推产品生成 {results.length} 张矩阵拼图
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 py-48">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm text-slate-300">
                    <LayoutGrid className="h-8 w-8" />
                  </div>
                  <p className="mt-5 text-sm font-bold text-slate-500">配置发布方向并点击开始矩阵化创作</p>
                  <p className="mt-2 text-xs text-slate-400 max-w-[280px] text-center">AI将根据您填写的商品属性，自动组合模特、外景与卖点文案，生成电商组图</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Asset Picker Modal */}
      <Dialog open={isAssetPickerOpen} onOpenChange={setIsAssetPickerOpen}>
        <DialogContent className="max-w-6xl max-h-[85vh] p-0 flex flex-col overflow-hidden bg-white border-none shadow-2xl rounded-2xl">
          <DialogHeader className="px-6 py-5 border-b bg-slate-50/50">
            <DialogTitle className="text-base font-bold text-slate-800 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-primary" /> 从数字资产库选用发布素材
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto p-6 grid grid-cols-2 md:grid-cols-4 gap-6 auto-rows-max custom-scrollbar">
            {mockDbAssets.map((asset) => (
              <div
                key={asset.id}
                onClick={() => { setSelectedAsset(asset); setIsAssetPickerOpen(false); }}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  alert(`资产详情:\n\n标题: ${asset.title}\nID: ${asset.id}\n\nPrompt 指示词:\n${asset.prompt || "暂无指示词"}`);
                }}
                className={cn(
                  "group relative w-full aspect-[3/4] min-h-[220px] rounded-xl overflow-hidden cursor-pointer border-2 transition-all shadow-sm bg-slate-100",
                  selectedAsset?.id === asset.id ? "border-primary ring-2 ring-primary/20" : "border-transparent hover:border-primary/50"
                )}
              >
                <div className="relative w-full h-full">
                  <Image
                    src={asset.src}
                    alt={asset.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {asset.prompt && (
                    <div className="absolute top-2 left-2 z-10 bg-black/40 backdrop-blur-md rounded-full px-2 py-0.5 border border-white/20 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Sparkles className="w-2 h-2 text-primary fill-primary" />
                      <span className="text-[8px] text-white font-bold leading-tight">AI</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors" />
                </div>

                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-3 pt-8">
                  <p className="text-white text-[11px] font-bold truncate leading-tight">{asset.title}</p>
                  <p className="text-[9px] text-white/50 mt-1 uppercase tracking-wider font-medium">
                    {asset.type === 'garment' ? '实拍资产' : asset.type === 'result' ? '矩阵样片' : '品牌资产'}
                  </p>
                </div>

                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-white/90 backdrop-blur-sm text-[8px] text-slate-800 px-1.5 py-0.5 rounded shadow-sm font-bold">双击查看 Prompt</div>
                </div>

                {selectedAsset?.id === asset.id && (
                  <div className="absolute inset-0 bg-primary/20 flex items-center justify-center backdrop-blur-[1px]">
                    <div className="bg-primary text-white p-1.5 rounded-full shadow-xl ring-4 ring-white/30">
                      <Check className="w-4 h-4 stroke-[4]" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="p-4 border-t bg-slate-50 flex items-center justify-between px-6">
            <p className="text-xs text-slate-400">双击缩略图可查看资产 Prompt 溯源信息</p>
            <Button variant="outline" size="sm" className="rounded-lg h-9" onClick={() => setIsAssetPickerOpen(false)}>取消选用</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
