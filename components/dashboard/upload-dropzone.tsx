"use client"

import { useCallback, useState } from "react"
import { Upload, ImageIcon, X } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface UploadDropzoneProps {
  onFileSelect: (file: File) => void
  currentFile?: File | null
  onClear?: () => void
  label?: string
  hint?: string
}

export function UploadDropzone({
  onFileSelect,
  currentFile,
  onClear,
  label = "上传商品平铺图",
  hint = "支持 JPG、PNG 格式，建议尺寸 1000x1000 以上",
}: UploadDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)

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

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(false)

      const files = e.dataTransfer.files
      if (files?.[0]) {
        const file = files[0]
        onFileSelect(file)
        setPreview(URL.createObjectURL(file))
      }
    },
    [onFileSelect]
  )

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files
      if (files?.[0]) {
        const file = files[0]
        onFileSelect(file)
        setPreview(URL.createObjectURL(file))
      }
    },
    [onFileSelect]
  )

  const handleClear = useCallback(() => {
    setPreview(null)
    onClear?.()
  }, [onClear])

  if (preview || currentFile) {
    return (
      <div className="relative overflow-hidden rounded-xl border border-border bg-card">
        <div className="relative aspect-square w-full max-h-[400px]">
          <Image
            src={preview || ""}
            alt="已上传的商品图"
            fill
            className="object-contain p-4"
          />
        </div>
        <button
          onClick={handleClear}
          className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-background/80 text-muted-foreground backdrop-blur-sm transition-colors hover:text-foreground"
          aria-label="移除图片"
        >
          <X className="h-4 w-4" />
        </button>
        <div className="border-t border-border bg-secondary/30 px-4 py-3">
          <p className="text-sm text-muted-foreground truncate">
            <ImageIcon className="mr-2 inline h-4 w-4" />
            {currentFile?.name || "已上传图片"}
          </p>
        </div>
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
