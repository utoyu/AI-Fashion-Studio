"use client"

import { useState, useCallback } from "react"
import Image from "next/image"
import {
  Sparkles,
  Download,
  RefreshCw,
  ChevronDown,
  Check,
  Loader2,
  ArrowRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { UploadDropzone } from "@/components/dashboard/upload-dropzone"
import { cn } from "@/lib/utils"

const modelStyles = [
  { id: "asian-female", label: "亚洲女性", desc: "20-30岁" },
  { id: "asian-male", label: "亚洲男性", desc: "20-30岁" },
  { id: "western-female", label: "欧美女性", desc: "20-30岁" },
  { id: "western-male", label: "欧美男性", desc: "20-30岁" },
  { id: "mature-female", label: "成熟女性", desc: "30-45岁" },
  { id: "teen-female", label: "少女风", desc: "18-22岁" },
]

const backgrounds = [
  { id: "studio-white", label: "纯白背景" },
  { id: "studio-gray", label: "灰色影棚" },
  { id: "outdoor-street", label: "城市街拍" },
  { id: "outdoor-park", label: "公园自然" },
  { id: "indoor-cafe", label: "咖啡店" },
  { id: "indoor-home", label: "居家场景" },
]

const poses = [
  { id: "standing", label: "站立正面" },
  { id: "half-body", label: "半身特写" },
  { id: "walking", label: "行走姿态" },
  { id: "sitting", label: "坐姿" },
  { id: "side", label: "侧身展示" },
  { id: "back", label: "背面展示" },
]

const sampleResults = [
  "/images/result-model.jpg",
  "/images/feature-model.jpg",
  "/images/feature-koc.jpg",
  "/images/hero-model.jpg",
]

export default function ModelGenerationPage() {
  const [file, setFile] = useState<File | null>(null)
  const [selectedModel, setSelectedModel] = useState("asian-female")
  const [selectedBg, setSelectedBg] = useState("studio-white")
  const [selectedPose, setSelectedPose] = useState("standing")
  const [generating, setGenerating] = useState(false)
  const [results, setResults] = useState<string[]>([])
  const [activeResult, setActiveResult] = useState(0)
  const [showModelDropdown, setShowModelDropdown] = useState(false)

  const handleGenerate = useCallback(() => {
    if (!file) return
    setGenerating(true)
    setResults([])
    // Simulate AI generation
    setTimeout(() => {
      setResults(sampleResults)
      setGenerating(false)
    }, 3000)
  }, [file])

  const selectedModelData = modelStyles.find((m) => m.id === selectedModel)

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-6 py-4">
        <div>
          <h1 className="font-display text-xl font-bold text-foreground">AI模特图生成</h1>
          <p className="text-sm text-muted-foreground">上传商品平铺图，AI自动生成专业模特穿搭图</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">今日剩余: 7/10 张</span>
          <Button variant="outline" size="sm" className="border-primary/30 text-primary hover:bg-primary/10">
            升级套餐
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-6xl p-6">
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Left: Upload + Settings */}
            <div className="flex flex-col gap-6">
              {/* Upload */}
              <div>
                <h2 className="mb-3 text-sm font-semibold text-foreground">第一步：上传商品图</h2>
                <UploadDropzone
                  onFileSelect={setFile}
                  currentFile={file}
                  onClear={() => setFile(null)}
                />
              </div>

              {/* Model Style */}
              <div>
                <h2 className="mb-3 text-sm font-semibold text-foreground">第二步：选择模特风格</h2>
                <div className="relative">
                  <button
                    onClick={() => setShowModelDropdown(!showModelDropdown)}
                    className="flex w-full items-center justify-between rounded-lg border border-border bg-card px-4 py-3 text-sm transition-colors hover:border-primary/50"
                  >
                    <span className="text-foreground">
                      {selectedModelData?.label}{" "}
                      <span className="text-muted-foreground">({selectedModelData?.desc})</span>
                    </span>
                    <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform", showModelDropdown && "rotate-180")} />
                  </button>
                  {showModelDropdown && (
                    <div className="absolute z-10 mt-1 w-full rounded-lg border border-border bg-card py-1 shadow-xl">
                      {modelStyles.map((m) => (
                        <button
                          key={m.id}
                          onClick={() => {
                            setSelectedModel(m.id)
                            setShowModelDropdown(false)
                          }}
                          className="flex w-full items-center justify-between px-4 py-2.5 text-sm text-foreground hover:bg-secondary"
                        >
                          <span>
                            {m.label} <span className="text-muted-foreground">({m.desc})</span>
                          </span>
                          {selectedModel === m.id && <Check className="h-4 w-4 text-primary" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Background */}
              <div>
                <h2 className="mb-3 text-sm font-semibold text-foreground">第三步：选择背景场景</h2>
                <div className="grid grid-cols-3 gap-2">
                  {backgrounds.map((bg) => (
                    <button
                      key={bg.id}
                      onClick={() => setSelectedBg(bg.id)}
                      className={cn(
                        "rounded-lg border px-3 py-2.5 text-xs font-medium transition-all",
                        selectedBg === bg.id
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border text-muted-foreground hover:border-primary/30 hover:text-foreground"
                      )}
                    >
                      {bg.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Pose */}
              <div>
                <h2 className="mb-3 text-sm font-semibold text-foreground">第四步：选择模特姿态</h2>
                <div className="grid grid-cols-3 gap-2">
                  {poses.map((pose) => (
                    <button
                      key={pose.id}
                      onClick={() => setSelectedPose(pose.id)}
                      className={cn(
                        "rounded-lg border px-3 py-2.5 text-xs font-medium transition-all",
                        selectedPose === pose.id
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border text-muted-foreground hover:border-primary/30 hover:text-foreground"
                      )}
                    >
                      {pose.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Generate Button */}
              <Button
                size="lg"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 gap-2 h-12"
                disabled={!file || generating}
                onClick={handleGenerate}
              >
                {generating ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    AI生成中...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5" />
                    一键生成模特图
                  </>
                )}
              </Button>
            </div>

            {/* Right: Results */}
            <div className="flex flex-col gap-4">
              <h2 className="text-sm font-semibold text-foreground">生成结果</h2>

              {generating ? (
                <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card/50 py-32">
                  <div className="relative">
                    <div className="h-20 w-20 rounded-full border-2 border-primary/20" />
                    <div className="absolute inset-0 h-20 w-20 animate-spin rounded-full border-2 border-transparent border-t-primary" />
                    <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-8 text-primary" />
                  </div>
                  <p className="mt-6 font-display text-lg font-semibold text-foreground">AI正在生成模特图</p>
                  <p className="mt-1 text-sm text-muted-foreground">预计需要3-5秒，请稍候...</p>
                  <div className="mt-4 flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
                      分析商品特征
                    </span>
                    <ArrowRight className="h-3 w-3" />
                    <span className="flex items-center gap-1">
                      <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" style={{ animationDelay: "0.3s" }} />
                      匹配模特姿态
                    </span>
                    <ArrowRight className="h-3 w-3" />
                    <span className="flex items-center gap-1">
                      <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" style={{ animationDelay: "0.6s" }} />
                      渲染输出
                    </span>
                  </div>
                </div>
              ) : results.length > 0 ? (
                <div className="flex flex-col gap-4">
                  {/* Main Result */}
                  <div className="relative overflow-hidden rounded-xl border border-border bg-card">
                    <div className="relative aspect-[3/4] w-full">
                      <Image
                        src={results[activeResult]}
                        alt="AI生成的模特图"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="absolute bottom-4 right-4 flex gap-2">
                      <Button size="sm" variant="secondary" className="bg-background/80 backdrop-blur-sm gap-1.5">
                        <Download className="h-3.5 w-3.5" />
                        下载
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        className="bg-background/80 backdrop-blur-sm gap-1.5"
                        onClick={handleGenerate}
                      >
                        <RefreshCw className="h-3.5 w-3.5" />
                        重新生成
                      </Button>
                    </div>
                  </div>

                  {/* Thumbnails */}
                  <div className="grid grid-cols-4 gap-2">
                    {results.map((src, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveResult(idx)}
                        className={cn(
                          "relative aspect-square overflow-hidden rounded-lg border-2 transition-all",
                          activeResult === idx ? "border-primary" : "border-border opacity-60 hover:opacity-100"
                        )}
                      >
                        <Image src={src} alt={`结果 ${idx + 1}`} fill className="object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/30 py-32">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary">
                    <Sparkles className="h-7 w-7 text-muted-foreground" />
                  </div>
                  <p className="mt-4 text-sm font-medium text-muted-foreground">上传商品图并点击生成</p>
                  <p className="mt-1 text-xs text-muted-foreground">AI将在3秒内生成多张模特穿搭图</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
