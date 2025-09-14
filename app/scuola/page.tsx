import { Header } from '@/components/Header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/Badge'

// Mock data for school dashboard
const mockStudents = [
  { id: 1, name: 'Alice Johnson', email: 'alice@university.edu', status: 'active', campaigns: 3, earnings: '$450' },
  { id: 2, name: 'Bob Smith', email: 'bob@university.edu', status: 'active', campaigns: 1, earnings: '$150' },
  { id: 3, name: 'Carol Davis', email: 'carol@university.edu', status: 'pending', campaigns: 0, earnings: '$0' },
]

const mockStats = [
  { label: 'Enrolled Students', value: '156', icon: '🎓' },
  { label: 'Active Participants', value: '89', icon: '👥' },
  { label: 'Total Earnings', value: '$8,450', icon: '💰' },
  { label: 'Partnerships', value: '12', icon: '🤝' },
]

const mockPrograms = [
  { id: 1, name: 'Digital Marketing Workshop', participants: 25, status: 'ongoing', startDate: '2024-01-15' },
  { id: 2, name: 'Content Creation Bootcamp', participants: 18, status: 'upcoming', startDate: '2024-02-01' },
  { id: 3, name: 'Influencer Ethics Seminar', participants: 32, status: 'completed', startDate: '2024-01-01' },
]

export default function ScuolaPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="School/Institute Dashboard" />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-dark mb-2">School/Institute Dashboard</h1>
          <p className="text-gray-600">Manage student participation and educational partnerships.</p>
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Student Management */}
          <Card>
            <CardHeader>
              <CardTitle>Student Participants</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockStudents.map((student) => (
                  <div key={student.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{student.name}</p>
                      <p className="text-xs text-gray-500">{student.email}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge 
                          variant={student.status === 'active' ? 'success' : student.status === 'pending' ? 'warning' : 'secondary'} 
                          size="sm"
                        >
                          {student.status}
                        </Badge>
                        <span className="text-xs text-gray-500">{student.campaigns} campaigns</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{student.earnings}</p>
                      <Button size="sm" variant="outline">View</Button>
                    </div>
                  </div>
                ))}
              </div>
              <Button className="w-full mt-4">Invite New Students</Button>
            </CardContent>
          </Card>

          {/* Educational Programs */}
          <Card>
            <CardHeader>
              <CardTitle>Educational Programs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockPrograms.map((program) => (
                  <div key={program.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-dark text-sm">{program.name}</h3>
                      <Badge 
                        variant={
                          program.status === 'ongoing' ? 'success' : 
                          program.status === 'upcoming' ? 'warning' : 'secondary'
                        }
                        size="sm"
                      >
                        {program.status}
                      </Badge>
                    </div>
                    
                    <div className="text-sm text-gray-600 mb-3">
                      <div>👥 {program.participants} participants</div>
                      <div>📅 Start: {program.startDate}</div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">Manage</Button>
                      <Button size="sm" variant="outline">Reports</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Institute Management</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button className="w-full">
                📋 Create Program
              </Button>
              <Button variant="outline" className="w-full">
                👥 Student Directory
              </Button>
              <Button variant="outline" className="w-full">
                📊 Performance Reports
              </Button>
              <Button variant="outline" className="w-full">
                🤝 Partnership Requests
              </Button>
              <Button variant="outline" className="w-full">
                📚 Course Materials
              </Button>
              <Button variant="outline" className="w-full">
                💬 Communication Hub
              </Button>
              <Button variant="outline" className="w-full">
                ⚙️ Institute Settings
              </Button>
              <Button variant="outline" className="w-full">
                🎓 Certification
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}