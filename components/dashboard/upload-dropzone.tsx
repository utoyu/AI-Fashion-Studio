"use client"

import { useCallback, useState } from "react"
import { Upload, ImageIcon, X } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface UploadDropzoneProps {
  onFileSelect: (files: File[]) => void
  currentFiles?: File[]
  onClear?: (index?: number) => void
  label?: string
  hint?: string
}

export function UploadDropzone({
  onFileSelect,
  currentFiles = [],
  onClear,
  label = "上传商品平铺图",
  hint = "支持多张上传 (最多4张)。JPG、PNG 格式，建议尺寸 1000x1000 以上",
}: UploadDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [previews, setPreviews] = useState<{ url: string, file: File }[]>([])

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const processFiles = useCallback((files: FileList | File[]) => {
    const newFiles = Array.from(files).filter(f => f.type.startsWith('image/')).slice(0, 4); // Limit to 4 images
    if (newFiles.length > 0) {
      onFileSelect(newFiles);
      setPreviews(newFiles.map(file => ({
        url: URL.createObjectURL(file),
        file
      })));
    }
  }, [onFileSelect]);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(false)

      const files = e.dataTransfer.files
      if (files?.length > 0) {
        processFiles(files);
      }
    },
    [processFiles]
  )

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files
      if (files?.length) {
        processFiles(files);
      }
    },
    [processFiles]
  )

  const handleClear = useCallback((index: number) => {
    setPreviews(prev => {
      const newPreviews = [...prev];
      URL.revokeObjectURL(newPreviews[index].url);
      newPreviews.splice(index, 1);
      return newPreviews;
    });
    onClear?.(index);
  }, [onClear])

  if (previews.length > 0 || currentFiles.length > 0) {
    const displayItems = previews.length > 0 ? previews : currentFiles.map(f => ({ url: URL.createObjectURL(f), file: f }));

    return (
      <div className="grid grid-cols-2 gap-4">
        {displayItems.map((item, index) => (
          <div key={index} className="relative overflow-hidden rounded-xl border border-border bg-card">
            <div className="relative aspect-square w-full">
              <Image
                src={item.url}
                alt={`已上传的商品图 ${index + 1}`}
                fill
                className="object-contain p-2"
              />
            </div>
            <button
              onClick={(e) => { e.preventDefault(); handleClear(index); }}
              className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-background/80 text-muted-foreground backdrop-blur-sm transition-colors hover:text-destructive hover:bg-background"
              aria-label="移除图片"
            >
              <X className="h-3 w-3" />
            </button>
            <div className="border-t border-border bg-secondary/30 px-3 py-2">
              <p className="text-xs text-muted-foreground truncate" title={item.file.name}>
                <ImageIcon className="mr-1.5 inline h-3 w-3" />
                {item.file.name}
              </p>
            </div>
          </div>
        ))}
        {/* Allow adding more if less than 4 */}
        {displayItems.length < 4 && (
          <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border p-4 transition-all hover:border-primary/50 hover:bg-secondary/30 bg-card aspect-square">
            <input type="file" className="sr-only" accept="image/jpeg,image/png,image/webp" multiple onChange={handleFileInput} />
            <Upload className="h-6 w-6 text-muted-foreground mb-2" />
            <span className="text-xs text-muted-foreground">继续添加</span>
          </label>
        )}
      </div>
    )
  }

  return (
    <label
      className={cn(
        "flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-12 transition-all duration-200",
        isDragging
          ? "border-primary bg-primary/5"
          : "border-border hover:border-primary/50 hover:bg-secondary/30"
      )}
      onDragEnter={handleDragIn}
      onDragLeave={handleDragOut}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <input
        type="file"
        className="sr-only"
        accept="image/jpeg,image/png,image/webp"
        multiple
        onChange={handleFileInput}
      />
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
        <Upload className="h-7 w-7 text-primary" />
      </div>
      <p className="mt-4 text-base font-medium text-foreground">{label}</p>
      <p className="mt-1 text-sm text-muted-foreground">{hint}</p>
      <p className="mt-3 text-xs text-primary">点击选择或拖拽上传</p>
    </label>
  )
}
