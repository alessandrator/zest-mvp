'use client'

import { User, Material, Correction, UserPermissions, Notification } from '@/types'
import { Navbar } from '@/components/layouts/navbar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface SchoolDashboardProps {
  user: User
  materials: Material[]
  corrections: Correction[]
  manageableUsers: User[]
  permissions: UserPermissions[]
  notifications: Notification[]
  unreadNotifications: number
  stats: {
    totalMaterials: number
    pendingReview: number
    totalStudents: number
    activeStudents: number
    correctionsThisWeek: number
  }
}

export function SchoolDashboard({
  user,
  materials,
  corrections,
  manageableUsers,
  permissions,
  notifications,
  unreadNotifications,
  stats
}: SchoolDashboardProps) {
  // Demo logging for development - in real app these would be used throughout the component
  console.log('School dashboard data:', { corrections: corrections.length, permissions: permissions.length, unreadNotifications })

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-dark mb-2">
            School Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Welcome back, {user.profile.first_name}! Manage your school&apos;s materials and students.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Pending Review</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">{stats.pendingReview}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Materials</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-dark">{stats.totalMaterials}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Active Students</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{stats.activeStudents}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Students</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{stats.totalStudents}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Corrections This Week</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">{stats.correctionsThisWeek}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Materials Pending Review</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {materials.filter(m => m.status === 'submitted' || m.status === 'under_review').map((material) => (
                    <div key={material.id} className="border rounded-lg p-4">
                      <h3 className="font-semibold">{material.title}</h3>
                      <p className="text-sm text-gray-600">{material.description}</p>
                      <div className="flex justify-between items-center mt-3">
                        <span className="text-xs text-gray-500">
                          Submitted: {new Date(material.submitted_at || '').toLocaleDateString()}
                        </span>
                        <div className="space-x-2">
                          <Button size="sm" variant="outline">Review</Button>
                          <Button size="sm">Approve</Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Student Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {manageableUsers.filter(u => u.role === 'student').slice(0, 5).map((student) => (
                    <div key={student.id} className="flex justify-between items-center">
                      <span className="text-sm">{student.profile.first_name} {student.profile.last_name}</span>
                      <Button size="sm" variant="outline">Manage</Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Notifications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {notifications.slice(0, 3).map((notification) => (
                    <div key={notification.id} className="text-sm">
                      <p className="font-medium">{notification.title}</p>
                      <p className="text-gray-600">{notification.message}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}