"use client";

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, Download, FileText, Image, Video, File, Trash2, Eye } from 'lucide-react';
import { toast } from 'sonner';

interface FileItem {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: string;
  url?: string;
}

interface FileManagerProps {
  allowedTypes?: string[];
  maxSize?: number; // in MB
  onFileUpload?: (file: File) => Promise<void>;
  onFileDelete?: (fileId: string) => Promise<void>;
  files?: FileItem[];
  title?: string;
}

export function FileManager({
  allowedTypes = ['image/*', 'video/*', 'application/pdf', '.doc', '.docx'],
  maxSize = 10, // 10MB default
  onFileUpload,
  onFileDelete,
  files = [],
  title = "File Manager"
}: FileManagerProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image className="w-4 h-4" />;
    if (type.startsWith('video/')) return <Video className="w-4 h-4" />;
    if (type.includes('pdf')) return <FileText className="w-4 h-4" />;
    return <File className="w-4 h-4" />;
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      toast.error(`File size must be less than ${maxSize}MB`);
      return;
    }

    // Validate file type
    const isValidType = allowedTypes.some(type => {
      if (type.startsWith('.')) {
        return file.name.toLowerCase().endsWith(type.toLowerCase());
      }
      return file.type.match(type.replace('*', '.*'));
    });

    if (!isValidType) {
      toast.error('File type not supported');
      return;
    }

    setIsUploading(true);
    try {
      await onFileUpload?.(file);
      toast.success('File uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload file');
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDownload = (file: FileItem) => {
    if (file.url) {
      const link = document.createElement('a');
      link.href = file.url;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleDelete = async (fileId: string) => {
    try {
      await onFileDelete?.(fileId);
      toast.success('File deleted successfully');
    } catch (error) {
      toast.error('Failed to delete file');
      console.error('Delete error:', error);
    }
  };

  const handlePreview = (file: FileItem) => {
    if (file.url && file.type.startsWith('image/')) {
      window.open(file.url, '_blank');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {title}
          <Button 
            onClick={handleFileSelect} 
            disabled={isUploading}
            className="flex items-center"
          >
            <Upload className="w-4 h-4 mr-2" />
            {isUploading ? 'Uploading...' : 'Upload File'}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileChange}
          accept={allowedTypes.join(',')}
          className="hidden"
        />

        {files.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <File className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No files uploaded yet</p>
            <p className="text-sm">Click &quot;Upload File&quot; to get started</p>
          </div>
        ) : (
          <div className="space-y-3">
            {files.map((file) => (
              <div key={file.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center space-x-3">
                  {getFileIcon(file.type)}
                  <div>
                    <p className="font-medium text-sm">{file.name}</p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(file.size)} • {new Date(file.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {file.type.startsWith('image/') && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handlePreview(file)}
                      title="Preview"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  )}
                  
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDownload(file)}
                    title="Download"
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(file.id)}
                    title="Delete"
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-4 text-xs text-gray-500">
          <p>Supported formats: {allowedTypes.join(', ')}</p>
          <p>Maximum file size: {maxSize}MB</p>
        </div>
      </CardContent>
    </Card>
  );
}