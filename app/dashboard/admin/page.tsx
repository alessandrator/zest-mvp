import { redirect } from 'next/navigation'
import { Navbar } from '@/components/layouts/navbar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { getCurrentUser } from '@/lib/auth'
import Link from 'next/link'
import { Users, Building, Target, Shield, Settings, BarChart3 } from 'lucide-react'

export default async function AdminDashboard() {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/login')
  }

  if (user.role !== 'super_admin') {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-dark mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">
            System overview and management controls
          </p>
        </div>

        {/* System Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <Users className="w-4 h-4 mr-2" />
                Total Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-dark">1,247</div>
              <p className="text-sm text-gray-600">+23 this week</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <Building className="w-4 h-4 mr-2" />
                Active Brands
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-dark">89</div>
              <p className="text-sm text-gray-600">+5 this month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <Target className="w-4 h-4 mr-2" />
                Total Campaigns
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-dark">342</div>
              <p className="text-sm text-gray-600">15 active</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <BarChart3 className="w-4 h-4 mr-2" />
                Platform Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-dark">$24.5K</div>
              <p className="text-sm text-gray-600">This month</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* User Management */}
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" asChild>
                <Link href="/dashboard/admin/users">
                  <Users className="w-4 h-4 mr-2" />
                  Manage All Users
                </Link>
              </Button>
              
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/dashboard/admin/brands">
                  <Building className="w-4 h-4 mr-2" />
                  Brand Verification
                </Link>
              </Button>
              
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/dashboard/admin/schools">
                  <Shield className="w-4 h-4 mr-2" />
                  School Management
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* System Controls */}
          <Card>
            <CardHeader>
              <CardTitle>System Controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/dashboard/admin/campaigns">
                  <Target className="w-4 h-4 mr-2" />
                  Monitor Campaigns
                </Link>
              </Button>
              
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/dashboard/admin/analytics">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Platform Analytics
                </Link>
              </Button>
              
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/dashboard/admin/settings">
                  <Settings className="w-4 h-4 mr-2" />
                  System Settings
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Admin Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Admin Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3 p-4 bg-red-50 rounded-lg">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-dark">
                    Campaign reported for review
                  </p>
                  <p className="text-xs text-gray-500">User flagged inappropriate content 1 hour ago</p>
                </div>
                <Button size="sm" variant="outline" asChild>
                  <Link href="/dashboard/admin/reports/1">Review</Link>
                </Button>
              </div>
              
              <div className="flex items-start space-x-3 p-4 bg-green-50 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-dark">
                    New brand verified successfully
                  </p>
                  <p className="text-xs text-gray-500">&quot;TechCorp Inc.&quot; approved 2 hours ago</p>
                </div>
                <Button size="sm" variant="outline" asChild>
                  <Link href="/dashboard/admin/brands/techcorp">View</Link>
                </Button>
              </div>
              
              <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-dark">
                    System maintenance completed
                  </p>
                  <p className="text-xs text-gray-500">Database optimization finished 1 day ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}