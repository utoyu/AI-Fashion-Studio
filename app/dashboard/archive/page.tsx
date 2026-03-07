"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
    Archive,
    Smartphone,
    Zap,
    Info,
    ChevronLeft
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"

const platformSizes = [
    { id: "taobao", label: "淘宝 Tmall", size: "800 x 800 px" },
    { id: "xhs", label: "小红书 XHS", size: "1080 x 1440 px" },
    { id: "dy", label: "抖音/TikTok", size: "1080 x 1920 px" },
    { id: "pdd", label: "拼多多", size: "750 x 750 px" },
    { id: "manual", label: "手动定义", size: "Custom Ratio" },
]

const expandTags = [
    { label: "延伸背景", value: "extended background" },
    { label: "无缝融合", value: "seamless blending" },
    { label: "摄影棚光效", value: "studio lighting" },
    { label: "极简空间", value: "minimalist room" },
    { label: "自然溢出", value: "natural surroundings" },
    { label: "高清补全", value: "high fidelity detail" },
]

export default function ArchivePage() {
    const router = useRouter()
    const [selectedPlatform, setSelectedPlatform] = useState("taobao")
    const [expandAiEnabled, setExpandAiEnabled] = useState(true)

    return (
        <div className="flex h-screen flex-col bg-slate-50 overflow-hidden">
            <header className="flex h-20 shrink-0 items-center justify-between border-b border-border pl-8 pr-[400px] bg-white z-20">
                <div className="flex flex-col">
                    <h1 className="font-display text-2xl font-bold text-foreground tracking-tight flex items-center gap-2">
                        存档中心 <span className="text-primary/40 font-light">|</span> <span className="text-[13px] font-medium text-slate-400 mt-1 uppercase tracking-widest">Archive Center</span>
                    </h1>
                    <p className="text-[12px] text-muted-foreground mt-0.5">存放下线功能、实验性特性或暂时不用的 UI 区域</p>
                </div>
                <Button variant="ghost" onClick={() => router.back()} className="gap-2 text-slate-500">
                    <ChevronLeft className="w-4 h-4" /> 返回
                </Button>
            </header>

            <main className="flex-1 p-8 overflow-y-auto custom-scrollbar">
                <div className="max-w-4xl mx-auto space-y-8">

                    <div className="flex items-center gap-3 p-4 rounded-2xl bg-amber-50 border border-amber-100 mb-8">
                        <Info className="w-5 h-5 text-amber-500" />
                        <p className="text-sm text-amber-800 font-medium">这里的组件已从主功能流程中下线，仅供参考或在未来需要时重新启用。</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Archived Section: Platforms */}
                        <section className="bg-white p-6 rounded-[24px] border border-slate-200 shadow-sm space-y-6">
                            <div className="flex items-center gap-2">
                                <div className="h-5 w-5 rounded-md bg-primary/10 flex items-center justify-center">
                                    <Smartphone className="w-3 h-3 text-primary" />
                                </div>
                                <h3 className="text-sm font-bold text-slate-800">平台规范 (Platform)</h3>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {platformSizes.map(p => (
                                    <button
                                        key={p.id}
                                        onClick={() => setSelectedPlatform(p.id)}
                                        className={cn(
                                            "px-3 py-2 rounded-lg border text-[11px] font-bold transition-all",
                                            selectedPlatform === p.id ? "bg-primary text-white border-primary shadow-sm" : "bg-white text-slate-500 border-slate-100 hover:border-slate-200"
                                        )}
                                    >
                                        {p.label}
                                    </button>
                                ))}
                            </div>
                            <p className="text-xs text-slate-400 italic">该组件原用于“图片中心”的平台尺寸快捷选择。</p>
                        </section>

                        {/* Archived Section: Generative Lab */}
                        <section className="bg-white p-6 rounded-[24px] border border-slate-200 shadow-sm space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="h-5 w-5 rounded-md bg-primary/10 flex items-center justify-center">
                                        <Zap className="w-3 h-3 text-primary" />
                                    </div>
                                    <h3 className="text-sm font-bold text-slate-800">补全实验室 (Lab)</h3>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] text-slate-400 font-bold">AI填充</span>
                                    <Switch checked={expandAiEnabled} onCheckedChange={setExpandAiEnabled} className="scale-75" />
                                </div>
                            </div>
                            <div className="p-4 rounded-xl border border-primary/5 bg-primary/[0.01] space-y-3">
                                <div className="flex flex-wrap gap-2">
                                    {expandTags.map(tag => (
                                        <button
                                            key={tag.value}
                                            className="px-2 py-1 rounded bg-white border border-slate-100 text-[10px] text-slate-500 hover:border-primary hover:text-primary transition-all shadow-sm"
                                        >
                                            + {tag.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <p className="text-xs text-slate-400 italic">该组件原用于“智能扩页”模式下的快捷标签输入。</p>
                        </section>
                        {/* Archived Section: Smart Retouch */}
                        <section className="bg-white p-6 rounded-[24px] border border-slate-200 shadow-sm space-y-6">
                            <div className="flex items-center gap-2">
                                <div className="h-5 w-5 rounded-md bg-primary/10 flex items-center justify-center">
                                    <Zap className="w-3 h-3 text-primary" />
                                </div>
                                <h3 className="text-sm font-bold text-slate-800">智能精修 (Smart Retouch)</h3>
                            </div>
                            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 space-y-3">
                                <p className="text-[11px] font-bold text-slate-600">历史精修模组：</p>
                                <div className="flex flex-wrap gap-2">
                                    {["大师级增强", "全自动除皱", "质感提升", "轮廓雕刻", "景深调节", "4K放大"].map(m => (
                                        <span key={m} className="px-2 py-1 bg-white border border-slate-100 rounded text-[10px] text-slate-400">
                                            {m}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <p className="text-xs text-slate-400 italic">该完整独立页面已于 v2.1 版本下线，由更精简的“一键精修”取代。</p>
                        </section>
                    </div>

                    <div className="mt-12 pt-12 border-t border-slate-100 flex flex-col items-center text-center">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                            <Archive className="w-8 h-8 text-slate-300" />
                        </div>
                        <h3 className="text-slate-800 font-bold">暂无更多存档</h3>
                        <p className="text-slate-400 text-sm mt-1 max-w-xs">随着系统的迭代，我们会将更多迭代下线的功能放入此处。</p>
                    </div>
                </div>
            </main>
        </div>
    )
}
