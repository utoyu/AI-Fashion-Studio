"use client"

import { useState, useCallback } from "react"
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
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { UploadDropzone } from "@/components/dashboard/upload-dropzone"
import { cn } from "@/lib/utils"

type ActiveTab = "expand" | "splice"

const expandRatios = [
  { id: "1:1", label: "1:1", desc: "正方形", icon: Square },
  { id: "4:3", label: "4:3", desc: "横版", icon: RectangleHorizontal },
  { id: "3:4", label: "3:4", desc: "竖版", icon: RectangleVertical },
  { id: "16:9", label: "16:9", desc: "宽屏", icon: RectangleHorizontal },
  { id: "9:16", label: "9:16", desc: "手机屏", icon: Smartphone },
]

const spliceTemplates = [
  { id: "detail-2", label: "两图对比", desc: "左右分栏", cols: 2 },
  { id: "detail-3", label: "三图排版", desc: "一大两小", cols: 3 },
  { id: "detail-4", label: "四宫格", desc: "均等四格", cols: 2 },
  { id: "detail-6", label: "六宫格", desc: "细节展示", cols: 3 },
]

const platformSizes = [
  { id: "taobao", label: "淘宝主图", size: "800 x 800" },
  { id: "jd", label: "京东主图", size: "800 x 800" },
  { id: "douyin", label: "抖音封面", size: "1080 x 1920" },
  { id: "xiaohongshu", label: "小红书", size: "1080 x 1440" },
  { id: "pinduoduo", label: "拼多多", size: "750 x 750" },
  { id: "custom", label: "自定义", size: "任意尺寸" },
]

export default function ImageToolsPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("expand")
  const [file, setFile] = useState<File | null>(null)
  const [selectedRatio, setSelectedRatio] = useState("1:1")
  const [selectedTemplate, setSelectedTemplate] = useState("detail-4")
  const [selectedPlatform, setSelectedPlatform] = useState("taobao")
  const [processing, setProcessing] = useState(false)
  const [processed, setProcessed] = useState(false)

  const handleProcess = useCallback(() => {
    if (!file) return
    setProcessing(true)
    setTimeout(() => {
      setProcessing(false)
      setProcessed(true)
    }, 2500)
  }, [file])

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex h-20 shrink-0 items-center justify-between border-b border-border px-8 bg-white z-10">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground tracking-tight">图片工具</h1>
          <p className="text-sm text-muted-foreground mt-1">图片扩充与智能拼接，适配各电商平台尺寸</p>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="border-b border-border px-6">
        <div className="flex gap-1">
          {[
            { id: "expand" as const, label: "图片扩充", icon: Expand },
            { id: "splice" as const, label: "图片拼接", icon: Layers },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id)
                setProcessed(false)
              }}
              className={cn(
                "flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors",
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-6xl p-6">
          <div className="grid gap-8 lg:grid-cols-5">
            {/* Left: Settings */}
            <div className="flex flex-col gap-6 lg:col-span-2">
              {/* Upload */}
              <div>
                <h2 className="mb-3 text-sm font-semibold text-foreground">上传图片</h2>
                <UploadDropzone
                  onFileSelect={(files) => setFile(files[0] || null)}
                  currentFiles={file ? [file] : []}
                  onClear={() => {
                    setFile(null)
                    setProcessed(false)
                  }}
                  label={activeTab === "expand" ? "上传需要扩充的图片" : "上传需要拼接的图片"}
                />
              </div>

              {activeTab === "expand" ? (
                <>
                  {/* Ratio Selection */}
                  <div>
                    <h2 className="mb-3 text-sm font-semibold text-foreground">目标比例</h2>
                    <div className="grid grid-cols-3 gap-2">
                      {expandRatios.map((ratio) => (
                        <button
                          key={ratio.id}
                          onClick={() => setSelectedRatio(ratio.id)}
                          className={cn(
                            "flex flex-col items-center gap-1 rounded-lg border px-3 py-3 transition-all",
                            selectedRatio === ratio.id
                              ? "border-primary bg-primary/10"
                              : "border-border hover:border-primary/30"
                          )}
                        >
                          <ratio.icon className={cn("h-5 w-5", selectedRatio === ratio.id ? "text-primary" : "text-muted-foreground")} />
                          <span className={cn("text-xs font-medium", selectedRatio === ratio.id ? "text-primary" : "text-foreground")}>
                            {ratio.label}
                          </span>
                          <span className="text-[10px] text-muted-foreground">{ratio.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Platform Sizes */}
                  <div>
                    <h2 className="mb-3 text-sm font-semibold text-foreground">平台适配</h2>
                    <div className="grid grid-cols-2 gap-2">
                      {platformSizes.map((platform) => (
                        <button
                          key={platform.id}
                          onClick={() => setSelectedPlatform(platform.id)}
                          className={cn(
                            "flex flex-col rounded-lg border px-3 py-2.5 text-left transition-all",
                            selectedPlatform === platform.id
                              ? "border-primary bg-primary/10"
                              : "border-border hover:border-primary/30"
                          )}
                        >
                          <span className={cn("text-xs font-medium", selectedPlatform === platform.id ? "text-primary" : "text-foreground")}>
                            {platform.label}
                          </span>
                          <span className="text-[10px] text-muted-foreground">{platform.size}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Splice Templates */}
                  <div>
                    <h2 className="mb-3 text-sm font-semibold text-foreground">拼接模板</h2>
                    <div className="grid grid-cols-2 gap-3">
                      {spliceTemplates.map((tpl) => (
                        <button
                          key={tpl.id}
                          onClick={() => setSelectedTemplate(tpl.id)}
                          className={cn(
                            "flex flex-col items-center gap-2 rounded-xl border p-4 transition-all",
                            selectedTemplate === tpl.id
                              ? "border-primary bg-primary/10"
                              : "border-border hover:border-primary/30"
                          )}
                        >
                          <Grid3X3 className={cn("h-8 w-8", selectedTemplate === tpl.id ? "text-primary" : "text-muted-foreground")} />
                          <span className={cn("text-xs font-medium", selectedTemplate === tpl.id ? "text-primary" : "text-foreground")}>
                            {tpl.label}
                          </span>
                          <span className="text-[10px] text-muted-foreground">{tpl.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              <Button
                size="lg"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 gap-2 h-12"
                disabled={!file || processing}
                onClick={handleProcess}
              >
                {processing ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    处理中...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5" />
                    {activeTab === "expand" ? "开始扩充" : "开始拼接"}
                  </>
                )}
              </Button>
            </div>

            {/* Right: Preview */}
            <div className="flex flex-col gap-4 lg:col-span-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-foreground">预览效果</h2>
                {processed && (
                  <Button size="sm" className="bg-primary text-primary-foreground gap-1.5">
                    <Download className="h-3.5 w-3.5" />
                    下载
                  </Button>
                )}
              </div>

              {processing ? (
                <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card/50 py-32">
                  <div className="relative">
                    <div className="h-20 w-20 rounded-full border-2 border-primary/20" />
                    <div className="absolute inset-0 h-20 w-20 animate-spin rounded-full border-2 border-transparent border-t-primary" />
                    {activeTab === "expand" ? (
                      <Expand className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-8 text-primary" />
                    ) : (
                      <Layers className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-8 text-primary" />
                    )}
                  </div>
                  <p className="mt-6 font-display text-lg font-semibold text-foreground">
                    {activeTab === "expand" ? "AI正在扩充图片" : "AI正在拼接图片"}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">处理中，请稍候...</p>
                </div>
              ) : processed ? (
                <div className="overflow-hidden rounded-xl border border-primary/30 glow-border">
                  <div className="relative aspect-square">
                    <Image
                      src="/images/feature-retouch.jpg"
                      alt="处理结果"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex items-center justify-between border-t border-border bg-card px-4 py-3">
                    <span className="text-sm text-muted-foreground">
                      {activeTab === "expand" ? `已扩充为 ${selectedRatio} 比例` : "拼接完成"}
                    </span>
                    <span className="text-xs text-primary font-medium">
                      {platformSizes.find((p) => p.id === selectedPlatform)?.size || "自定义"}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/30 py-32">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary">
                    {activeTab === "expand" ? (
                      <Expand className="h-7 w-7 text-muted-foreground" />
                    ) : (
                      <Layers className="h-7 w-7 text-muted-foreground" />
                    )}
                  </div>
                  <p className="mt-4 text-sm font-medium text-muted-foreground">
                    {activeTab === "expand" ? "上传图片并选择目标比例" : "上传图片并选择拼接模板"}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">处理结果将在此处预览</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
