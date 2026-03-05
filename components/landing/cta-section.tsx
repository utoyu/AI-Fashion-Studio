"use client"

import Link from "next/link"
import { ArrowRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CTASection() {
  return (
    <section className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-card to-card p-12 md:p-20">
          {/* Glow */}
          <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />

          <div className="relative flex flex-col items-center text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/20">
              <Sparkles className="h-7 w-7 text-primary" />
            </div>
            <h2 className="font-display mt-6 max-w-2xl text-3xl font-bold text-foreground md:text-5xl text-balance">
              开启AI电商视觉新时代
            </h2>
            <p className="mt-4 max-w-xl text-lg text-muted-foreground">
              每天免费生成10张图片，无需信用卡，立即体验AI的力量
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link href="/dashboard/photo-studio">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 px-8 h-12 text-base">
                  立即开启创作
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
