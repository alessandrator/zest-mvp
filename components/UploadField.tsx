'use client'

import { useRef, useState, DragEvent } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface UploadFieldProps {
  onFileSelect: (files: File[]) => void
  accept?: string
  multiple?: boolean
  maxSize?: number // in MB
  className?: string
  placeholder?: string
  disabled?: boolean
}

export function UploadField({
  onFileSelect,
  accept,
  multiple = false,
  maxSize = 10,
  className,
  placeholder = "Drag and drop files here, or click to select",
  disabled = false
}: UploadFieldProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const validateFiles = (files: File[]): File[] => {
    const validFiles: File[] = []
    const maxSizeBytes = maxSize * 1024 * 1024

    for (const file of files) {
      if (file.size > maxSizeBytes) {
        setError(`File "${file.name}" is too large. Maximum size is ${maxSize}MB.`)
        continue
      }
      validFiles.push(file)
    }

    if (validFiles.length > 0) {
      setError(null)
    }

    return validFiles
  }

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return
    
    const fileArray = Array.from(files)
    const validFiles = validateFiles(fileArray)
    
    if (validFiles.length > 0) {
      onFileSelect(validFiles)
    }
  }

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!disabled) {
      setIsDragOver(true)
    }
  }

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
  }

  const handleDrop = (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
    
    if (disabled) return
    
    const files = e.dataTransfer.files
    handleFileSelect(files)
  }

  const handleClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files)
  }

  return (
    <div className={cn("w-full", className)}>
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
          isDragOver
            ? "border-primary bg-primary/5"
            : "border-gray-300 hover:border-gray-400",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleInputChange}
          className="hidden"
          disabled={disabled}
        />
        
        <div className="space-y-2">
          <div className="text-4xl text-gray-400">📁</div>
          <p className="text-sm text-gray-600">{placeholder}</p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={disabled}
            onClick={(e) => {
              e.stopPropagation()
              handleClick()
            }}
          >
            Choose Files
          </Button>
          {accept && (
            <p className="text-xs text-gray-500">
              Accepted formats: {accept}
            </p>
          )}
          <p className="text-xs text-gray-500">
            Maximum file size: {maxSize}MB
          </p>
        </div>
      </div>
      
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}