"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import {
    Download,
    X,
    ChevronLeft,
    ChevronRight,
    ZoomIn,
    ZoomOut,
    RotateCcw,
    RotateCw
} from "lucide-react"

export interface LightboxImage {
    id: string | number
    src: string
    title?: string
}

interface ImageLightboxProps {
    images: LightboxImage[]
    initialIndex: number
    onClose: () => void
}

export function ImageLightbox({ images, initialIndex, onClose }: ImageLightboxProps) {
    const [currentIndex, setCurrentIndex] = useState(initialIndex)
    const [zoom, setZoom] = useState(100)
    const [rotation, setRotation] = useState(0)
    const [pan, setPan] = useState({ x: 0, y: 0 })
    const [isDragging, setIsDragging] = useState(false)
    const dragStart = useRef({ x: 0, y: 0 })

    // Reset view when changing images
    useEffect(() => {
        setZoom(100)
        setRotation(0)
        setPan({ x: 0, y: 0 })
    }, [currentIndex])

    if (!images || images.length === 0 || currentIndex < 0 || currentIndex >= images.length) {
        return null
    }

    const currentImage = images[currentIndex]

    return (
        <div className="fixed inset-0 z-[100] flex flex-col bg-zinc-950/95 backdrop-blur-xl animate-in fade-in duration-200">
            {/* Lightbox Header */}
            <div className="flex-none h-14 flex items-center justify-between px-6 text-white/80">
                <div className="flex items-center gap-4 text-sm font-medium">
                    <span className="tabular-nums">{currentIndex + 1} / {images.length}</span>
                    <span className="text-white/40">|</span>
                    <span>{currentImage.title || "Image Preview"}</span>
                </div>
                <div className="flex items-center gap-3">
                    <button className="h-9 w-9 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                        <Download className="w-4 h-4" />
                    </button>
                    <button
                        onClick={onClose}
                        className="h-9 w-9 flex items-center justify-center rounded-lg bg-red-500/80 hover:bg-red-500 transition-colors text-white"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Lightbox Main Image Area */}
            <div
                className="flex-1 relative flex items-center justify-center overflow-hidden"
                onClick={onClose}
                onWheel={(e) => {
                    if (e.deltaY < 0) {
                        setZoom(prev => Math.min(300, prev + 10))
                    } else {
                        setZoom(prev => Math.max(10, prev - 10))
                    }
                }}
            >
                {currentIndex > 0 && (
                    <button
                        onClick={(e) => { e.stopPropagation(); setCurrentIndex(currentIndex - 1); }}
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
                        src={currentImage.src}
                        alt={currentImage.title || `Image ${currentIndex + 1}`}
                        fill
                        className="object-contain"
                        priority
                        draggable={false}
                    />
                </div>

                {currentIndex < images.length - 1 && (
                    <button
                        onClick={(e) => { e.stopPropagation(); setCurrentIndex(currentIndex + 1); }}
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
                    {images.map((asset, index) => (
                        <button
                            key={asset.id}
                            onClick={() => setCurrentIndex(index)}
                            className={cn(
                                "relative h-16 w-16 shrink-0 rounded-lg overflow-hidden transition-all duration-200 opacity-60 hover:opacity-100",
                                currentIndex === index ? "opacity-100 ring-2 ring-primary ring-offset-2 ring-offset-zinc-950 scale-110" : ""
                            )}
                        >
                            <Image src={asset.src} alt={asset.title || `Thumbnail ${index + 1}`} fill className="object-cover" />
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}
