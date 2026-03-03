"use client"

import { useCallback, useState, useEffect } from "react"
import { Upload, ImageIcon, X, Copy } from "lucide-react"
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
  hint = "支持多张上传 (最多4张)。支持批量拖拽与 Ctrl+V 粘贴。JPG、PNG 格式。",
}: UploadDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [previews, setPreviews] = useState<{ url: string, file: File }[]>([])

  const processFiles = useCallback((files: FileList | File[]) => {
    setPreviews(prev => {
      const existingFiles = prev.map(p => p.file);
      const newFiles = Array.from(files).filter(f => f.type.startsWith('image/'));

      const availableSlots = 4 - existingFiles.length;
      if (availableSlots <= 0) return prev; // limit to 4

      const filesToAdd = newFiles.slice(0, availableSlots);
      if (filesToAdd.length === 0) return prev;

      const newPreviews = filesToAdd.map(file => ({
        url: URL.createObjectURL(file),
        file
      }));

      const combinedPreviews = [...prev, ...newPreviews];
      onFileSelect(combinedPreviews.map(p => p.file));
      return combinedPreviews;
    });
  }, [onFileSelect]);

  // Handle global paste event
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      const pastedFiles: File[] = [];
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith("image/")) {
          const file = items[i].getAsFile();
          if (file) pastedFiles.push(file);
        }
      }

      if (pastedFiles.length > 0) {
        processFiles(pastedFiles);
      }
    };

    document.addEventListener("paste", handlePaste);
    return () => {
      document.removeEventListener("paste", handlePaste);
    };
  }, [processFiles]);

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
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragging(false)
    }
  }, [])

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
      // Reset input value to allow selecting same file again
      e.target.value = '';
    },
    [processFiles]
  )

  const handleClear = useCallback((index: number) => {
    setPreviews(prev => {
      const newPreviews = [...prev];
      URL.revokeObjectURL(newPreviews[index].url);
      newPreviews.splice(index, 1);

      // Update parent with the remaining files
      onFileSelect(newPreviews.map(p => p.file));
      return newPreviews;
    });
    onClear?.(index);
  }, [onClear, onFileSelect])

  // Sync previews if currentFiles is cleared from exterior
  useEffect(() => {
    if (currentFiles.length === 0 && previews.length > 0) {
      previews.forEach(p => URL.revokeObjectURL(p.url));
      setPreviews([]);
    }
  }, [currentFiles, previews]);

  const displayItems = previews.length > 0 ? previews : [];

  return (
    <div
      className={cn(
        "relative rounded-xl border-2 border-dashed transition-all duration-200",
        isDragging
          ? "border-primary bg-primary/5"
          : "border-border hover:border-primary/50",
        displayItems.length > 0 ? "p-4" : "p-12 hover:bg-secondary/30",
        "flex flex-col items-center justify-center cursor-pointer overflow-hidden"
      )}
      onDragEnter={handleDragIn}
      onDragLeave={handleDragOut}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      {/* Drag Overlay Mask */}
      {isDragging && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm pointer-events-none">
          <Upload className="h-10 w-10 text-primary animate-bounce mb-2" />
          <p className="font-semibold text-primary">松手即可添加图片</p>
        </div>
      )}

      {displayItems.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 w-full cursor-default" onClick={e => e.stopPropagation()}>
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
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleClear(index); }}
                className="absolute top-2 right-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-background/80 text-muted-foreground backdrop-blur-sm transition-colors hover:text-destructive hover:bg-background"
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
              <span className="text-[10px] text-muted-foreground/70 mt-1">支持粘贴/拖拽</span>
            </label>
          )}
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
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
          <div className="flex items-center justify-center gap-4 mt-4 w-full">
            <span className="flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs text-muted-foreground">
              <Copy className="h-3 w-3" /> <kbd className="font-sans px-1 bg-background rounded border border-border">Ctrl</kbd> + <kbd className="font-sans px-1 bg-background rounded border border-border">V</kbd> 粘贴
            </span>
            <span className="text-xs text-primary font-medium hover:underline">点击或拖拽上传</span>
          </div>
        </label>
      )}
    </div>
  )
}
