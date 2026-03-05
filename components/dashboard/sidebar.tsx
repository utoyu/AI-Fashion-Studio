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
  Image as ImageIcon,
  Camera,
  Settings,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  LayoutGrid
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"

interface NavItem {
  icon: any
  label: string
  href: string
  badge?: string
}

const navItems: NavItem[] = [
  { icon: Home, label: "首页", href: "/" },
  { icon: Camera, label: "AI全能摄影室", href: "/dashboard/photo-studio" },
  { icon: ImageIcon, label: "素材库", href: "/dashboard/assets" },
  { icon: Sparkles, label: "AI模特定制", href: "/dashboard/custom-model" },
  { icon: Wand2, label: "智能精修", href: "/dashboard/smart-retouch" },
  { icon: Expand, label: "图片工具", href: "/dashboard/image-tools" },
  { icon: LayoutGrid, label: "电商组图", href: "/dashboard/koc-content" },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={cn(
        "relative flex h-screen flex-col border-r border-border bg-card transition-all duration-300",
        collapsed ? "w-[64px]" : "w-[100px]"
      )}
    >
      {/* Logo */}
      <div className="flex h-20 shrink-0 items-center flex-col justify-center gap-1 border-b border-border py-2">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary">
          <Sparkles className="h-4 w-4 text-primary-foreground" />
        </div>
        {!collapsed && (
          <span className="font-display text-[11px] font-bold text-foreground leading-none">ModeAI</span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-2 py-4 hide-scrollbar">
        <div className="flex flex-col gap-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href.split("#")[0]))
            return (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "group relative flex flex-col items-center justify-center gap-1.5 rounded-lg py-3 px-1 text-xs font-medium transition-all duration-200",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
                title={collapsed ? item.label : undefined}
              >
                <item.icon className={cn("h-5 w-5 shrink-0", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                {!collapsed && (
                  <span className="text-center text-[11px] leading-tight break-keep">{item.label}</span>
                )}
                {!collapsed && item.badge && (
                  <span className="absolute right-1 top-1 rounded-full bg-primary/20 px-1 py-0.5 text-[8px] font-semibold text-primary">
                    {item.badge}
                  </span>
                )}
              </Link>
            )
          })}
        </div>
      </nav>

      <div className="border-t border-border mt-auto"></div>

      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:text-foreground z-10"
        aria-label={collapsed ? "展开侧边栏" : "折叠侧边栏"}
      >
        {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
      </button>
    </aside>
  )
}
