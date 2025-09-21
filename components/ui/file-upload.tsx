'use client'

import React, { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Upload, File, X, Image, AlertCircle } from 'lucide-react'

interface FileUploadProps {
  bucket: string
  folder?: string
  allowedTypes?: string[]
  maxSizeMB?: number
  maxFiles?: number
  onUpload?: (urls: string[]) => void
  onError?: (error: string) => void
  accept?: string
  className?: string
}

interface UploadedFile {
  url: string
  name: string
  type: string
  size: number
}

export function FileUpload({
  bucket,
  folder,
  allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
  maxSizeMB = 10,
  maxFiles = 5,
  onUpload,
  onError,
  accept = 'image/*,application/pdf',
  className = ''
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFiles = async (files: FileList) => {
    if (files.length === 0) return

    // Check file count limit
    if (uploadedFiles.length + files.length > maxFiles) {
      onError?.(`Massimo ${maxFiles} file consentiti`)
      return
    }

    setUploading(true)
    const newUploadedFiles: UploadedFile[] = []

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]

        // Validate file type
        if (!allowedTypes.includes(file.type)) {
          onError?.(`Tipo di file non supportato: ${file.type}`)
          continue
        }

        // Validate file size
        if (file.size > maxSizeMB * 1024 * 1024) {
          onError?.(`File troppo grande: ${file.name} (max ${maxSizeMB}MB)`)
          continue
        }

        // Upload file
        const formData = new FormData()
        formData.append('file', file)
        formData.append('bucket', bucket)
        if (folder) formData.append('folder', folder)

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) {
          const error = await response.json()
          onError?.(error.error || 'Errore durante il caricamento')
          continue
        }

        const result = await response.json()
        newUploadedFiles.push({
          url: result.url,
          name: file.name,
          type: file.type,
          size: file.size,
        })
      }

      setUploadedFiles(prev => [...prev, ...newUploadedFiles])
      onUpload?.(newUploadedFiles.map(f => f.url))
    } catch (error) {
      console.error('Upload error:', error)
      onError?.('Errore durante il caricamento dei file')
    } finally {
      setUploading(false)
    }
  }

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className={className}>
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg transition-colors ${
          dragActive
            ? 'border-primary bg-primary/5'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="p-6">
          <div className="text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <div className="mb-4">
              <p className="text-lg font-medium text-gray-900 mb-2">
                Carica i tuoi file
              </p>
              <p className="text-sm text-gray-600 mb-2">
                Trascina e rilascia qui o clicca per selezionare
              </p>
              <p className="text-xs text-gray-500">
                Massimo {maxFiles} file, {maxSizeMB}MB per file
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading || uploadedFiles.length >= maxFiles}
            >
              {uploading ? 'Caricamento...' : 'Seleziona File'}
            </Button>
          </div>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={accept}
        onChange={(e) => {
          if (e.target.files) {
            handleFiles(e.target.files)
          }
        }}
        className="hidden"
      />

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">
            File caricati ({uploadedFiles.length})
          </h4>
          <div className="space-y-2">
            {uploadedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  {file.type.startsWith('image/') ? (
                    <Image size={16} className="text-blue-500" />
                  ) : (
                    <File size={16} className="text-gray-500" />
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:text-blue-800"
                  >
                    Visualizza
                  </a>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => removeFile(index)}
                    className="h-6 w-6 p-0"
                  >
                    <X size={12} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Error state */}
      {uploadedFiles.length === 0 && !uploading && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-2">
            <AlertCircle size={16} className="text-blue-600" />
            <p className="text-sm text-blue-700">
              Tipi supportati: {allowedTypes.join(', ')}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}