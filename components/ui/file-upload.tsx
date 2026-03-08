"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, X, File, Image as ImageIcon, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { storeFile } from "@/lib/utils/storage"

interface FileUploadProps {
  accept?: string
  maxSize?: number // in MB
  onFileSelect: (fileUrl: string, fileName: string) => void
  currentFile?: string | null
  label?: string
  description?: string
  className?: string
  disabled?: boolean
}

export function FileUpload({
  accept = "image/*,.pdf",
  maxSize = 10,
  onFileSelect,
  currentFile,
  label,
  description,
  className,
  disabled = false,
}: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(currentFile || null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setError(null)

    // Validate file size
    const fileSizeMB = file.size / (1024 * 1024)
    if (fileSizeMB > maxSize) {
      setError(`Le fichier est trop volumineux. Taille maximale : ${maxSize} MB`)
      return
    }

    // Validate file type
    const acceptedTypes = accept.split(",").map((t) => t.trim())
    const isValidType =
      acceptedTypes.some((type) => {
        if (type.endsWith("/*")) {
          const baseType = type.split("/")[0]
          return file.type.startsWith(baseType + "/")
        }
        return file.type === type || file.name.toLowerCase().endsWith(type.replace(".", "."))
      }) || accept === "*"

    if (!isValidType) {
      setError(`Type de fichier non accepté. Types acceptés : ${accept}`)
      return
    }

    setIsUploading(true)

    try {
      // Store file and get URL
      const fileUrl = await storeFile(file)
      setPreview(fileUrl)
      onFileSelect(fileUrl, file.name)
    } catch (err) {
      console.error("Error uploading file:", err)
      setError("Erreur lors de l'upload du fichier")
    } finally {
      setIsUploading(false)
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleRemove = () => {
    setPreview(null)
    onFileSelect("", "")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const isImage = preview?.startsWith("data:image/")
  const isPdf = preview?.startsWith("data:application/pdf") || preview?.includes("pdf")

  return (
    <div className={cn("space-y-2", className)}>
      {label && <Label className="text-foreground">{label}</Label>}
      {description && <p className="text-xs text-muted-foreground">{description}</p>}

      {preview ? (
        <div className="relative border border-border rounded-lg overflow-hidden bg-muted/50">
          {isImage ? (
            <div className="relative aspect-video w-full">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-8 w-8"
                onClick={handleRemove}
                disabled={disabled}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : isPdf ? (
            <div className="p-6 flex flex-col items-center justify-center gap-3">
              <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center">
                <File className="h-8 w-8 text-destructive" />
              </div>
              <p className="text-sm font-medium text-foreground">Fichier PDF</p>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={handleRemove}
                disabled={disabled}
              >
                <X className="h-4 w-4 mr-2" />
                Supprimer
              </Button>
            </div>
          ) : (
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <File className="h-8 w-8 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-foreground">Fichier uploadé</p>
                  <p className="text-xs text-muted-foreground">Prêt à être enregistré</p>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={handleRemove}
                disabled={disabled}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div
          className={cn(
            "border-2 border-dashed rounded-lg p-6 transition-colors",
            disabled
              ? "border-muted bg-muted/50 cursor-not-allowed"
              : "border-border bg-muted/30 hover:border-primary/50 cursor-pointer"
          )}
          onClick={() => !disabled && fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileChange}
            className="hidden"
            disabled={disabled}
          />
          <div className="flex flex-col items-center justify-center gap-3 text-center">
            {isUploading ? (
              <>
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Upload en cours...</p>
              </>
            ) : (
              <>
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Upload className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Cliquez pour uploader ou glissez-déposez
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {accept.includes("image") && accept.includes("pdf")
                      ? "Images ou PDF (max " + maxSize + " MB)"
                      : accept.includes("image")
                        ? "Images uniquement (max " + maxSize + " MB)"
                        : "PDF uniquement (max " + maxSize + " MB)"}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {error && (
        <p className="text-xs text-destructive flex items-center gap-1">
          <X className="h-3 w-3" />
          {error}
        </p>
      )}
    </div>
  )
}
