import { Header } from '@/components/Header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/Badge'

// Mock data for admin dashboard
const mockStats = [
  { label: 'Pending Approvals', value: '23', color: 'warning' },
  { label: 'Active Users', value: '1,156', color: 'success' },
  { label: 'Flagged Content', value: '7', color: 'error' },
  { label: 'Support Tickets', value: '12', color: 'info' },
]

const mockTasks = [
  { id: 1, title: 'Review campaign: "Summer Fashion 2024"', priority: 'high', type: 'Campaign Review' },
  { id: 2, title: 'Approve user registration: jane.doe@university.edu', priority: 'medium', type: 'User Management' },
  { id: 3, title: 'Investigate reported content violation', priority: 'high', type: 'Content Moderation' },
  { id: 4, title: 'Update platform policies', priority: 'low', type: 'Documentation' },
]

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Admin Dashboard" />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-dark mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage platform operations and moderate content.</p>
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
                        <Badge 
                          variant={stat.color as 'warning' | 'success' | 'error' | 'info'} 
                        >
                          {stat.color === 'warning' ? '⚠️' : stat.color === 'success' ? '✅' : stat.color === 'error' ? '🚨' : 'ℹ️'}
                        </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pending Tasks */}
          <Card>
            <CardHeader>
              <CardTitle>Pending Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockTasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{task.title}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="secondary" size="sm">{task.type}</Badge>
                        <Badge 
                          variant={task.priority === 'high' ? 'error' : task.priority === 'medium' ? 'warning' : 'secondary'} 
                          size="sm"
                        >
                          {task.priority}
                        </Badge>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">Review</Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4">
                <Button className="w-full justify-start">
                  👥 User Management
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  📋 Campaign Reviews
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  🛡️ Content Moderation
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  📊 Analytics & Reports
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  ⚙️ Platform Settings
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  💬 Support Center
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}