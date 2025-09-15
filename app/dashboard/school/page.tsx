import { redirect } from 'next/navigation'
import { Navbar } from '@/components/layouts/navbar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { getCurrentUser } from '@/lib/auth'
import Link from 'next/link'
import { GraduationCap, Users, BarChart3, FileText, Shield, Calendar } from 'lucide-react'

export default async function SchoolDashboard() {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/login')
  }

  if (user.role !== 'school_admin' && user.role !== 'super_admin') {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-dark mb-2">
            School Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Manage student activities and school partnerships
          </p>
        </div>

        {/* School Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <GraduationCap className="w-4 h-4 mr-2" />
                Active Students
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-dark">156</div>
              <p className="text-sm text-gray-600">+12 this month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <Users className="w-4 h-4 mr-2" />
                Campaign Participations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-dark">47</div>
              <p className="text-sm text-gray-600">This semester</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <BarChart3 className="w-4 h-4 mr-2" />
                Student Earnings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-dark">$8.2K</div>
              <p className="text-sm text-gray-600">Total this year</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <Shield className="w-4 h-4 mr-2" />
                Success Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-dark">87%</div>
              <p className="text-sm text-gray-600">Campaign completion</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Student Management */}
          <Card>
            <CardHeader>
              <CardTitle>Student Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" asChild>
                <Link href="/dashboard/school/students">
                  <GraduationCap className="w-4 h-4 mr-2" />
                  View All Students
                </Link>
              </Button>
              
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/dashboard/school/activities">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Student Activities
                </Link>
              </Button>
              
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/dashboard/school/performance">
                  <FileText className="w-4 h-4 mr-2" />
                  Performance Reports
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* School Programs */}
          <Card>
            <CardHeader>
              <CardTitle>School Programs</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/dashboard/school/partnerships">
                  <Users className="w-4 h-4 mr-2" />
                  Brand Partnerships
                </Link>
              </Button>
              
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/dashboard/school/events">
                  <Calendar className="w-4 h-4 mr-2" />
                  School Events
                </Link>
              </Button>
              
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/dashboard/school/settings">
                  <Shield className="w-4 h-4 mr-2" />
                  School Settings
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Student Activity Feed */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Student Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3 p-4 bg-green-50 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-dark">
                    Student completed campaign successfully
                  </p>
                  <p className="text-xs text-gray-500">&quot;Eco Brand Campaign&quot; 2 hours ago</p>
                </div>
                <Button size="sm" variant="outline" asChild>
                  <Link href="/dashboard/school/students/emma">View</Link>
                </Button>
              </div>
              
              <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-dark">
                    New student registered
                  </p>
                  <p className="text-xs text-gray-500">Michael Chen joined the platform 1 day ago</p>
                </div>
                <Button size="sm" variant="outline" asChild>
                  <Link href="/dashboard/school/students/michael">Review</Link>
                </Button>
              </div>
              
              <div className="flex items-start space-x-3 p-4 bg-primary/10 rounded-lg">
                <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-dark">
                    School partnership opportunity
                  </p>
                  <p className="text-xs text-gray-500">TechStart Inc. wants to partner with our school 3 days ago</p>
                </div>
                <Button size="sm" variant="outline" asChild>
                  <Link href="/dashboard/school/partnerships/techstart">Review</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}