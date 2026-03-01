"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Wand2, Expand, Layers, Users, Heart, Clapperboard } from "lucide-react"
import { Button } from "@/components/ui/button"

const features = [
  {
    icon: Wand2,
    title: "智能精修",
    description: "AI自动识别商品细节，智能调整色彩、光影、质感。一键去背景、换场景，商品图瞬间提升专业度。",
    image: "/images/feature-retouch.jpg",
    href: "/dashboard/smart-retouch",
    stats: "处理速度 < 5秒",
  },
  {
    icon: Expand,
    title: "图片扩充",
    description: "智能扩展图片边界，自动补充背景内容。从单一商品图延伸出完整场景，适配各平台尺寸需求。",
    image: "/images/feature-retouch.jpg",
    href: "/dashboard/image-tools",
    stats: "支持 20+ 尺寸",
  },
  {
    icon: Layers,
    title: "图片拼接",
    description: "智能版式设计，多图自动排版拼接。生成电商详情页、卖点对比图、多角度展示图，提升信息密度。",
    image: "/images/feature-retouch.jpg",
    href: "/dashboard/image-tools",
    stats: "50+ 模板",
  },
  {
    icon: Users,
    title: "定制模特",
    description: "AI生成多种风格模特，支持自定义肤色、体型、年龄、妆容。真人级别渲染效果，无需实拍即可获得专业模特图。",
    image: "/images/feature-model.jpg",
    href: "/dashboard/custom-model",
    stats: "100+ 模特风格",
  },
  {
    icon: Heart,
    title: "KOC种草",
    description: "一键生成小红书、抖音风格种草图文。AI自动匹配热门版式、文案模板，让商品内容直接触达消费者。",
    image: "/images/feature-koc.jpg",
    href: "/dashboard/koc-content",
    stats: "转化率提升 200%",
  },
  {
    icon: Clapperboard,
    title: "场景视频",
    description: "从静态图片生成动态场景视频、功能展示视频、剧情短片。AI驱动的视频内容生产线，降低90%视频制作成本。",
    image: "/images/feature-model.jpg",
    href: "/dashboard/model-generation",
    stats: "即将上线",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section Header */}
        <div className="text-center">
          <span className="text-sm font-medium uppercase tracking-widest text-primary">
            核心功能
          </span>
          <h2 className="font-display mt-4 text-3xl font-bold text-foreground md:text-5xl text-balance">
            全链路AI视觉解决方案
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            从商品平铺图到营销物料，一站式搞定所有电商视觉需求
          </p>
        </div>

        {/* Features Grid */}
        <div className="mt-20 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Link
              key={feature.title}
              href={feature.href}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:border-primary/50 hover:glow-border"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={feature.image}
                  alt={feature.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
                <div className="absolute top-4 right-4 rounded-full bg-primary/20 px-3 py-1 text-xs font-medium text-primary backdrop-blur-sm">
                  {feature.stats}
                </div>
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <feature.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-display text-lg font-bold text-foreground">
                    {feature.title}
                  </h3>
                </div>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
                <div className="mt-4 flex items-center gap-1 text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                  立即使用
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
