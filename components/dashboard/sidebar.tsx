"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Sparkles,
  Users,
  Wand2,
  Layers,
  Expand,
  Heart,
  Home,
  Settings,
  CreditCard,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"

const navItems = [
  { icon: Home, label: "首页", href: "/" },
  { icon: Users, label: "AI模特图", href: "/dashboard/model-generation", badge: "热门" },
  { icon: Wand2, label: "智能精修", href: "/dashboard/smart-retouch" },
  { icon: Expand, label: "图片扩充", href: "/dashboard/image-tools" },
  { icon: Layers, label: "图片拼接", href: "/dashboard/image-tools#splice" },
  { icon: Sparkles, label: "定制模特", href: "/dashboard/custom-model" },
  { icon: Heart, label: "KOC种草", href: "/dashboard/koc-content" },
]

const bottomItems = [
  { icon: CreditCard, label: "套餐管理", href: "#" },
  { icon: Settings, label: "设置", href: "#" },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={cn(
        "relative flex h-screen flex-col border-r border-border bg-card transition-all duration-300",
        collapsed ? "w-[72px]" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 border-b border-border px-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary">
          <Sparkles className="h-5 w-5 text-primary-foreground" />
        </div>
        {!collapsed && (
          <span className="font-display text-lg font-bold text-foreground">ModeAI</span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <div className="flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href.split("#")[0]))
            return (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
                title={collapsed ? item.label : undefined}
              >
                <item.icon className={cn("h-5 w-5 shrink-0", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                {!collapsed && (
                  <>
                    <span className="flex-1">{item.label}</span>
                    {item.badge && (
                      <span className="rounded-full bg-primary/20 px-2 py-0.5 text-[10px] font-semibold text-primary">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Bottom Items */}
      <div className="border-t border-border px-3 py-4">
        <div className="flex flex-col gap-1">
          {bottomItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              title={collapsed ? item.label : undefined}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          ))}
        </div>

        {/* Usage Card */}
        {!collapsed && (
          <div className="mt-4 rounded-xl border border-border bg-secondary/50 p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">今日已用</span>
              <span className="font-semibold text-foreground">3 / 10</span>
            </div>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div className="h-full w-[30%] rounded-full bg-primary" />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">免费版每日10张，升级获取更多</p>
          </div>
        )}
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:text-foreground"
        aria-label={collapsed ? "展开侧边栏" : "折叠侧边栏"}
      >
        {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
      </button>
    </aside>
  )
}
