"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { ArrowLeft, RefreshCw, Wand2, Download, Star, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ImageLightbox } from "@/components/ui/image-lightbox"

// Types for our archived images
interface ArchivedImage {
    id: string; // e.g. IMG-20260306-001
    creator: string;
    date: string;
    ratio: string;
    mainImg: string;
    sources: string[];
    prompt: string;
    sceneId?: string;
    modelId?: string;
    topId?: string;
    innerId?: string;
    bottomId?: string;
}

export default function RelatedImagesPage() {
    const params = useParams()
    const router = useRouter()
    const assetId = (Array.isArray(params.id) ? params.id[0] : params.id) as string || ""

    const [images, setImages] = useState<ArchivedImage[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [lightboxData, setLightboxData] = useState<{ itemIndex: number, imageIndex: number } | null>(null)

    useEffect(() => {
        // Fetch archived images from localStorage
        try {
            const stored = localStorage.getItem("archived_studio_images")
            if (stored) {
                const allImages: ArchivedImage[] = JSON.parse(stored)

                // Filter images that reference this assetId
                const related = allImages.filter(img =>
                    img.sceneId === assetId ||
                    img.modelId === assetId ||
                    img.topId === assetId ||
                    img.innerId === assetId ||
                    img.bottomId === assetId ||
                    // fallback check source paths if ID wasn't explicitly saved (for older mock data)
                    (img.sources && img.sources.some(src => assetId && src.includes(assetId)))
                )
                setImages(related)
            }
        } catch (e) {
            console.error("Failed to load archived images:", e)
        } finally {
            setIsLoading(false)
        }
    }, [assetId])

    const handleDelete = (imageId: string) => {
        if (!confirm("确定要取消收藏并从归档中移除该图片吗？")) return

        try {
            const stored = localStorage.getItem("archived_studio_images")
            if (stored) {
                const allImages: ArchivedImage[] = JSON.parse(stored)
                const updated = allImages.filter(img => img.id !== imageId)
                localStorage.setItem("archived_studio_images", JSON.stringify(updated))
                setImages(images.filter(img => img.id !== imageId))
            }
        } catch (e) {
            console.error("Failed to delete image:", e)
        }
    }

    // Convert to format required by ImageLightbox
    const lightboxImages = images.map(item => ({
        src: item.mainImg,
        title: `生成 ID: ${item.id}`,
        description: item.prompt
    }))

    return (
        <div className="flex flex-col h-full bg-slate-50">
            {/* Header */}
            <div className="h-16 flex items-center pl-8 pr-[400px] border-b bg-white shrink-0 sticky top-0 z-10">
                <button
                    onClick={() => router.back()}
                    className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-slate-100 transition-colors mr-4 group"
                >
                    <ArrowLeft className="w-5 h-5 text-slate-500 group-hover:text-slate-800 transition-colors" />
                </button>
                <div className="flex flex-col">
                    <h1 className="text-lg font-bold text-slate-800 leading-tight">关联大片归档库</h1>
                    <p className="text-xs text-slate-500 font-medium">素材 ID: <span className="font-mono text-primary">{assetId}</span></p>
                </div>

                <div className="ml-auto text-sm text-slate-500 font-medium">
                    共找到 <span className="text-primary font-bold">{images.length}</span> 张关联生成图
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                {isLoading ? (
                    <div className="flex h-full items-center justify-center">
                        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
                    </div>
                ) : images.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-[60vh] text-slate-400">
                        <div className="w-24 h-24 mb-6 rounded-full bg-slate-100 flex items-center justify-center border-2 border-dashed border-slate-200">
                            <Star className="w-10 h-10 text-slate-300" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-600 mb-2">暂无关联的归档图片</h3>
                        <p className="text-sm max-w-sm text-center">
                            前往「摄影室」使用该素材生成图片，点击收藏（星星图标）后即可在此处查看所有历史生成的大片。
                        </p>
                        <Button
                            className="mt-6 shadow-sm"
                            onClick={() => router.push('/dashboard/photo-studio')}
                        >
                            前往摄影室创作
                        </Button>
                    </div>
                ) : (
                    <div className="max-w-6xl mx-auto flex flex-col gap-10">
                        {images.map((item, idx) => (
                            <div key={item.id} className="flex gap-8 bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm relative group hover:border-primary/30 transition-all">
                                {/* Fixed Square Frame for Main Image */}
                                <button
                                    onClick={() => setLightboxData({ itemIndex: idx, imageIndex: 0 })}
                                    className="w-[240px] h-[240px] shrink-0 bg-slate-50 rounded-xl flex items-center justify-center p-2 border border-slate-100 shadow-[inset_0_2px_10px_rgba(0,0,0,0.02)] relative cursor-zoom-in"
                                >
                                    <div
                                        className="relative overflow-hidden rounded-lg w-full h-full shadow-sm bg-white flex items-center justify-center"
                                    >
                                        <div
                                            className="relative"
                                            style={{
                                                aspectRatio: item.ratio === '4:3' ? '4/3' :
                                                    item.ratio === '3:4' ? '3/4' :
                                                        item.ratio === '16:9' ? '16/9' :
                                                            item.ratio === '9:16' ? '9/16' :
                                                                '1/1',
                                                height: ['4:3', '16:9'].includes(item.ratio) ? 'auto' : '100%',
                                                width: ['4:3', '16:9'].includes(item.ratio) ? '100%' : 'auto',
                                                maxWidth: '100%',
                                                maxHeight: '100%'
                                            }}
                                        >
                                            <Image
                                                src={item.mainImg}
                                                alt={`Generation ${item.id}`}
                                                fill
                                                className="object-contain"
                                            />
                                        </div>
                                    </div>
                                </button>

                                {/* Info & Actions */}
                                <div className="flex-1 flex flex-col">
                                    <div className="flex items-center text-[12px] text-slate-500 mb-5 bg-slate-50 w-fit px-4 py-2 rounded-full border border-slate-100/80">
                                        图片ID <span className="text-primary bg-primary/10 px-2 py-0.5 rounded ml-2 mr-4 font-mono font-bold tracking-tight">{item.id}</span>
                                        <span className="border-r h-3 mr-4 border-slate-300"></span>
                                        创建人 <span className="text-slate-700 font-medium ml-2 mr-4">{item.creator}</span>
                                        <span className="border-r h-3 mr-4 border-slate-300"></span>
                                        {item.date}
                                        <span className="border-r h-3 mx-4 border-slate-300"></span>
                                        比例 <span className="text-slate-700 font-medium ml-2">{item.ratio}</span>
                                    </div>

                                    {/* Related Sources breakdown */}
                                    <div className="mb-5">
                                        <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                                            关联素材组成
                                        </h4>
                                        <div className="flex flex-wrap gap-2 text-xs">
                                            {item.sceneId && <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-md border border-blue-100">场景: <span className="font-mono">{item.sceneId}</span></span>}
                                            {item.modelId && <span className="px-2 py-1 bg-purple-50 text-purple-600 rounded-md border border-purple-100">模特: <span className="font-mono">{item.modelId}</span></span>}
                                            {item.topId && <span className="px-2 py-1 bg-emerald-50 text-emerald-600 rounded-md border border-emerald-100">上装: <span className="font-mono">{item.topId}</span></span>}
                                            {item.innerId && <span className="px-2 py-1 bg-emerald-50 text-emerald-600 rounded-md border border-emerald-100">内搭: <span className="font-mono">{item.innerId}</span></span>}
                                            {item.bottomId && <span className="px-2 py-1 bg-emerald-50 text-emerald-600 rounded-md border border-emerald-100">下装: <span className="font-mono">{item.bottomId}</span></span>}
                                            {(!item.sceneId && !item.modelId && !item.topId && !item.bottomId) &&
                                                <span className="text-slate-400 italic">早期版本数据，无显式 ID 记录</span>
                                            }
                                        </div>
                                    </div>

                                    <div className="mb-6 flex-1">
                                        <h4 className="text-[11px] font-bold text-primary uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                            <div className="w-1.5 h-1.5 bg-primary rounded-full" /> Prompt 指示词
                                        </h4>
                                        <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-100/80 shadow-inner group-hover:border-primary/10 transition-colors h-full">
                                            <p className="text-[13px] text-slate-600 italic leading-relaxed line-clamp-3">
                                                {item.prompt}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 mt-auto">
                                        <Button variant="outline" size="sm" className="h-9 px-4 text-[12px] text-slate-600 border-slate-200 bg-white shadow-sm hover:bg-slate-50">
                                            <RefreshCw className="w-3.5 h-3.5 mr-2 text-slate-400" /> 去同款重绘
                                        </Button>

                                        <div className="flex items-center gap-1.5 ml-auto">
                                            <button className="w-9 h-9 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:text-slate-700 bg-white hover:bg-slate-50 shadow-sm transition-all">
                                                <Download className="w-4 h-4" />
                                            </button>
                                            <button
                                                className="w-9 h-9 flex items-center justify-center rounded-lg border border-red-100 text-red-500 bg-red-50 hover:bg-red-100 hover:border-red-200 hover:text-red-600 shadow-sm transition-all"
                                                onClick={() => handleDelete(item.id)}
                                                title="移除归档"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Lightbox Overlay */}
            {lightboxData !== null && lightboxImages.length > 0 && (
                <ImageLightbox
                    images={lightboxImages as any}
                    initialIndex={lightboxData.itemIndex}
                    onClose={() => setLightboxData(null)}
                />
            )}
        </div>
    )
}
