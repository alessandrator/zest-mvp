import { redirect } from 'next/navigation'
import { Navbar } from '@/components/layouts/navbar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CampaignAnalytics } from '@/components/ui/campaign-analytics'
import { getCurrentUser } from '@/lib/auth'
import Link from 'next/link'
import { Upload, Download, BarChart3, Users, Target, FileText } from 'lucide-react'

export default async function BrandDashboard() {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/login')
  }

  if (user.role !== 'brand' && user.role !== 'super_admin') {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-dark mb-2">
            Brand Dashboard
          </h1>
          <p className="text-gray-600">
            Manage your campaigns, view applications, and grow your brand presence
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <Target className="w-4 h-4 mr-2" />
                Active Campaigns
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-dark">3</div>
              <p className="text-sm text-gray-600">2 new applications</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <Users className="w-4 h-4 mr-2" />
                Creators Applied
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-dark">24</div>
              <p className="text-sm text-gray-600">This month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <BarChart3 className="w-4 h-4 mr-2" />
                Campaign Reach
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-dark">127K</div>
              <p className="text-sm text-gray-600">Total impressions</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <FileText className="w-4 h-4 mr-2" />
                Content Created
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-dark">18</div>
              <p className="text-sm text-gray-600">This month</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Campaign Management */}
          <Card>
            <CardHeader>
              <CardTitle>Campaign Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" asChild>
                <Link href="/dashboard/brand/campaigns/new">
                  <Target className="w-4 h-4 mr-2" />
                  Create New Campaign
                </Link>
              </Button>
              
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/dashboard/brand/campaigns">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  View All Campaigns
                </Link>
              </Button>
              
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/dashboard/brand/applications">
                  <Users className="w-4 h-4 mr-2" />
                  Review Applications
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* File Management */}
          <Card>
            <CardHeader>
              <CardTitle>File Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Upload className="w-4 h-4 mr-2" />
                Upload Campaign Assets
              </Button>
              
              <Button variant="outline" className="w-full justify-start">
                <Download className="w-4 h-4 mr-2" />
                Download Creator Content
              </Button>
              
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/dashboard/brand/files">
                  <FileText className="w-4 h-4 mr-2" />
                  Manage All Files
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Campaign Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3 p-4 bg-primary/5 rounded-lg">
                <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-dark">
                    New application for &quot;Summer Fashion Collection&quot;
                  </p>
                  <p className="text-xs text-gray-500">Sarah M. applied 2 hours ago</p>
                </div>
                <Button size="sm" variant="outline" asChild>
                  <Link href="/dashboard/brand/applications/1">Review</Link>
                </Button>
              </div>
              
              <div className="flex items-start space-x-3 p-4 bg-green-50 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-dark">
                    Campaign &quot;TechFlow App Launch&quot; completed
                  </p>
                  <p className="text-xs text-gray-500">Final deliverables received 1 day ago</p>
                </div>
                <Button size="sm" variant="outline" asChild>
                  <Link href="/dashboard/brand/campaigns/2">View</Link>
                </Button>
              </div>
              
              <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-dark">
                    New creator joined your watchlist
                  </p>
                  <p className="text-xs text-gray-500">Alex K. followed your brand 3 days ago</p>
                </div>
                <Button size="sm" variant="outline" asChild>
                  <Link href="/dashboard/brand/creators">View Profile</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Campaign Analytics */}
        <div className="mt-8">
          <CampaignAnalytics />
        </div>
      </div>
    </div>
  )
}