"use client"

import { useState, useCallback } from "react"
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
import { UploadDropzone } from "@/components/dashboard/upload-dropzone"
import { cn } from "@/lib/utils"

const skinTones = [
  { id: "fair", label: "白皙", color: "bg-[#FDDCB5]" },
  { id: "natural", label: "自然", color: "bg-[#E8B88A]" },
  { id: "warm", label: "暖色", color: "bg-[#D4956B]" },
  { id: "tan", label: "小麦色", color: "bg-[#B07848]" },
  { id: "deep", label: "深色", color: "bg-[#7B5138]" },
]

const bodyTypes = [
  { id: "slim", label: "纤细", desc: "偏瘦体型" },
  { id: "standard", label: "标准", desc: "匀称体型" },
  { id: "athletic", label: "运动", desc: "健美体型" },
  { id: "curvy", label: "丰满", desc: "圆润体型" },
  { id: "plus", label: "大码", desc: "大码友好" },
]

const ageRanges = [
  { id: "teen", label: "18-22", desc: "学生风" },
  { id: "young", label: "23-28", desc: "轻熟风" },
  { id: "mature", label: "29-35", desc: "知性风" },
  { id: "elegant", label: "36-45", desc: "优雅风" },
]

const hairStyles = [
  { id: "long-straight", label: "长直发" },
  { id: "long-curl", label: "长卷发" },
  { id: "medium", label: "中长发" },
  { id: "short", label: "短发" },
  { id: "ponytail", label: "马尾" },
  { id: "bun", label: "丸子头" },
]

const makeupStyles = [
  { id: "natural", label: "自然裸妆" },
  { id: "light", label: "淡妆" },
  { id: "glam", label: "精致妆容" },
  { id: "korean", label: "韩系妆容" },
  { id: "vintage", label: "复古妆容" },
  { id: "none", label: "无妆" },
]

export default function CustomModelPage() {
  const [file, setFile] = useState<File | null>(null)
  const [skinTone, setSkinTone] = useState("natural")
  const [bodyType, setBodyType] = useState("standard")
  const [ageRange, setAgeRange] = useState("young")
  const [hairStyle, setHairStyle] = useState("long-straight")
  const [makeupStyle, setMakeupStyle] = useState("natural")
  const [generating, setGenerating] = useState(false)
  const [results, setResults] = useState<string[]>([])
  const [activeResult, setActiveResult] = useState(0)

  const handleGenerate = useCallback(() => {
    if (!file) return
    setGenerating(true)
    setTimeout(() => {
      setResults([
        "/images/result-model.jpg",
        "/images/feature-model.jpg",
        "/images/feature-koc.jpg",
      ])
      setGenerating(false)
    }, 3500)
  }, [file])

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-6 py-4">
        <div>
          <h1 className="font-display text-xl font-bold text-foreground">定制模特</h1>
          <p className="text-sm text-muted-foreground">自定义肤色、体型、年龄、发型、妆容，打造专属AI模特</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-6xl p-6">
          <div className="grid gap-8 lg:grid-cols-5">
            {/* Left: Customization */}
            <div className="flex flex-col gap-6 lg:col-span-2">
              {/* Upload */}
              <div>
                <h2 className="mb-3 text-sm font-semibold text-foreground">上传商品图</h2>
                <UploadDropzone
                  onFileSelect={setFile}
                  currentFile={file}
                  onClear={() => {
                    setFile(null)
                    setResults([])
                  }}
                />
              </div>

              {/* Skin Tone */}
              <div>
                <h2 className="mb-3 text-sm font-semibold text-foreground">肤色</h2>
                <div className="flex gap-3">
                  {skinTones.map((tone) => (
                    <button
                      key={tone.id}
                      onClick={() => setSkinTone(tone.id)}
                      className="flex flex-col items-center gap-1.5"
                      title={tone.label}
                    >
                      <div
                        className={cn(
                          "h-10 w-10 rounded-full border-2 transition-all",
                          tone.color,
                          skinTone === tone.id ? "border-primary scale-110" : "border-border"
                        )}
                      />
                      <span className={cn("text-[10px]", skinTone === tone.id ? "text-primary font-medium" : "text-muted-foreground")}>
                        {tone.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Body Type */}
              <div>
                <h2 className="mb-3 text-sm font-semibold text-foreground">体型</h2>
                <div className="grid grid-cols-3 gap-2">
                  {bodyTypes.map((bt) => (
                    <button
                      key={bt.id}
                      onClick={() => setBodyType(bt.id)}
                      className={cn(
                        "flex flex-col rounded-lg border px-3 py-2 text-left transition-all",
                        bodyType === bt.id
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/30"
                      )}
                    >
                      <span className={cn("text-xs font-medium", bodyType === bt.id ? "text-primary" : "text-foreground")}>
                        {bt.label}
                      </span>
                      <span className="text-[10px] text-muted-foreground">{bt.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Age Range */}
              <div>
                <h2 className="mb-3 text-sm font-semibold text-foreground">年龄段</h2>
                <div className="grid grid-cols-4 gap-2">
                  {ageRanges.map((age) => (
                    <button
                      key={age.id}
                      onClick={() => setAgeRange(age.id)}
                      className={cn(
                        "flex flex-col items-center rounded-lg border px-2 py-2.5 transition-all",
                        ageRange === age.id
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/30"
                      )}
                    >
                      <span className={cn("text-xs font-medium", ageRange === age.id ? "text-primary" : "text-foreground")}>
                        {age.label}
                      </span>
                      <span className="text-[10px] text-muted-foreground">{age.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Hair Style */}
              <div>
                <h2 className="mb-3 text-sm font-semibold text-foreground">发型</h2>
                <div className="grid grid-cols-3 gap-2">
                  {hairStyles.map((hs) => (
                    <button
                      key={hs.id}
                      onClick={() => setHairStyle(hs.id)}
                      className={cn(
                        "rounded-lg border px-3 py-2.5 text-xs font-medium transition-all",
                        hairStyle === hs.id
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border text-muted-foreground hover:border-primary/30"
                      )}
                    >
                      {hs.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Makeup */}
              <div>
                <h2 className="mb-3 text-sm font-semibold text-foreground">妆容</h2>
                <div className="grid grid-cols-3 gap-2">
                  {makeupStyles.map((ms) => (
                    <button
                      key={ms.id}
                      onClick={() => setMakeupStyle(ms.id)}
                      className={cn(
                        "rounded-lg border px-3 py-2.5 text-xs font-medium transition-all",
                        makeupStyle === ms.id
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border text-muted-foreground hover:border-primary/30"
                      )}
                    >
                      {ms.label}
                    </button>
                  ))}
                </div>
              </div>

              <Button
                size="lg"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 gap-2 h-12"
                disabled={!file || generating}
                onClick={handleGenerate}
              >
                {generating ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    正在生成定制模特...
                  </>
                ) : (
                  <>
                    <Users className="h-5 w-5" />
                    生成定制模特图
                  </>
                )}
              </Button>
            </div>

            {/* Right: Results */}
            <div className="flex flex-col gap-4 lg:col-span-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-foreground">生成结果</h2>
                {results.length > 0 && (
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-1.5" onClick={handleGenerate}>
                      <RefreshCw className="h-3.5 w-3.5" />
                      重新生成
                    </Button>
                    <Button size="sm" className="bg-primary text-primary-foreground gap-1.5">
                      <Download className="h-3.5 w-3.5" />
                      下载全部
                    </Button>
                  </div>
                )}
              </div>

              {/* Config Summary */}
              {file && !generating && results.length === 0 && (
                <div className="rounded-xl border border-border bg-card p-4">
                  <p className="mb-2 text-xs font-medium text-muted-foreground">当前配置</p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      skinTones.find((s) => s.id === skinTone)?.label,
                      bodyTypes.find((b) => b.id === bodyType)?.label,
                      ageRanges.find((a) => a.id === ageRange)?.label + "岁",
                      hairStyles.find((h) => h.id === hairStyle)?.label,
                      makeupStyles.find((m) => m.id === makeupStyle)?.label,
                    ].map((tag) => (
                      <span key={tag} className="flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-xs text-foreground">
                        <Check className="h-3 w-3 text-primary" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {generating ? (
                <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card/50 py-32">
                  <div className="relative">
                    <div className="h-20 w-20 rounded-full border-2 border-primary/20" />
                    <div className="absolute inset-0 h-20 w-20 animate-spin rounded-full border-2 border-transparent border-t-primary" />
                    <Users className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-8 text-primary" />
                  </div>
                  <p className="mt-6 font-display text-lg font-semibold text-foreground">正在生成定制模特</p>
                  <p className="mt-1 text-sm text-muted-foreground">根据您的定制参数生成中...</p>
                </div>
              ) : results.length > 0 ? (
                <div className="flex flex-col gap-4">
                  <div className="relative overflow-hidden rounded-xl border border-border bg-card">
                    <div className="relative aspect-[3/4] w-full">
                      <Image
                        src={results[activeResult]}
                        alt="定制模特图"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {results.map((src, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveResult(idx)}
                        className={cn(
                          "relative aspect-[3/4] overflow-hidden rounded-lg border-2 transition-all",
                          activeResult === idx ? "border-primary" : "border-border opacity-60 hover:opacity-100"
                        )}
                      >
                        <Image src={src} alt={`方案 ${idx + 1}`} fill className="object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/30 py-32">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary">
                    <Sparkles className="h-7 w-7 text-muted-foreground" />
                  </div>
                  <p className="mt-4 text-sm font-medium text-muted-foreground">自定义模特参数后点击生成</p>
                  <p className="mt-1 text-xs text-muted-foreground">AI将根据您的偏好生成专属模特</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
