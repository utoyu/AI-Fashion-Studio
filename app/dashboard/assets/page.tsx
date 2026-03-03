"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Upload,
    Search,
    Filter,
    Grid,
    List,
    Plus,
    Shirt,
    Users,
    Image as ImageIcon,
    X,
    Download,
    ZoomIn,
    ZoomOut,
    RotateCcw,
    RotateCw,
    ChevronLeft,
    ChevronRight,
} from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"

const tabs = [
    { id: "garment", label: "衣物素材", icon: Shirt },
    { id: "model", label: "模特库", icon: Users },
    { id: "background", label: "场景背景", icon: ImageIcon },
]

// Mock data mapped to types
const initialAssets = [
    { id: "M001-GRM", type: "garment", src: "/images/assets/suit.png", title: "高定深灰男士西装 (平铺)", description: "高支羊毛免烫面料，展现质感的深灰平铺。" },
    { id: "M002-GRM", type: "garment", src: "/images/assets/shirt.png", title: "雅致白衬衫与真丝领带", description: "全棉抗皱白衬衫搭配高质感藏青色真丝领带。" },
    { id: "M003-MDL", type: "model", src: "/images/assets/model-asian.png", title: "亚洲成熟商务男性风格", description: "30-40岁亚洲精英模特，展现稳重专业的商务气质。" },
    { id: "M004-MDL", type: "model", src: "/images/assets/model-western.png", title: "欧美高冷国际街拍模特", description: "冷峻立体的面部轮廓，完美驾驭街头及时尚风潮。" },
    { id: "M005-BGD", type: "background", src: "/images/assets/bg-office.png", title: "奢华现代高层办公室", description: "带城市天际线背景的甲级写字楼内景场景。" },
    { id: "M006-BGD", type: "background", src: "/images/assets/bg-studio.png", title: "极简高级纯色棚拍背景", description: "用于突出服装剪裁和面料质感的专业灰色影棚。" },
]

export default function AssetsPage() {
    const [activeTab, setActiveTab] = useState("model")
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
    const [searchQuery, setSearchQuery] = useState("")
    const [assets, setAssets] = useState(initialAssets)
    const [editingAsset, setEditingAsset] = useState<any>(null)
    const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null)
    const [zoom, setZoom] = useState(100)
    const [rotation, setRotation] = useState(0)
    const [pan, setPan] = useState({ x: 0, y: 0 })
    const [isDragging, setIsDragging] = useState(false)
    const dragStart = useRef({ x: 0, y: 0 })
    const fileInputRef = useRef<HTMLInputElement>(null)
    const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

    const filteredAssets = assets.filter(a => a.type === activeTab && a.title.toLowerCase().includes(searchQuery.toLowerCase()))

    const handleUploadClick = () => {
        fileInputRef.current?.click()
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || [])
        if (files.length > 0) {
            const newAssets = files.map(file => {
                const isGarment = activeTab === "garment"
                const isBg = activeTab === "background"
                const prefix = isGarment ? "GRM" : (isBg ? "BGD" : "MDL")
                const newId = `M${Math.floor(100 + Math.random() * 900)}-${prefix}`

                return {
                    id: newId,
                    type: activeTab,
                    src: URL.createObjectURL(file), // Generate local preview URL
                    title: file.name,
                    description: "双击编辑完善资产信息..."
                }
            })

            setAssets(prev => [...newAssets, ...prev])

            // Clear input so the same file could be selected again if needed
            e.target.value = ''
        }
    }

    return (
        <div className="flex flex-col h-full overflow-hidden bg-background">
            {/* Hidden File Input for trigger */}
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                multiple
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
            />

            {/* Header section with Title and main Upload Button */}
            <div className="flex h-20 shrink-0 items-center justify-between border-b border-border px-8 bg-white z-10 w-full">
                <div>
                    <h1 className="font-display text-2xl font-bold text-foreground tracking-tight">素材库</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        管理您的服装素材、模特和生成背景
                    </p>
                </div>
                <Button
                    onClick={handleUploadClick}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-md px-6 shadow-sm flex items-center gap-2"
                >
                    <Upload className="w-4 h-4" />
                    上传素材
                </Button>
            </div>

            {/* Tabs Menu */}
            <div className="flex-none px-8 pb-4 border-b border-border/50">
                <div className="flex items-center gap-2">
                    {tabs.map((tab) => {
                        const isActive = activeTab === tab.id
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={cn(
                                    "flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-medium transition-all duration-200",
                                    isActive
                                        ? "bg-transparent border-b-2 border-primary text-primary" // Highlighting exact styling as per image
                                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                                )}
                                style={{
                                    borderBottomWidth: isActive ? "2px" : "0",
                                    borderBottomColor: isActive ? "hsl(var(--primary))" : "transparent",
                                    borderRadius: isActive ? "0" : "0.375rem" // Flat bottom when active underscore
                                }}
                            >
                                <tab.icon className={cn("w-4 h-4", isActive ? "text-primary" : "text-muted-foreground")} />
                                {tab.label}
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* Toolbar: Search, Filters, and View modes */}
            <div className="flex-none px-8 py-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            className="w-[300px] pl-9 h-10 bg-card border-border/60 focus-visible:ring-1 focus-visible:ring-primary/50 text-sm shadow-sm rounded-md"
                            placeholder="搜索素材名称..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Button variant="outline" size="icon" className="h-10 w-10 text-muted-foreground border-border/60 shadow-sm rounded-md hover:bg-secondary">
                        <Filter className="w-4 h-4" />
                    </Button>
                </div>

                <div className="flex items-center bg-secondary/50 p-1 rounded-md border border-border/60">
                    <button
                        onClick={() => setViewMode("grid")}
                        className={cn(
                            "p-1.5 rounded-sm transition-colors",
                            viewMode === "grid" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                        )}
                    >
                        <Grid className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => setViewMode("list")}
                        className={cn(
                            "p-1.5 rounded-sm transition-colors",
                            viewMode === "list" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                        )}
                    >
                        <List className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Main Grid View */}
            <div className="flex-1 overflow-y-auto px-8 pb-8 hide-scrollbar">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">

                    {/* Add New Asset Card */}
                    <button
                        onClick={handleUploadClick}
                        className="group flex flex-col items-center justify-center aspect-[3/4] rounded-2xl border-2 border-dashed border-border/60 bg-transparent hover:border-primary/40 hover:bg-primary/5 transition-all duration-200"
                    >
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-secondary text-primary group-hover:bg-primary/10 transition-colors mb-3">
                            <Plus className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">
                            添加新素材
                        </span>
                    </button>

                    {/* Render Mock Assets dynamically based on Selected Tab & Search Query */}
                    {filteredAssets.map((asset, index) => (
                        <div
                            key={asset.id}
                            onClick={() => {
                                if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current)
                                clickTimeoutRef.current = setTimeout(() => {
                                    setSelectedImageIndex(index)
                                    setZoom(100)
                                    setRotation(0)
                                    setPan({ x: 0, y: 0 })
                                }, 250)
                            }}
                            onDoubleClick={(e) => {
                                e.stopPropagation()
                                if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current)
                                setEditingAsset({ ...asset })
                            }}
                            className="group relative aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer shadow-sm border border-border/40"
                        >
                            <Image
                                src={asset.src}
                                alt={asset.title}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            {/* Hover Overlay with ID and Description */}
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-end p-4">
                                <span className="absolute top-3 right-3 bg-black/50 text-white/90 px-2 py-1 rounded-md text-[10px] font-medium backdrop-blur-sm pointer-events-none">双击编辑</span>
                                <span className="text-white/60 font-mono text-[10px] mb-1 leading-none">ID: {asset.id}</span>
                                <p className="text-white font-medium text-sm line-clamp-1">{asset.title}</p>
                                <p className="text-white/80 text-[11px] mt-1 line-clamp-2 leading-snug">{asset.description}</p>
                            </div>
                        </div>
                    ))}

                </div>
            </div>

            {/* Edit Asset Modal Overlay */}
            {editingAsset && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-background border border-border rounded-xl p-6 w-[480px] max-w-[90vw] shadow-2xl animate-in zoom-in-95 duration-200">
                        <h2 className="text-lg font-bold mb-4 font-display text-foreground">编辑素材信息</h2>

                        <div className="flex gap-4 mb-5">
                            <div className="relative w-28 h-[149px] rounded-lg overflow-hidden border border-border/50 shrink-0 bg-secondary/30">
                                <Image src={editingAsset.src} alt={editingAsset.title} fill className="object-cover" />
                            </div>
                            <div className="flex-1 space-y-4">
                                <div>
                                    <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">唯一识别 ID</label>
                                    <Input value={editingAsset.id} disabled className="bg-secondary/50 h-9 font-mono text-xs text-muted-foreground" />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">素材标题</label>
                                    <Input
                                        value={editingAsset.title}
                                        onChange={e => setEditingAsset({ ...editingAsset, title: e.target.value })}
                                        className="h-9 focus-visible:ring-primary/50"
                                        placeholder="请输入易于搜索的名称"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">素材详情描述</label>
                            <textarea
                                value={editingAsset.description}
                                onChange={e => setEditingAsset({ ...editingAsset, description: e.target.value })}
                                placeholder="输入更详细的素材特征，用于AI推荐和检索..."
                                className="w-full text-sm rounded-md border border-input bg-background px-3 py-2 text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/50 resize-none h-24"
                            />
                        </div>

                        <div className="flex items-center justify-between mt-6 pt-2">
                            {showDeleteConfirm ? (
                                <div className="flex items-center gap-2 animate-in slide-in-from-left-2 duration-200">
                                    <span className="text-sm font-medium text-red-500 mr-2">确定要永久删除吗？</span>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-8 border-border/60 text-xs"
                                        onClick={() => setShowDeleteConfirm(false)}
                                    >
                                        取消
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        className="h-8 text-xs bg-red-500 hover:bg-red-600 shadow-none font-medium"
                                        onClick={() => {
                                            setAssets(prev => prev.filter(a => a.id !== editingAsset.id))
                                            setEditingAsset(null)
                                            setShowDeleteConfirm(false)
                                        }}
                                    >
                                        确认删除
                                    </Button>
                                </div>
                            ) : (
                                <Button
                                    variant="destructive"
                                    className="bg-red-500/10 hover:bg-red-500/20 text-red-600 border border-red-500/20 shadow-none transition-colors"
                                    onClick={() => setShowDeleteConfirm(true)}
                                >
                                    删除素材
                                </Button>
                            )}

                            {!showDeleteConfirm && (
                                <div className="flex items-center gap-3">
                                    <Button variant="outline" className="border-border/60" onClick={() => { setEditingAsset(null); setShowDeleteConfirm(false); }}>取消</Button>
                                    <Button className="bg-primary hover:bg-primary/90 px-6 font-medium" onClick={() => {
                                        setAssets(prev => prev.map(a => a.id === editingAsset.id ? editingAsset : a))
                                        setEditingAsset(null)
                                        setShowDeleteConfirm(false)
                                    }}>保存修改</Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Lightbox Overlay */}
            {selectedImageIndex !== null && filteredAssets[selectedImageIndex] && (
                <div className="fixed inset-0 z-[100] flex flex-col bg-zinc-950/95 backdrop-blur-xl animate-in fade-in duration-200">
                    {/* Lightbox Header */}
                    <div className="flex-none h-14 flex items-center justify-between px-6 text-white/80">
                        <div className="flex items-center gap-4 text-sm font-medium">
                            <span className="tabular-nums">{selectedImageIndex + 1} / {filteredAssets.length}</span>
                            <span className="text-white/40">|</span>
                            <span>{filteredAssets[selectedImageIndex].title}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <button className="h-9 w-9 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                                <Download className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setSelectedImageIndex(null)}
                                className="h-9 w-9 flex items-center justify-center rounded-lg bg-red-500/80 hover:bg-red-500 transition-colors text-white"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Lightbox Main Image Area */}
                    <div
                        className="flex-1 relative flex items-center justify-center overflow-hidden"
                        onClick={() => setSelectedImageIndex(null)}
                        onWheel={(e) => {
                            // Adjust zoom based on scroll direction (+10% or -10%)
                            if (e.deltaY < 0) {
                                setZoom(prev => Math.min(300, prev + 10))
                            } else {
                                setZoom(prev => Math.max(10, prev - 10))
                            }
                        }}
                    >
                        {selectedImageIndex > 0 && (
                            <button
                                onClick={(e) => { e.stopPropagation(); setSelectedImageIndex(selectedImageIndex - 1); setZoom(100); setRotation(0); setPan({ x: 0, y: 0 }); }}
                                className="absolute left-6 z-10 w-12 h-12 flex items-center justify-center rounded-full bg-black/50 text-white/70 hover:text-white hover:bg-black/80 transition-all border border-white/10"
                            >
                                <ChevronLeft className="w-6 h-6 -ml-0.5" />
                            </button>
                        )}

                        <div
                            className={cn(
                                "relative",
                                isDragging ? "cursor-grabbing" : "cursor-grab transition-transform duration-200 ease-out"
                            )}
                            style={{
                                transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom / 100}) rotate(${rotation}deg)`,
                                width: '60vw',
                                height: '70vh'
                            }}
                            onPointerDown={(e) => {
                                setIsDragging(true)
                                dragStart.current = { x: e.clientX - pan.x, y: e.clientY - pan.y }
                                e.currentTarget.setPointerCapture(e.pointerId)
                            }}
                            onPointerMove={(e) => {
                                if (!isDragging) return
                                setPan({
                                    x: e.clientX - dragStart.current.x,
                                    y: e.clientY - dragStart.current.y
                                })
                            }}
                            onPointerUp={(e) => {
                                setIsDragging(false)
                                e.currentTarget.releasePointerCapture(e.pointerId)
                            }}
                            onPointerCancel={(e) => {
                                setIsDragging(false)
                                e.currentTarget.releasePointerCapture(e.pointerId)
                            }}
                            onDragStart={(e) => e.preventDefault()}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Image
                                src={filteredAssets[selectedImageIndex].src}
                                alt={filteredAssets[selectedImageIndex].title}
                                fill
                                className="object-contain"
                                priority
                                draggable={false}
                            />
                        </div>

                        {selectedImageIndex < filteredAssets.length - 1 && (
                            <button
                                onClick={(e) => { e.stopPropagation(); setSelectedImageIndex(selectedImageIndex - 1); setZoom(100); setRotation(0); setPan({ x: 0, y: 0 }); }}
                                className="absolute right-6 z-10 w-12 h-12 flex items-center justify-center rounded-full bg-black/50 text-white/70 hover:text-white hover:bg-black/80 transition-all border border-white/10"
                            >
                                <ChevronRight className="w-6 h-6 ml-0.5" />
                            </button>
                        )}
                    </div>

                    {/* Lightbox Toolbar */}
                    <div className="absolute bottom-28 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-black/60 border border-white/10 backdrop-blur-md p-1.5 rounded-xl text-white">
                        <button onClick={() => setZoom(Math.max(10, zoom - 20))} className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-white/20 transition-colors"><ZoomOut className="w-4 h-4" /></button>
                        <span className="text-xs font-mono w-14 text-center select-none">{zoom}%</span>
                        <button onClick={() => setZoom(Math.min(300, zoom + 20))} className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-white/20 transition-colors"><ZoomIn className="w-4 h-4" /></button>
                        <div className="w-px h-4 bg-white/20 mx-1" />
                        <button onClick={() => { setZoom(100); setRotation(0); setPan({ x: 0, y: 0 }); }} className="px-3 h-9 text-xs font-medium rounded-lg hover:bg-white/20 transition-colors">重置</button>
                        <div className="w-px h-4 bg-white/20 mx-1" />
                        <button onClick={() => setRotation(rotation - 90)} className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-white/20 transition-colors"><RotateCcw className="w-4 h-4" /></button>
                        <button onClick={() => setRotation(rotation + 90)} className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-white/20 transition-colors"><RotateCw className="w-4 h-4" /></button>
                    </div>

                    {/* Lightbox Thumbnails */}
                    <div className="flex-none h-24 bg-black/40 border-t border-white/5 flex items-center justify-center px-6 overflow-x-auto hide-scrollbar">
                        <div className="flex gap-3 min-w-max px-4">
                            {filteredAssets.map((asset, index) => (
                                <button
                                    key={asset.id}
                                    onClick={() => { setSelectedImageIndex(index); setZoom(100); setRotation(0); setPan({ x: 0, y: 0 }); }}
                                    className={cn(
                                        "relative h-16 w-16 shrink-0 rounded-lg overflow-hidden transition-all duration-200 opacity-60 hover:opacity-100",
                                        selectedImageIndex === index ? "opacity-100 ring-2 ring-primary ring-offset-2 ring-offset-zinc-950 scale-110" : ""
                                    )}
                                >
                                    <Image src={asset.src} alt={asset.title} fill className="object-cover" />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
