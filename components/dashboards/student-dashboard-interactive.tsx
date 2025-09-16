'use client'

import { useState, useEffect } from 'react'
import { User, Material, Correction, Notification } from '@/types'
import { Navbar } from '@/components/layouts/navbar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useStudentDashboard } from '@/lib/hooks/use-api'

interface StudentDashboardProps {
  user: User
  materials: Material[]
  corrections: Correction[]
  notifications: Notification[]
  unreadNotifications: number
  stats: {
    totalMaterials: number
    approvedMaterials: number
    pendingMaterials: number
    materialsNeedingChanges: number
  }
}

export function StudentDashboardInteractive({
  user,
  materials: initialMaterials,
  corrections: initialCorrections,
  notifications: initialNotifications,
  unreadNotifications,
  stats
}: StudentDashboardProps) {
  // Demo logging for development - in real app these would be used throughout the component
  console.log('Student dashboard data:', { unreadNotifications, stats })

  const {
    materials: apiMaterials,
    corrections: apiCorrections,
    notifications: apiNotifications,
    loadDashboard,
    loading
  } = useStudentDashboard()

  const [showUploadForm, setShowUploadForm] = useState(false)
  const [uploadForm, setUploadForm] = useState({
    title: '',
    description: '',
    subject: '',
    file_type: 'pdf',
    tags: ''
  })

  // Use API data if available, fallback to initial props
  const materials = apiMaterials?.materials || initialMaterials
  const corrections = apiCorrections?.corrections || initialCorrections
  const notifications = apiNotifications?.notifications || initialNotifications

  useEffect(() => {
    // Load fresh data when component mounts
    loadDashboard()
  }, [loadDashboard])

  const handleUploadMaterial = async () => {
    if (!apiMaterials) return
    
    try {
      await apiMaterials.createMaterial({
        title: uploadForm.title,
        description: uploadForm.description,
        subject: uploadForm.subject,
        file_type: uploadForm.file_type,
        tags: uploadForm.tags.split(',').map(tag => tag.trim()).filter(Boolean)
      })
      
      // Reset form and reload data
      setUploadForm({
        title: '',
        description: '',
        subject: '',
        file_type: 'pdf',
        tags: ''
      })
      setShowUploadForm(false)
      loadDashboard()
      
      alert('Material uploaded successfully! Your school admin will be notified.')
    } catch (error) {
      console.error('Upload failed:', error)
      alert('Upload failed. Please try again.')
    }
  }

  const handleViewMaterial = (materialId: string) => {
    console.log('View material:', materialId)
    alert(`Viewing material ${materialId} - this would navigate to the material detail page`)
  }

  const handleMarkNotificationRead = async (notificationId: string) => {
    if (!apiNotifications) return
    
    try {
      await apiNotifications.markAsRead(notificationId)
      loadDashboard() // Refresh data
    } catch (error) {
      console.error('Failed to mark notification as read:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-dark mb-2">
            Student Dashboard
            {loading && <span className="text-sm text-gray-500 ml-2">(Updating...)</span>}
          </h1>
          <p className="text-gray-600">
            Welcome back, {user.profile.first_name}! Upload materials and track your progress.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Materials
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-dark">{materials.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Approved
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {materials.filter(m => m.status === 'approved').length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Pending Review
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600">
                {materials.filter(m => m.status === 'submitted' || m.status === 'under_review').length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Need Changes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">
                {materials.filter(m => m.status === 'requires_changes').length}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Materials */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>My Materials</CardTitle>
                <Button 
                  onClick={() => setShowUploadForm(true)} 
                  size="sm"
                  disabled={loading}
                >
                  Upload New Material
                </Button>
              </CardHeader>
              <CardContent>
                {/* Upload Form */}
                {showUploadForm && (
                  <div className="border rounded-lg p-4 mb-4 bg-blue-50">
                    <h3 className="font-semibold mb-3">Upload New Material</h3>
                    <div className="space-y-3">
                      <input
                        type="text"
                        placeholder="Title"
                        value={uploadForm.title}
                        onChange={(e) => setUploadForm(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full p-2 border rounded"
                      />
                      <textarea
                        placeholder="Description"
                        value={uploadForm.description}
                        onChange={(e) => setUploadForm(prev => ({ ...prev, description: e.target.value }))}
                        className="w-full p-2 border rounded h-20"
                      />
                      <input
                        type="text"
                        placeholder="Subject"
                        value={uploadForm.subject}
                        onChange={(e) => setUploadForm(prev => ({ ...prev, subject: e.target.value }))}
                        className="w-full p-2 border rounded"
                      />
                      <input
                        type="text"
                        placeholder="Tags (comma separated)"
                        value={uploadForm.tags}
                        onChange={(e) => setUploadForm(prev => ({ ...prev, tags: e.target.value }))}
                        className="w-full p-2 border rounded"
                      />
                      <select
                        value={uploadForm.file_type}
                        onChange={(e) => setUploadForm(prev => ({ ...prev, file_type: e.target.value }))}
                        className="w-full p-2 border rounded"
                      >
                        <option value="pdf">PDF Document</option>
                        <option value="presentation">Presentation</option>
                        <option value="video">Video</option>
                        <option value="image">Image</option>
                        <option value="archive">Archive</option>
                      </select>
                      <div className="flex gap-2">
                        <Button 
                          onClick={handleUploadMaterial}
                          disabled={!uploadForm.title || !uploadForm.description || apiMaterials?.loading}
                          size="sm"
                        >
                          {apiMaterials?.loading ? 'Uploading...' : 'Upload'}
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={() => setShowUploadForm(false)}
                          size="sm"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {materials.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    No materials uploaded yet. Start by uploading your first material!
                  </p>
                ) : (
                  <div className="space-y-4">
                    {materials.map((material) => (
                      <div key={material.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-dark">{material.title}</h3>
                            <p className="text-sm text-gray-600 mt-1">{material.description}</p>
                            <div className="flex items-center gap-4 mt-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                material.status === 'approved' ? 'bg-green-100 text-green-700' :
                                material.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                material.status === 'requires_changes' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-blue-100 text-blue-700'
                              }`}>
                                {material.status.replace('_', ' ')}
                              </span>
                              <span className="text-xs text-gray-500">
                                {material.subject}
                              </span>
                              <span className="text-xs text-gray-500">
                                {new Date(material.created_at).toLocaleDateString()}
                              </span>
                            </div>
                            {material.tags && material.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {material.tags.map((tag, index) => (
                                  <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleViewMaterial(material.id)}
                          >
                            View
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Feedback */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Feedback</CardTitle>
              </CardHeader>
              <CardContent>
                {corrections.length === 0 ? (
                  <p className="text-gray-500 text-sm">No feedback yet</p>
                ) : (
                  <div className="space-y-3">
                    {corrections.slice(0, 3).map((correction) => (
                      <div key={correction.id} className="border-l-4 border-blue-500 pl-3">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            correction.type === 'approval' ? 'bg-green-100 text-green-700' :
                            correction.type === 'error' ? 'bg-red-100 text-red-700' :
                            'bg-blue-100 text-blue-700'
                          }`}>
                            {correction.type}
                          </span>
                          <span className={`px-2 py-1 rounded text-xs ${
                            correction.status === 'active' ? 'bg-orange-100 text-orange-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {correction.status}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 mt-1">{correction.content.substring(0, 100)}...</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(correction.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card>
              <CardHeader>
                <CardTitle>
                  Notifications 
                  {notifications.filter(n => !n.read).length > 0 && (
                    <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      {notifications.filter(n => !n.read).length}
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {notifications.length === 0 ? (
                  <p className="text-gray-500 text-sm">No notifications</p>
                ) : (
                  <div className="space-y-3">
                    {notifications.slice(0, 5).map((notification) => (
                      <div 
                        key={notification.id} 
                        className={`border-b border-gray-100 pb-2 last:border-0 cursor-pointer ${
                          !notification.read ? 'bg-blue-50 p-2 rounded' : ''
                        }`}
                        onClick={() => handleMarkNotificationRead(notification.id)}
                      >
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${
                            notification.type === 'success' ? 'bg-green-500' :
                            notification.type === 'warning' ? 'bg-yellow-500' :
                            notification.type === 'error' ? 'bg-red-500' :
                            'bg-blue-500'
                          }`} />
                          <p className="text-sm font-medium">{notification.title}</p>
                          {!notification.read && (
                            <span className="text-xs text-blue-600 font-medium">NEW</span>
                          )}
                        </div>
                        <p className="text-xs text-gray-600">{notification.message}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(notification.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  className="w-full justify-start" 
                  onClick={() => setShowUploadForm(true)}
                  disabled={loading}
                >
                  Upload New Material
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start" 
                  onClick={loadDashboard}
                  disabled={loading}
                >
                  {loading ? 'Refreshing...' : 'Refresh Dashboard'}
                </Button>
                
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/dashboard/student/materials">
                    View All Materials
                  </Link>
                </Button>
                
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/dashboard/profile">
                    Update Profile
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}