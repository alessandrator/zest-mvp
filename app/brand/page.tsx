import { Header } from '@/components/Header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/Badge'

// Mock data for brand dashboard
const mockCampaigns = [
  { id: 1, title: 'Summer Fashion Collection 2024', status: 'active', applicants: 45, budget: '$5,000', deadline: '2024-02-28' },
  { id: 2, title: 'Back to School Essentials', status: 'draft', applicants: 0, budget: '$3,200', deadline: '2024-03-15' },
  { id: 3, title: 'Eco-Friendly Product Line', status: 'completed', applicants: 32, budget: '$4,500', deadline: '2024-01-20' },
]

const mockStats = [
  { label: 'Active Campaigns', value: '3', icon: '📊' },
  { label: 'Total Applicants', value: '77', icon: '👥' },
  { label: 'Campaign Budget', value: '$12,700', icon: '💰' },
  { label: 'Avg. Engagement', value: '4.8%', icon: '📈' },
]

export default function BrandPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Brand Dashboard" />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-dark mb-2">Brand Dashboard</h1>
          <p className="text-gray-600">Create and manage your marketing campaigns with talented creators.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {mockStats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                    <p className="text-2xl font-bold text-dark">{stat.value}</p>
                  </div>
                  <span className="text-2xl">{stat.icon}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Active Campaigns */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Your Campaigns</CardTitle>
                <Button>Create New Campaign</Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockCampaigns.map((campaign) => (
                    <div key={campaign.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-dark">{campaign.title}</h3>
                        <Badge 
                          variant={
                            campaign.status === 'active' ? 'success' : 
                            campaign.status === 'draft' ? 'warning' : 'secondary'
                          }
                        >
                          {campaign.status}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                        <div>👥 {campaign.applicants} applicants</div>
                        <div>💰 {campaign.budget}</div>
                        <div>📅 Deadline: {campaign.deadline}</div>
                        <div>📊 Campaign ID: #{campaign.id}</div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">View Details</Button>
                        <Button size="sm" variant="outline">Edit</Button>
                        {campaign.status === 'active' && (
                          <Button size="sm" variant="outline">View Applications</Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions & Tools */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button className="w-full justify-start">
                    ➕ Create Campaign
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    👥 Browse Creators
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    📊 View Analytics
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    💬 Messages
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    💳 Billing & Payments
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center space-x-2">
                    <span className="text-green-600">✓</span>
                    <span>Campaign &quot;Summer Fashion&quot; approved</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-blue-600">📩</span>
                    <span>New application received</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-purple-600">👤</span>
                    <span>Profile updated successfully</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}