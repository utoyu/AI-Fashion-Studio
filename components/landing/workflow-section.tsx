"use client"

import { Upload, Cpu, Download, Rocket } from "lucide-react"

const steps = [
  {
    icon: Upload,
    step: "01",
    title: "上传商品图",
    description: "支持JPG、PNG格式，拖拽或点击上传商品平铺图片",
  },
  {
    icon: Cpu,
    step: "02",
    title: "AI智能处理",
    description: "AI自动识别商品类型，匹配最佳模特、场景与排版方案",
  },
  {
    icon: Download,
    step: "03",
    title: "生成结果",
    description: "3秒内生成高清模特图、卖点图、详情页等多种营销物料",
  },
  {
    icon: Rocket,
    step: "04",
    title: "一键发布",
    description: "直接导出适配淘宝、京东、抖音、小红书等各平台规格",
  },
]

export function WorkflowSection() {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/30 to-background" />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="text-center">
          <span className="text-sm font-medium uppercase tracking-widest text-primary">
            使用流程
          </span>
          <h2 className="font-display mt-4 text-3xl font-bold text-foreground md:text-5xl text-balance">
            四步完成，简单高效
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            从上传到出图，全程AI自动化处理
          </p>
        </div>

        <div className="mt-20 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((item, index) => (
            <div
              key={item.title}
              className="group relative flex flex-col items-center text-center"
            >
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="absolute top-10 left-[calc(50%+40px)] hidden h-px w-[calc(100%-80px)] bg-gradient-to-r from-primary/50 to-primary/10 lg:block" />
              )}

              {/* Icon */}
              <div className="relative mb-6">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-border bg-card transition-all duration-300 group-hover:border-primary/50 group-hover:glow-border">
                  <item.icon className="h-8 w-8 text-primary" />
                </div>
                <div className="absolute -top-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {item.step}
                </div>
              </div>

              <h3 className="font-display text-lg font-bold text-foreground">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
