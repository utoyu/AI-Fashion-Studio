import Link from "next/link"
import { Sparkles } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/50">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Sparkles className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-display text-lg font-bold text-foreground">ModeAI</span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              AI驱动的电商视觉解决方案，让每一件商品都拥有专业模特图。
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-foreground">核心功能</h4>
            <ul className="mt-4 flex flex-col gap-2">
              {["AI模特图", "智能精修", "图片扩充", "图片拼接"].map((item) => (
                <li key={item}>
                  <span className="text-sm text-muted-foreground transition-colors hover:text-foreground cursor-pointer">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-foreground">更多服务</h4>
            <ul className="mt-4 flex flex-col gap-2">
              {["定制模特", "KOC种草", "场景视频", "API接入"].map((item) => (
                <li key={item}>
                  <span className="text-sm text-muted-foreground transition-colors hover:text-foreground cursor-pointer">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-foreground">关于我们</h4>
            <ul className="mt-4 flex flex-col gap-2">
              {["帮助中心", "定价方案", "联系我们", "隐私政策"].map((item) => (
                <li key={item}>
                  <span className="text-sm text-muted-foreground transition-colors hover:text-foreground cursor-pointer">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-8">
          <p className="text-center text-sm text-muted-foreground">
            &copy; 2026 ModeAI. All rights reserved. 
          </p>
        </div>
      </div>
    </footer>
  )
}
