import { Header } from '@/components/Header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/Badge'

// Mock data for student dashboard
const mockApplications = [
  { id: 1, campaign: 'Summer Fashion Collection 2024', brand: 'Fashion Co.', status: 'pending', appliedDate: '2024-01-10', reward: '$200' },
  { id: 2, campaign: 'Tech Product Launch', brand: 'TechStart', status: 'accepted', appliedDate: '2024-01-08', reward: '$150' },
  { id: 3, campaign: 'Eco-Friendly Product Line', brand: 'GreenBrand', status: 'completed', appliedDate: '2024-01-05', reward: '$300' },
]

const mockStats = [
  { label: 'Applications Sent', value: '12', icon: '📝' },
  { label: 'Active Projects', value: '3', icon: '🎯' },
  { label: 'Total Earnings', value: '$850', icon: '💰' },
  { label: 'Success Rate', value: '75%', icon: '📊' },
]

const mockAvailableCampaigns = [
  { id: 1, title: 'Back to School Fashion', brand: 'StyleCorp', reward: '$180', deadline: '2024-02-15', applicants: 23 },
  { id: 2, title: 'Fitness App Promotion', brand: 'FitTech', reward: '$120', deadline: '2024-02-20', applicants: 15 },
  { id: 3, title: 'Sustainable Living Tips', brand: 'EcoLife', reward: '$250', deadline: '2024-02-25', applicants: 8 },
]

export default function StudentePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Student Dashboard" />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-dark mb-2">Student Creator Dashboard</h1>
          <p className="text-gray-600">Apply to campaigns and showcase your creativity to earn money.</p>
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
          {/* Available Campaigns */}
          <div className="lg:col-span-2">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Available Campaigns</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockAvailableCampaigns.map((campaign) => (
                    <div key={campaign.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-dark">{campaign.title}</h3>
                          <p className="text-sm text-gray-600">by {campaign.brand}</p>
                        </div>
                        <Badge variant="success">{campaign.reward}</Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                        <div>📅 Deadline: {campaign.deadline}</div>
                        <div>👥 {campaign.applicants} applicants</div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button size="sm">Apply Now</Button>
                        <Button size="sm" variant="outline">View Details</Button>
                      </div>
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-4" variant="outline">
                  Browse All Campaigns
                </Button>
              </CardContent>
            </Card>

            {/* My Applications */}
            <Card>
              <CardHeader>
                <CardTitle>My Applications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockApplications.map((application) => (
                    <div key={application.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-dark text-sm">{application.campaign}</h3>
                          <p className="text-xs text-gray-600">by {application.brand}</p>
                        </div>
                        <Badge 
                          variant={
                            application.status === 'completed' ? 'success' : 
                            application.status === 'accepted' ? 'info' : 
                            application.status === 'pending' ? 'warning' : 'secondary'
                          }
                          size="sm"
                        >
                          {application.status}
                        </Badge>
                      </div>
                      
                      <div className="text-sm text-gray-600 mb-3">
                        <div>💰 Reward: {application.reward}</div>
                        <div>📅 Applied: {application.appliedDate}</div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">View</Button>
                        {application.status === 'accepted' && (
                          <Button size="sm">Submit Work</Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Profile & Tools */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button className="w-full justify-start">
                    👤 Update Profile
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    📸 Portfolio
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    💰 Earnings & Payments
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    📊 Performance Analytics
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    💬 Messages
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    🎓 Learning Resources
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Profile Completion</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span>Profile</span>
                    <span className="text-green-600">✓ Complete</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span>Portfolio</span>
                    <span className="text-yellow-600">⚠ Incomplete</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span>Skills</span>
                    <span className="text-green-600">✓ Complete</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span>Verification</span>
                    <span className="text-red-600">✗ Pending</span>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="bg-gray-200 rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">75% complete</p>
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
                    <span>Application approved for Tech Launch</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-blue-600">📩</span>
                    <span>New message from Fashion Co.</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-purple-600">💰</span>
                    <span>Payment received: $300</span>
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