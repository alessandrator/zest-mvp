'use client'

import { User, Material, UserPermissions, Notification } from '@/types'
import { Navbar } from '@/components/layouts/navbar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface SuperAdminDashboardProps {
  user: User
  materials: Material[]
  permissions: UserPermissions[]
  notifications: Notification[]
  unreadNotifications: number
  systemStats: {
    totalUsers: number
    totalSchools: number
    totalMaterials: number
    pendingApproval: number
    recentUploads: number
    blockedUsers: number
    activeSchools: number
    verifiedUsers: number
  }
  usersByRole: {
    students: number
    school_admins: number
    influencers: number
    brands: number
    consumers: number
  }
  materialsByStatus: {
    draft: number
    submitted: number
    under_review: number
    approved: number
    rejected: number
    requires_changes: number
  }
}

export function SuperAdminDashboard({
  user,
  materials,
  permissions,
  notifications,
  unreadNotifications,
  systemStats,
  usersByRole,
  materialsByStatus
}: SuperAdminDashboardProps) {
  // Demo logging for development - in real app these would be used throughout the component
  console.log('Super admin dashboard data:', { permissions: permissions.length, notifications: notifications.length, unreadNotifications })

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-dark mb-2">
            Super Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Welcome back, {user.profile.first_name}! Monitor and manage the entire ZEST platform.
          </p>
        </div>

        {/* System Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-dark">{systemStats.totalUsers}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Active Schools</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{systemStats.activeSchools}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Pending Approval</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">{systemStats.pendingApproval}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Recent Uploads</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{systemStats.recentUploads}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Materials Pending Approval</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {materials.filter(m => m.status === 'approved' && m.visibility !== 'public').slice(0, 5).map((material) => (
                  <div key={material.id} className="border rounded-lg p-4">
                    <h3 className="font-semibold">{material.title}</h3>
                    <p className="text-sm text-gray-600">{material.description}</p>
                    <div className="flex justify-between items-center mt-3">
                      <span className="text-xs text-gray-500">Status: {material.status}</span>
                      <div className="space-x-2">
                        <button className="px-3 py-1 bg-green-600 text-white rounded text-sm">
                          Approve for Public
                        </button>
                        <button className="px-3 py-1 border border-gray-300 rounded text-sm">
                          Review
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>System Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Users by Role</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Students:</span>
                      <span className="font-semibold">{usersByRole.students}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>School Admins:</span>
                      <span className="font-semibold">{usersByRole.school_admins}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Influencers:</span>
                      <span className="font-semibold">{usersByRole.influencers}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Brands:</span>
                      <span className="font-semibold">{usersByRole.brands}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Materials by Status</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Approved:</span>
                      <span className="font-semibold text-green-600">{materialsByStatus.approved}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Under Review:</span>
                      <span className="font-semibold text-yellow-600">{materialsByStatus.under_review}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Submitted:</span>
                      <span className="font-semibold text-blue-600">{materialsByStatus.submitted}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Need Changes:</span>
                      <span className="font-semibold text-red-600">{materialsByStatus.requires_changes}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}