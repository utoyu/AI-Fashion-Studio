"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

const navLinks = [
  { label: "AI全能摄影室", href: "/dashboard/photo-studio" },
  { label: "素材库", href: "/dashboard/assets" },
  { label: "AI模特定制", href: "/dashboard/custom-model" },
  { label: "电商组图", href: "/dashboard/koc-content" },
  { label: "一键精修", href: "/dashboard/one-click-retouch" },
  { label: "手搓精修", href: "/dashboard/manual-retouch" },
]

export function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display text-xl font-bold text-foreground">
            ModeAI
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
            登录
          </Button>
          <Link href="/dashboard/photo-studio">
            <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
              免费体验
            </Button>
          </Link>
        </div>

        <button
          className="md:hidden text-foreground"
          onClick={() => setOpen(!open)}
          aria-label={open ? "关闭菜单" : "打开菜单"}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-border bg-background/95 backdrop-blur-xl md:hidden">
          <div className="flex flex-col gap-1 px-6 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-3 flex flex-col gap-2">
              <Button variant="ghost" size="sm" className="justify-start text-muted-foreground">
                登录
              </Button>
              <Link href="/dashboard/photo-studio">
                <Button size="sm" className="w-full bg-primary text-primary-foreground">
                  免费体验
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
