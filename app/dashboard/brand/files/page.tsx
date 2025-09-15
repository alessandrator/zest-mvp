"use client";

import { useState } from 'react';
import { FileManager } from '@/components/ui/file-manager';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { FolderOpen, Upload, Download } from 'lucide-react';

// Mock data - in real app this would come from your backend
const mockFiles = {
  campaign_assets: [
    {
      id: '1',
      name: 'brand_logo_highres.png',
      size: 1024000,
      type: 'image/png',
      uploadedAt: '2024-01-15T10:30:00Z',
      url: '/api/files/1'
    },
    {
      id: '2',
      name: 'product_guidelines.pdf',
      size: 2048000,
      type: 'application/pdf',
      uploadedAt: '2024-01-14T15:45:00Z',
      url: '/api/files/2'
    }
  ],
  creator_submissions: [
    {
      id: '3',
      name: 'sarah_m_instagram_post.jpg',
      size: 856000,
      type: 'image/jpeg',
      uploadedAt: '2024-01-13T09:15:00Z',
      url: '/api/files/3'
    },
    {
      id: '4',
      name: 'alex_k_tiktok_video.mp4',
      size: 15360000,
      type: 'video/mp4',
      uploadedAt: '2024-01-12T14:20:00Z',
      url: '/api/files/4'
    }
  ]
};

export default function BrandFilesPage() {
  const [files, setFiles] = useState(mockFiles);

  const handleFileUpload = async (file: File, category: string) => {
    // In a real app, this would upload to your backend/storage service
    console.log('Uploading file:', file.name, 'to category:', category);
    
    // Mock upload simulation
    const newFile = {
      id: Date.now().toString(),
      name: file.name,
      size: file.size,
      type: file.type,
      uploadedAt: new Date().toISOString(),
      url: `/api/files/${Date.now()}`
    };

    setFiles(prev => ({
      ...prev,
      [category]: [...prev[category as keyof typeof prev], newFile]
    }));
  };

  const handleFileDelete = async (fileId: string, category: string) => {
    // In a real app, this would delete from your backend/storage service
    console.log('Deleting file:', fileId, 'from category:', category);
    
    setFiles(prev => ({
      ...prev,
      [category]: prev[category as keyof typeof prev].filter(f => f.id !== fileId)
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-dark mb-2">
            File Management
          </h1>
          <p className="text-gray-600">
            Organize your campaign assets and creator submissions
          </p>
        </div>

        {/* File Statistics */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <FolderOpen className="w-4 h-4 mr-2" />
                Campaign Assets
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-dark">{files.campaign_assets.length}</div>
              <p className="text-sm text-gray-600">Files uploaded</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <Download className="w-4 h-4 mr-2" />
                Creator Submissions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-dark">{files.creator_submissions.length}</div>
              <p className="text-sm text-gray-600">Files received</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <Upload className="w-4 h-4 mr-2" />
                Total Storage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-dark">
                {Math.round(
                  ([...files.campaign_assets, ...files.creator_submissions]
                    .reduce((acc, file) => acc + file.size, 0)) / 1024 / 1024
                )}MB
              </div>
              <p className="text-sm text-gray-600">Used storage</p>
            </CardContent>
          </Card>
        </div>

        {/* File Management Tabs */}
        <Tabs defaultValue="campaign_assets" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="campaign_assets">Campaign Assets</TabsTrigger>
            <TabsTrigger value="creator_submissions">Creator Submissions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="campaign_assets" className="space-y-6">
            <FileManager
              title="Campaign Assets"
              files={files.campaign_assets}
              allowedTypes={['image/*', 'video/*', 'application/pdf', '.doc', '.docx', '.zip']}
              maxSize={50}
              onFileUpload={(file) => handleFileUpload(file, 'campaign_assets')}
              onFileDelete={(fileId) => handleFileDelete(fileId, 'campaign_assets')}
            />
          </TabsContent>
          
          <TabsContent value="creator_submissions" className="space-y-6">
            <FileManager
              title="Creator Submissions"
              files={files.creator_submissions}
              allowedTypes={['image/*', 'video/*', 'application/pdf']}
              maxSize={100}
              onFileUpload={(file) => handleFileUpload(file, 'creator_submissions')}
              onFileDelete={(fileId) => handleFileDelete(fileId, 'creator_submissions')}
            />
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                <Upload className="w-6 h-6" />
                <span>Bulk Upload</span>
                <span className="text-xs text-gray-500">Upload multiple files at once</span>
              </Button>
              
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                <Download className="w-6 h-6" />
                <span>Download All</span>
                <span className="text-xs text-gray-500">Download all files as ZIP</span>
              </Button>
              
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                <FolderOpen className="w-6 h-6" />
                <span>Organize</span>
                <span className="text-xs text-gray-500">Create folders and organize</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}