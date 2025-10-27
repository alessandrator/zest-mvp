import { Header } from '@/components/Header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/Badge'

// Mock data for influencer dashboard
const mockCollaborations = [
  { id: 1, campaign: 'Luxury Skincare Campaign', brand: 'BeautyPro', status: 'active', followers: '50k', engagement: '4.2%', payout: '$1,200' },
  { id: 2, campaign: 'Fitness Equipment Review', brand: 'FitGear', status: 'completed', followers: '45k', engagement: '3.8%', payout: '$800' },
  { id: 3, campaign: 'Travel Accessories Showcase', brand: 'TravelLux', status: 'pending', followers: '52k', engagement: '4.5%', payout: '$950' },
]

const mockStats = [
  { label: 'Total Followers', value: '52.3K', icon: '👥' },
  { label: 'Engagement Rate', value: '4.2%', icon: '📊' },
  { label: 'Active Campaigns', value: '5', icon: '🎯' },
  { label: 'Total Earnings', value: '$12,450', icon: '💰' },
]

const mockOpportunities = [
  { id: 1, title: 'Premium Coffee Brand Partnership', brand: 'CoffeePro', tier: 'premium', followers: '40k+', payout: '$1,500' },
  { id: 2, title: 'Tech Gadget Review Series', brand: 'TechNova', tier: 'standard', followers: '30k+', payout: '$750' },
  { id: 3, title: 'Fashion Week Coverage', brand: 'StyleMag', tier: 'exclusive', followers: '50k+', payout: '$2,000' },
]

const mockPlatformStats = [
  { platform: 'Instagram', followers: '28.5K', engagement: '4.8%', growth: '+12%' },
  { platform: 'TikTok', followers: '18.2K', engagement: '6.2%', growth: '+25%' },
  { platform: 'YouTube', followers: '5.6K', engagement: '3.1%', growth: '+8%' },
]

export default function InfluencerPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Influencer Dashboard" />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-dark mb-2">Influencer Dashboard</h1>
          <p className="text-gray-600">Leverage your following to participate in exciting brand campaigns.</p>
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
          {/* Campaign Opportunities */}
          <div className="lg:col-span-2">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Campaign Opportunities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockOpportunities.map((opportunity) => (
                    <div key={opportunity.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-dark">{opportunity.title}</h3>
                          <p className="text-sm text-gray-600">by {opportunity.brand}</p>
                        </div>
                        <div className="text-right">
                          <Badge 
                            variant={
                              opportunity.tier === 'premium' ? 'info' :
                              opportunity.tier === 'exclusive' ? 'success' : 'secondary'
                            }
                            size="sm"
                          >
                            {opportunity.tier}
                          </Badge>
                          <p className="text-sm font-bold text-dark mt-1">{opportunity.payout}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                        <div>👥 Req. followers: {opportunity.followers}</div>
                        <div>💰 Payout: {opportunity.payout}</div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button size="sm">Apply Now</Button>
                        <Button size="sm" variant="outline">View Details</Button>
                      </div>
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-4" variant="outline">
                  Browse All Opportunities
                </Button>
              </CardContent>
            </Card>

            {/* Active Collaborations */}
            <Card>
              <CardHeader>
                <CardTitle>My Collaborations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockCollaborations.map((collab) => (
                    <div key={collab.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-dark text-sm">{collab.campaign}</h3>
                          <p className="text-xs text-gray-600">by {collab.brand}</p>
                        </div>
                        <Badge 
                          variant={
                            collab.status === 'completed' ? 'success' : 
                            collab.status === 'active' ? 'info' : 'warning'
                          }
                          size="sm"
                        >
                          {collab.status}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-2 text-xs text-gray-600 mb-3">
                        <div>👥 {collab.followers}</div>
                        <div>📊 {collab.engagement}</div>
                        <div>💰 {collab.payout}</div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">View</Button>
                        {collab.status === 'active' && (
                          <Button size="sm">Submit Content</Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Platform Analytics & Tools */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Platform Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockPlatformStats.map((platform, index) => (
                    <div key={index} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-sm">{platform.platform}</h4>
                        <span className={`text-xs ${platform.growth.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                          {platform.growth}
                        </span>
                      </div>
                      <div className="text-xs text-gray-600 space-y-1">
                        <div>👥 {platform.followers} followers</div>
                        <div>📊 {platform.engagement} engagement</div>
                      </div>
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-4" size="sm" variant="outline">
                  Connect More Platforms
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Influencer Tools</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button className="w-full justify-start" size="sm">
                    📊 Analytics Dashboard
                  </Button>
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    📸 Content Planner
                  </Button>
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    💰 Earnings Tracker
                  </Button>
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    🎯 Campaign Manager
                  </Button>
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    👥 Audience Insights
                  </Button>
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    📱 Social Media Kit
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Influencer Level</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl mb-2">⭐</div>
                  <h3 className="font-semibold text-dark">Gold Influencer</h3>
                  <p className="text-sm text-gray-600 mb-4">52.3K total followers</p>
                  
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span>Current Level</span>
                      <span className="font-medium">Gold</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Next Level</span>
                      <span className="font-medium">Platinum (100K)</span>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <div className="bg-gray-200 rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '52%' }}></div>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">47.7K to next level</p>
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