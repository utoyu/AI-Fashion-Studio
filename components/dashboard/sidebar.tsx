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
  LayoutGrid,
  ChevronDown,
  Wrench,
  Archive,
  MousePointer2,
  Hand
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"

interface NavItem {
  icon: any
  label: string
  href?: string
  badge?: string
  subItems?: { label: string; href: string; icon?: any }[]
}

const navItems: NavItem[] = [
  { icon: Home, label: "首页", href: "/" },
  { icon: Camera, label: "AI全能摄影室", href: "/dashboard/photo-studio" },
  { icon: ImageIcon, label: "素材库", href: "/dashboard/assets" },
  { icon: Sparkles, label: "AI模特定制", href: "/dashboard/custom-model" },
  { icon: LayoutGrid, label: "电商组图", href: "/dashboard/koc-content" },
  {
    icon: Wrench,
    label: "快捷工具",
    subItems: [
      { icon: MousePointer2, label: "一键精修", href: "/dashboard/one-click-retouch" },
      { icon: Hand, label: "手搓精修", href: "/dashboard/manual-retouch" },
    ]
  },
  { icon: Archive, label: "存档中心", href: "/dashboard/archive" },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [expandedMenu, setExpandedMenu] = useState<string | null>("快捷工具")

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
            const isSubItemActive = item.subItems?.some(s => pathname === s.href)
            const isActive = item.href ? (pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href.split("#")[0]))) : isSubItemActive

            if (item.subItems) {
              return (
                <div key={item.label} className="flex flex-col gap-1">
                  <button
                    onClick={() => {
                      if (collapsed) {
                        setCollapsed(false)
                        setExpandedMenu(item.label)
                      } else {
                        setExpandedMenu(expandedMenu === item.label ? null : item.label)
                      }
                    }}
                    className={cn(
                      "group relative flex flex-col items-center justify-center gap-1.5 rounded-lg py-3 px-1 text-xs font-medium transition-all duration-200 cursor-pointer",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    )}
                    title={collapsed ? item.label : undefined}
                  >
                    <item.icon className={cn("h-5 w-5 shrink-0", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                    {!collapsed && (
                      <span className="text-center text-[11px] leading-tight break-keep flex items-center justify-center gap-0.5">
                        {item.label}
                        <ChevronDown className={cn("w-3 h-3 transition-transform", expandedMenu === item.label ? "rotate-180" : "")} />
                      </span>
                    )}
                  </button>
                  {expandedMenu === item.label && !collapsed && (
                    <div className="flex flex-col gap-1 bg-secondary/30 rounded-lg p-1.5 mx-1">
                      {item.subItems.map(subItem => {
                        const isSubActive = pathname === subItem.href
                        return (
                          <Link
                            key={subItem.label}
                            href={subItem.href}
                            className={cn(
                              "flex flex-col items-center justify-center gap-1.5 rounded-md py-2.5 px-1 text-[10px] font-medium transition-all",
                              isSubActive ? "bg-background text-primary shadow-sm" : "text-muted-foreground hover:bg-background/50 hover:text-foreground"
                            )}
                          >
                            {subItem.icon && <subItem.icon className={cn("h-4 w-4 shrink-0", isSubActive ? "text-primary" : "")} />}
                            <span className="text-center leading-tight">{subItem.label}</span>
                          </Link>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            }

            return (
              <Link
                key={item.label}
                href={item.href!}
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
