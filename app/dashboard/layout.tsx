"use client"

import Link from "next/link"
import { CreditCard, Settings } from "lucide-react"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { ThemeToggle } from "@/components/ThemeToggle"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen overflow-hidden relative">
      <DashboardSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="fixed top-4 right-6 z-50 flex items-center gap-3">

          {/* Plan & Settings */}
          <div className="flex items-center gap-1 p-1 rounded-full bg-white backdrop-blur-md shadow-[0_4px_12px_rgba(0,0,0,0.08)] border border-slate-200/60">
            <Link href="#" className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-slate-100/80 transition-colors text-slate-600">
              <CreditCard className="w-4 h-4" />
              <span className="text-[12px] font-medium">套餐管理</span>
            </Link>
            <div className="w-[1px] h-3 bg-slate-200" />
            <Link href="#" className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-slate-100/80 transition-colors text-slate-600">
              <Settings className="w-4 h-4" />
            </Link>
          </div>

          {/* Theme Toggle Wrapper */}
          <div className="flex items-center bg-white backdrop-blur-md shadow-[0_4px_12px_rgba(0,0,0,0.08)] rounded-2xl border border-slate-200/60 p-0.5">
            <ThemeToggle />
          </div>

          {/* Quota */}
          <div className="flex items-center px-4 py-2 rounded-full bg-white backdrop-blur-md shadow-[0_4px_12px_rgba(0,0,0,0.08)] border border-slate-200/60">
            <div className="flex flex-col items-end">
              <span className="text-[9px] text-slate-500 font-medium leading-none mb-1.5">可用额度</span>
              <div className="flex flex-row-reverse items-center gap-1.5">
                <div className="h-1.5 w-12 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full w-[30%] rounded-full bg-primary" />
                </div>
                <span className="font-bold text-slate-700 text-[11px] leading-none">3/10</span>
              </div>
            </div>
          </div>

        </div>
        {children}
      </main>
    </div>
  )
}
