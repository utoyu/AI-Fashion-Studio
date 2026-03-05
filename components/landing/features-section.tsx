"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Wand2, Expand, Sparkles, Heart, Camera, Image as ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

const features = [
  {
    icon: Camera,
    title: "AI 全能摄影室",
    description: "品牌级 AI 拍摄系统。支持服装、模特、场景的高度自定义配置，一键产出符合男装品牌 DNA 的商业级摄影大片。",
    image: "/images/feature-photo-studio-male.png",
    href: "/dashboard/photo-studio",
    stats: "极致光影还原",
  },
  {
    icon: Sparkles,
    title: "虚拟大使建模",
    description: "深度定制品牌专属 AI 代言人。支持肤色、体型拓扑、职系特征等多维度精细参数设定，构建六轴视觉模型资产。",
    image: "/images/feature-virtual-ambassador-male.png",
    href: "/dashboard/custom-model",
    stats: "高精度 3D 拓扑",
  },
  {
    icon: Wand2,
    title: "智能精修系统",
    description: "AI 自动识别服装细节，智能调整面料质感与色彩平衡。支持高精度一键去背景及光影重映射，重塑资产专业度。",
    image: "/images/feature-retouch-shirt.png",
    href: "/dashboard/smart-retouch",
    stats: "工业级像素处理",
  },
  {
    icon: Expand,
    title: "图片扩充工具",
    description: "智能延伸图片边界，自动补全场景内容。支持从平铺图延伸出完整意境大片，完美适配各类电商平台尺寸需求。",
    image: "/images/feature-retouch-shirt.png",
    href: "/dashboard/image-tools",
    stats: "全比例自动适配",
  },
  {
    icon: Heart,
    title: "电商组图 (E-Commerce Catalog)",
    description: "针对精英商务、都会休闲等垂直场景，一键生成小红书/抖音风格种草图文，极大缩短内容生产到转化的路径。",
    image: "/images/feature-koc.jpg",
    href: "/dashboard/koc-content",
    stats: "内容生产率 +500%",
  },
  {
    icon: ImageIcon,
    title: "智能素材库",
    description: "结构化管理品牌数字资产。支持按品类、职系、场景智能筛选，实现服装、模特、背景等模块化资产的秒级检索与调用。",
    image: "/images/feature-retouch.jpg",
    href: "/dashboard/assets",
    stats: "数字化资产闭环",
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
