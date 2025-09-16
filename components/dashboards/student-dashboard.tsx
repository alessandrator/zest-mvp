'use client'

import { User, Material, Correction, Notification } from '@/types'
import { Navbar } from '@/components/layouts/navbar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

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

export function StudentDashboard({
  user,
  materials,
  corrections,
  notifications,
  unreadNotifications,
  stats
}: StudentDashboardProps) {
  const handleUploadMaterial = async () => {
    // Demo implementation - in real app, this would open an upload modal
    console.log('Upload material clicked')
    alert('Material upload functionality would be implemented here')
  }

  const handleViewMaterial = (materialId: string) => {
    console.log('View material:', materialId)
    alert(`View material ${materialId} - this would navigate to the material detail page`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-dark mb-2">
            Student Dashboard
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
              <div className="text-3xl font-bold text-dark">{stats.totalMaterials}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Approved
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{stats.approvedMaterials}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Pending Review
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600">{stats.pendingMaterials}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Need Changes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">{stats.materialsNeedingChanges}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Materials */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>My Materials</CardTitle>
                <Button onClick={handleUploadMaterial} size="sm">
                  Upload New Material
                </Button>
              </CardHeader>
              <CardContent>
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
                        <p className="text-sm font-medium">{correction.type}</p>
                        <p className="text-xs text-gray-600">{correction.content.substring(0, 100)}...</p>
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
                  {unreadNotifications > 0 && (
                    <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      {unreadNotifications}
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {notifications.length === 0 ? (
                  <p className="text-gray-500 text-sm">No notifications</p>
                ) : (
                  <div className="space-y-3">
                    {notifications.slice(0, 3).map((notification) => (
                      <div key={notification.id} className="border-b border-gray-100 pb-2 last:border-0">
                        <p className="text-sm font-medium">{notification.title}</p>
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
                  onClick={handleUploadMaterial}
                >
                  Upload New Material
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