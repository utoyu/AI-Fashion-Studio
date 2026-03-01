"use client"

import { useState, useCallback } from "react"
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
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { UploadDropzone } from "@/components/dashboard/upload-dropzone"
import { cn } from "@/lib/utils"

const retouchTools = [
  { id: "auto-enhance", icon: Wand2, label: "一键精修", desc: "AI智能优化所有参数" },
  { id: "background-remove", icon: Eraser, label: "去除背景", desc: "一键透明/更换背景" },
  { id: "lighting", icon: SunMedium, label: "光影调整", desc: "智能补光、调整曝光" },
  { id: "color-correct", icon: Palette, label: "色彩校正", desc: "还原真实商品颜色" },
  { id: "upscale", icon: Maximize2, label: "超分辨率", desc: "AI放大不失真" },
  { id: "contrast", icon: Contrast, label: "细节增强", desc: "提升质感与细节层次" },
]

const adjustments = [
  { id: "brightness", label: "亮度", value: 65 },
  { id: "contrast", label: "对比度", value: 55 },
  { id: "saturation", label: "饱和度", value: 50 },
  { id: "sharpness", label: "锐度", value: 70 },
  { id: "noise", label: "降噪", value: 40 },
]

export default function SmartRetouchPage() {
  const [file, setFile] = useState<File | null>(null)
  const [selectedTool, setSelectedTool] = useState("auto-enhance")
  const [processing, setProcessing] = useState(false)
  const [processed, setProcessed] = useState(false)
  const [sliderValues, setSliderValues] = useState<Record<string, number>>(
    Object.fromEntries(adjustments.map((a) => [a.id, a.value]))
  )

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
      <div className="flex items-center justify-between border-b border-border px-6 py-4">
        <div>
          <h1 className="font-display text-xl font-bold text-foreground">智能精修</h1>
          <p className="text-sm text-muted-foreground">AI自动识别商品细节，一键专业级精修</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-6xl p-6">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Left: Tools Panel */}
            <div className="flex flex-col gap-6 lg:col-span-1">
              {/* Tool Selection */}
              <div>
                <h2 className="mb-3 text-sm font-semibold text-foreground">精修工具</h2>
                <div className="flex flex-col gap-2">
                  {retouchTools.map((tool) => (
                    <button
                      key={tool.id}
                      onClick={() => setSelectedTool(tool.id)}
                      className={cn(
                        "flex items-center gap-3 rounded-lg border px-4 py-3 text-left transition-all",
                        selectedTool === tool.id
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/30"
                      )}
                    >
                      <div
                        className={cn(
                          "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                          selectedTool === tool.id ? "bg-primary/20" : "bg-secondary"
                        )}
                      >
                        <tool.icon className={cn("h-4 w-4", selectedTool === tool.id ? "text-primary" : "text-muted-foreground")} />
                      </div>
                      <div>
                        <p className={cn("text-sm font-medium", selectedTool === tool.id ? "text-primary" : "text-foreground")}>
                          {tool.label}
                        </p>
                        <p className="text-xs text-muted-foreground">{tool.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Fine-tune Sliders */}
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <Sliders className="h-4 w-4 text-muted-foreground" />
                  <h2 className="text-sm font-semibold text-foreground">微调参数</h2>
                </div>
                <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4">
                  {adjustments.map((adj) => (
                    <div key={adj.id}>
                      <div className="mb-1.5 flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">{adj.label}</span>
                        <span className="text-xs font-medium text-foreground">{sliderValues[adj.id]}</span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={100}
                        value={sliderValues[adj.id]}
                        onChange={(e) =>
                          setSliderValues((prev) => ({
                            ...prev,
                            [adj.id]: Number(e.target.value),
                          }))
                        }
                        className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-secondary accent-primary"
                      />
                    </div>
                  ))}
                </div>
              </div>

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
                    开始精修
                  </>
                )}
              </Button>
            </div>

            {/* Right: Preview Area */}
            <div className="flex flex-col gap-4 lg:col-span-2">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-foreground">预览</h2>
                {processed && (
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setProcessed(false)}>
                      <RotateCcw className="h-3.5 w-3.5" />
                      重置
                    </Button>
                    <Button size="sm" className="bg-primary text-primary-foreground gap-1.5">
                      <Download className="h-3.5 w-3.5" />
                      下载精修图
                    </Button>
                  </div>
                )}
              </div>

              {!file ? (
                <UploadDropzone
                  onFileSelect={setFile}
                  currentFile={file}
                  onClear={() => {
                    setFile(null)
                    setProcessed(false)
                  }}
                  label="上传需要精修的商品图"
                  hint="支持 JPG、PNG 格式"
                />
              ) : processing ? (
                <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card/50 py-32">
                  <div className="relative">
                    <div className="h-20 w-20 rounded-full border-2 border-primary/20" />
                    <div className="absolute inset-0 h-20 w-20 animate-spin rounded-full border-2 border-transparent border-t-primary" />
                    <Wand2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-8 text-primary" />
                  </div>
                  <p className="mt-6 font-display text-lg font-semibold text-foreground">正在精修中</p>
                  <p className="mt-1 text-sm text-muted-foreground">AI正在处理您的图片...</p>
                </div>
              ) : processed ? (
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="relative overflow-hidden rounded-xl border border-border">
                    <div className="absolute top-3 left-3 z-10 rounded-full bg-background/80 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur-sm">
                      原图
                    </div>
                    <div className="relative aspect-square">
                      <Image
                        src="/images/sample-dress.jpg"
                        alt="原图"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <div className="relative overflow-hidden rounded-xl border border-primary/30 glow-border">
                    <div className="absolute top-3 left-3 z-10 rounded-full bg-primary/80 px-3 py-1 text-xs font-medium text-primary-foreground backdrop-blur-sm">
                      精修后
                    </div>
                    <div className="relative aspect-square">
                      <Image
                        src="/images/feature-retouch.jpg"
                        alt="精修后"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative overflow-hidden rounded-xl border border-border bg-card">
                  <div className="relative aspect-video">
                    <Image
                      src="/images/sample-dress.jpg"
                      alt="待精修的商品图"
                      fill
                      className="object-contain p-4"
                    />
                  </div>
                  <div className="border-t border-border bg-secondary/30 px-4 py-3">
                    <p className="text-sm text-muted-foreground">已上传，选择精修工具后点击开始</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
