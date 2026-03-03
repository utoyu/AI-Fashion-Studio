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
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { UploadDropzone } from "@/components/dashboard/upload-dropzone"
import { cn } from "@/lib/utils"

const platforms = [
  { id: "xiaohongshu", label: "小红书", color: "bg-red-500" },
  { id: "douyin", label: "抖音", color: "bg-foreground" },
  { id: "weibo", label: "微博", color: "bg-orange-500" },
  { id: "taobao", label: "淘宝逛逛", color: "bg-orange-600" },
]

const contentStyles = [
  { id: "daily", label: "日常穿搭", desc: "轻松自然的穿搭分享" },
  { id: "review", label: "好物测评", desc: "详细的产品体验报告" },
  { id: "ootd", label: "OOTD", desc: "今日穿搭打卡风格" },
  { id: "unboxing", label: "开箱种草", desc: "快递拆箱惊喜感" },
  { id: "compare", label: "对比评测", desc: "多产品横向对比" },
  { id: "guide", label: "搭配指南", desc: "专业穿搭建议" },
]

const toneOptions = [
  { id: "cute", label: "可爱甜美" },
  { id: "cool", label: "酷飒帅气" },
  { id: "pro", label: "专业理性" },
  { id: "casual", label: "随性自然" },
  { id: "luxury", label: "精致高级" },
  { id: "funny", label: "幽默搞笑" },
]

const sampleKocData = [
  {
    image: "/images/feature-koc.jpg",
    title: "这条裙子也太绝了吧！夏日必入",
    desc: "姐妹们！这条裙子我真的要吹爆！面料超级舒服，上身效果太可了，日常逛街约会都能穿，性价比超高推荐入手...",
    likes: "2.3万",
    comments: "1856",
  },
  {
    image: "/images/result-model.jpg",
    title: "职场穿搭 | 气质通勤look分享",
    desc: "打工人的衣橱救星来啦！这套搭配简约又不失质感，面试、开会、日常通勤都超合适，同事都来问链接了...",
    likes: "1.8万",
    comments: "923",
  },
  {
    image: "/images/feature-model.jpg",
    title: "周末约会穿什么？这套绝绝子",
    desc: "约会战袍终于找到了！显瘦显高不说，拍照还超级出片，男朋友都夸好看，赶紧安排起来吧姐妹们...",
    likes: "3.1万",
    comments: "2104",
  },
]

export default function KOCContentPage() {
  const [file, setFile] = useState<File | null>(null)
  const [selectedPlatform, setSelectedPlatform] = useState("xiaohongshu")
  const [selectedStyle, setSelectedStyle] = useState("daily")
  const [selectedTone, setSelectedTone] = useState("cute")
  const [generating, setGenerating] = useState(false)
  const [results, setResults] = useState<typeof sampleKocData>([])

  const handleGenerate = useCallback(() => {
    if (!file) return
    setGenerating(true)
    setTimeout(() => {
      setResults(sampleKocData)
      setGenerating(false)
    }, 3000)
  }, [file])

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex h-20 shrink-0 items-center justify-between border-b border-border px-8 bg-white z-10">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground tracking-tight">KOC种草内容</h1>
          <p className="text-sm text-muted-foreground mt-1">一键生成小红书、抖音风格种草图文，助力社交营销</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-6xl p-6">
          <div className="grid gap-8 lg:grid-cols-5">
            {/* Left: Settings */}
            <div className="flex flex-col gap-6 lg:col-span-2">
              <div>
                <h2 className="mb-3 text-sm font-semibold text-foreground">上传商品图</h2>
                <UploadDropzone
                  onFileSelect={(files) => setFile(files[0] || null)}
                  currentFiles={file ? [file] : []}
                  onClear={() => {
                    setFile(null)
                    setResults([])
                  }}
                />
              </div>

              {/* Platform */}
              <div>
                <h2 className="mb-3 text-sm font-semibold text-foreground">目标平台</h2>
                <div className="grid grid-cols-2 gap-2">
                  {platforms.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setSelectedPlatform(p.id)}
                      className={cn(
                        "flex items-center gap-2 rounded-lg border px-4 py-3 transition-all",
                        selectedPlatform === p.id
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/30"
                      )}
                    >
                      <div className={cn("h-3 w-3 rounded-full", p.color)} />
                      <span className={cn("text-sm font-medium", selectedPlatform === p.id ? "text-primary" : "text-foreground")}>
                        {p.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Content Style */}
              <div>
                <h2 className="mb-3 text-sm font-semibold text-foreground">内容风格</h2>
                <div className="grid grid-cols-2 gap-2">
                  {contentStyles.map((cs) => (
                    <button
                      key={cs.id}
                      onClick={() => setSelectedStyle(cs.id)}
                      className={cn(
                        "flex flex-col rounded-lg border px-3 py-2.5 text-left transition-all",
                        selectedStyle === cs.id
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/30"
                      )}
                    >
                      <span className={cn("text-xs font-medium", selectedStyle === cs.id ? "text-primary" : "text-foreground")}>
                        {cs.label}
                      </span>
                      <span className="text-[10px] text-muted-foreground">{cs.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Tone */}
              <div>
                <h2 className="mb-3 text-sm font-semibold text-foreground">语调风格</h2>
                <div className="grid grid-cols-3 gap-2">
                  {toneOptions.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setSelectedTone(t.id)}
                      className={cn(
                        "rounded-lg border px-3 py-2.5 text-xs font-medium transition-all",
                        selectedTone === t.id
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border text-muted-foreground hover:border-primary/30"
                      )}
                    >
                      {t.label}
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
                    正在生成种草内容...
                  </>
                ) : (
                  <>
                    <Heart className="h-5 w-5" />
                    生成种草内容
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
                      导出全部
                    </Button>
                  </div>
                )}
              </div>

              {generating ? (
                <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card/50 py-32">
                  <div className="relative">
                    <div className="h-20 w-20 rounded-full border-2 border-primary/20" />
                    <div className="absolute inset-0 h-20 w-20 animate-spin rounded-full border-2 border-transparent border-t-primary" />
                    <Heart className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-8 text-primary" />
                  </div>
                  <p className="mt-6 font-display text-lg font-semibold text-foreground">正在生成种草内容</p>
                  <p className="mt-1 text-sm text-muted-foreground">AI正在创作吸睛文案与排版...</p>
                </div>
              ) : results.length > 0 ? (
                <div className="flex flex-col gap-4">
                  {results.map((item, idx) => (
                    <div
                      key={idx}
                      className="overflow-hidden rounded-xl border border-border bg-card transition-all hover:border-primary/30"
                    >
                      <div className="flex flex-col md:flex-row">
                        {/* Image */}
                        <div className="relative aspect-square w-full md:w-48 shrink-0">
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            className="object-cover"
                          />
                        </div>

                        {/* Content */}
                        <div className="flex flex-1 flex-col p-4">
                          <div className="flex items-start justify-between gap-3">
                            <h3 className="font-medium text-foreground leading-tight">
                              {item.title}
                            </h3>
                            <span className="shrink-0 rounded-full bg-red-500/10 px-2 py-0.5 text-[10px] font-medium text-red-400">
                              {platforms.find((p) => p.id === selectedPlatform)?.label}
                            </span>
                          </div>
                          <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground line-clamp-3">
                            {item.desc}
                          </p>

                          {/* Engagement metrics */}
                          <div className="mt-3 flex items-center gap-4 border-t border-border pt-3">
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <ThumbsUp className="h-3.5 w-3.5" />
                              {item.likes}
                            </div>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <MessageCircle className="h-3.5 w-3.5" />
                              {item.comments}
                            </div>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Star className="h-3.5 w-3.5" />
                              收藏
                            </div>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Share2 className="h-3.5 w-3.5" />
                              分享
                            </div>
                            <div className="ml-auto flex items-center gap-1 text-xs text-muted-foreground">
                              <Bookmark className="h-3.5 w-3.5" />
                              保存
                            </div>
                          </div>

                          {/* Action buttons */}
                          <div className="mt-3 flex gap-2">
                            <Button size="sm" variant="outline" className="text-xs h-8">
                              编辑文案
                            </Button>
                            <Button size="sm" variant="outline" className="text-xs h-8">
                              复制文案
                            </Button>
                            <Button size="sm" className="bg-primary text-primary-foreground text-xs h-8 gap-1">
                              <Download className="h-3 w-3" />
                              下载图文
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/30 py-32">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary">
                    <Heart className="h-7 w-7 text-muted-foreground" />
                  </div>
                  <p className="mt-4 text-sm font-medium text-muted-foreground">上传商品图并配置参数</p>
                  <p className="mt-1 text-xs text-muted-foreground">AI将生成多条种草图文内容</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
