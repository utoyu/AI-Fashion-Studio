"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Upload, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-32">
      {/* Background grid */}
      <div className="bg-grid absolute inset-0 opacity-30" />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />

      {/* Glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 h-96 w-96 rounded-full bg-primary/10 blur-3xl animate-glow-pulse" />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="flex flex-col items-center text-center">
          {/* Badge */}
          <div className="mb-8 flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5">
            <Zap className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-medium text-primary">AI驱动 &middot; 秒级生成 &middot; 商用品质</span>
          </div>

          {/* Heading */}
          <h1 className="font-display max-w-4xl text-4xl font-bold tracking-tight text-foreground md:text-6xl lg:text-7xl text-balance">
            一张平铺图
            <br />
            <span className="text-primary">AI生成模特大片</span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
            上传商品平铺图，AI自动生成高质量模特图、卖点图、详情页、种草图。
            为电商卖家提供全链路视觉解决方案，提升转化率300%。
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link href="/dashboard/photo-studio">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 px-8 h-12 text-base">
                <Upload className="h-4 w-4" />
                立即开启创作
              </Button>
            </Link>
            <Link href="#features">
              <Button size="lg" variant="outline" className="gap-2 h-12 text-base border-border text-foreground hover:bg-secondary">
                了解更多
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-16">
            {[
              { value: "10万+", label: "日均生成图片" },
              { value: "3秒", label: "平均生成速度" },
              { value: "98%", label: "客户满意度" },
              { value: "50万+", label: "注册用户" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="font-display text-2xl font-bold text-primary md:text-3xl">{stat.value}</div>
                <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Hero Image */}
          <div className="mt-20 w-full max-w-5xl">
            <div className="glow-border relative overflow-hidden rounded-2xl border border-border bg-card">
              <Image
                src="/images/hero-male-menswear.png"
                alt="AI全能摄影室生成展示"
                width={1200}
                height={600}
                className="w-full"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
                <div className="rounded-full bg-background/80 px-4 py-2 backdrop-blur-sm">
                  <span className="text-sm font-medium text-foreground">商品平铺图</span>
                </div>
                <div className="flex items-center gap-2 text-primary">
                  <div className="h-px w-8 bg-primary md:w-16" />
                  <Zap className="h-5 w-5" />
                  <span className="text-sm font-bold">AI处理</span>
                  <div className="h-px w-8 bg-primary md:w-16" />
                </div>
                <div className="rounded-full bg-primary/90 px-4 py-2 backdrop-blur-sm">
                  <span className="text-sm font-medium text-primary-foreground">模特成片</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
