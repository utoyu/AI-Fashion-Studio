"use client"

import { useCallback, useState, useEffect } from "react"
import { Upload, ImageIcon, X, Copy } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

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
  hint = "支持多张上传 (最多4张)。支持拖拽与 Ctrl+V 粘贴。JPG、PNG 格式。",
}: UploadDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false)

  // 核心交接逻辑：只负责接收文件并传给外层，绝不自己上传
  const handleFiles = useCallback((files: FileList | File[]) => {
    const newFiles = Array.from(files).filter(f => f.type.startsWith('image/'));
    const availableSlots = 4 - currentFiles.length;

    if (newFiles.length === 0) return;

    if (availableSlots <= 0) {
      toast.error("最多只能上传 4 张图片");
      return;
    }

    const filesToAdd = newFiles.slice(0, availableSlots);
    const updatedFiles = [...currentFiles, ...filesToAdd];

    // 把文件原封不动地交给父组件 (page.tsx) 去上传云端！
    onFileSelect(updatedFiles);

  }, [currentFiles, onFileSelect]);

  // 支持全局粘贴
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

      if (pastedFiles.length > 0) handleFiles(pastedFiles);
    };

    document.addEventListener("paste", handlePaste);
    return () => document.removeEventListener("paste", handlePaste);
  }, [handleFiles]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation();
  }, [])

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation(); setIsDragging(true);
  }, [])

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation();
    if (!e.currentTarget.contains(e.relatedTarget as Node)) setIsDragging(false);
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation(); setIsDragging(false);
    if (e.dataTransfer.files?.length > 0) handleFiles(e.dataTransfer.files);
  }, [handleFiles])

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) handleFiles(e.target.files);
    e.target.value = '';
  }, [handleFiles])

  const removeFile = (index: number, e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    if (onClear) {
      onClear(index);
    } else {
      const newFiles = [...currentFiles];
      newFiles.splice(index, 1);
      onFileSelect(newFiles);
    }
  };

  return (
    <div
      className={cn(
        "relative rounded-xl border-2 border-dashed transition-all duration-200",
        isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50",
        currentFiles.length > 0 ? "p-4" : "p-12 hover:bg-secondary/30",
        "flex flex-col items-center justify-center cursor-pointer overflow-hidden"
      )}
      onDragEnter={handleDragIn}
      onDragLeave={handleDragOut}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      {isDragging && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm pointer-events-none">
          <Upload className="h-10 w-10 text-primary animate-bounce mb-2" />
          <p className="font-semibold text-primary">松手即可添加图片</p>
        </div>
      )}

      {currentFiles.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 w-full cursor-default" onClick={e => e.stopPropagation()}>
          {currentFiles.map((file, index) => {
            // 本地极速预览（这就是为什么有 blob，它负责让你秒看图片）
            const objectUrl = URL.createObjectURL(file);
            return (
              <div key={index} className="relative overflow-hidden rounded-xl border border-border bg-card group/item">
                <div className="relative aspect-square w-full flex items-center justify-center bg-secondary/10">
                  {/* 使用 img 标签彻底绕过 Next.js 的图片域名审查 */}
                  <img
                    src={objectUrl}
                    alt={`已选图片 ${index + 1}`}
                    className="object-contain w-full h-full p-2"
                    onLoad={() => URL.revokeObjectURL(objectUrl)} // 渲染完就释放内存
                  />
                </div>
                <button
                  onClick={(e) => removeFile(index, e)}
                  className="absolute top-2 right-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-background/80 text-muted-foreground backdrop-blur-sm transition-colors hover:text-destructive hover:bg-background"
                >
                  <X className="h-3 w-3" />
                </button>
                <div className="border-t border-border bg-secondary/30 px-3 py-2">
                  <p className="text-xs text-muted-foreground truncate">
                    <ImageIcon className="mr-1.5 inline h-3 w-3" />
                    {file.name}
                  </p>
                </div>
              </div>
            );
          })}
          {currentFiles.length < 4 && (
            <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border p-4 transition-all hover:border-primary/50 hover:bg-secondary/30 bg-card aspect-square">
              <input type="file" className="sr-only" accept="image/jpeg,image/png,image/webp" multiple onChange={handleFileInput} />
              <Upload className="h-6 w-6 text-muted-foreground mb-2" />
              <span className="text-xs text-muted-foreground">继续添加</span>
            </label>
          )}
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
          <input type="file" className="sr-only" accept="image/jpeg,image/png,image/webp" multiple onChange={handleFileInput} />
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
            <Upload className="h-7 w-7 text-primary" />
          </div>
          <p className="mt-4 text-base font-medium text-foreground">{label}</p>
          <p className="mt-1 text-sm text-muted-foreground">{hint}</p>
        </label>
      )}
    </div>
  )
}