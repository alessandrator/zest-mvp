'use client'

import { useState } from 'react'
import { Header } from '@/components/Header'
import { Tab } from '@/components/Tab'
import { Table } from '@/components/Table'
import { Notification } from '@/components/Notification'
import { Badge, StatusBadge } from '@/components/Badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

// Mock data for demonstration
const mockUsers = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Brand', status: 'active', campaigns: 5, lastLogin: '2024-01-15' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Student', status: 'active', campaigns: 12, lastLogin: '2024-01-14' },
  { id: 3, name: 'Mike Johnson', email: 'mike@example.com', role: 'Influencer', status: 'pending', campaigns: 8, lastLogin: '2024-01-13' },
  { id: 4, name: 'Sarah Connor', email: 'sarah@example.com', role: 'School', status: 'inactive', campaigns: 0, lastLogin: '2024-01-10' },
]

const mockCampaigns = [
  { id: 1, title: 'Summer Fashion Campaign', brand: 'Fashion Co.', status: 'active', applicants: 25, budget: '$5,000', endDate: '2024-02-15' },
  { id: 2, title: 'Tech Product Launch', brand: 'TechStart', status: 'pending', applicants: 12, budget: '$3,500', endDate: '2024-02-20' },
  { id: 3, title: 'Food & Beverage Promo', brand: 'FoodiesBrand', status: 'approved', applicants: 18, budget: '$2,800', endDate: '2024-02-25' },
]

const mockReports = [
  { metric: 'Total Users', value: '1,234', change: '+12%', trend: 'up' },
  { metric: 'Active Campaigns', value: '89', change: '+5%', trend: 'up' },
  { metric: 'Revenue This Month', value: '$45,678', change: '+18%', trend: 'up' },
  { metric: 'Platform Engagement', value: '94%', change: '-2%', trend: 'down' },
]

interface NotificationItem {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
  autoClose: boolean
  duration?: number
}

export default function SuperAdminPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    { id: '1', type: 'info', message: 'Welcome to the SuperAdmin Dashboard!', autoClose: false }
  ])

  const handleUserAction = (action: string, user: Record<string, unknown>) => {
    const newNotification: NotificationItem = {
      id: Date.now().toString(),
      type: 'success',
      message: `${action} action performed on user: ${user.name}`,
      autoClose: true
    }
    setNotifications(prev => [...prev, newNotification])
  }

  const handleCampaignAction = (action: string, campaign: Record<string, unknown>) => {
    const newNotification: NotificationItem = {
      id: Date.now().toString(),
      type: 'success',
      message: `${action} action performed on campaign: ${campaign.title}`,
      autoClose: true
    }
    setNotifications(prev => [...prev, newNotification])
  }

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  // Table configurations
  const userColumns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { 
      key: 'role', 
      label: 'Role',
      render: (value: unknown) => <Badge variant="secondary">{String(value)}</Badge>
    },
    { 
      key: 'status', 
      label: 'Status',
      render: (value: unknown) => <StatusBadge status={String(value) as 'active' | 'inactive' | 'pending' | 'approved' | 'rejected'} />
    },
    { key: 'campaigns', label: 'Campaigns', sortable: true },
    { key: 'lastLogin', label: 'Last Login', sortable: true },
  ]

  const userActions = [
    { 
      label: 'Edit', 
      onClick: (user: Record<string, unknown>) => handleUserAction('Edit', user),
      variant: 'outline' as const
    },
    { 
      label: 'Suspend', 
      onClick: (user: Record<string, unknown>) => handleUserAction('Suspend', user),
      variant: 'secondary' as const,
      disabled: (user: Record<string, unknown>) => user.status === 'inactive'
    }
  ]

  const campaignColumns = [
    { key: 'title', label: 'Campaign Title', sortable: true },
    { key: 'brand', label: 'Brand', sortable: true },
    { 
      key: 'status', 
      label: 'Status',
      render: (value: unknown) => <StatusBadge status={String(value) as 'active' | 'inactive' | 'pending' | 'approved' | 'rejected'} />
    },
    { key: 'applicants', label: 'Applicants', sortable: true },
    { key: 'budget', label: 'Budget', sortable: true },
    { key: 'endDate', label: 'End Date', sortable: true },
  ]

  const campaignActions = [
    { 
      label: 'View', 
      onClick: (campaign: Record<string, unknown>) => handleCampaignAction('View', campaign),
      variant: 'outline' as const
    },
    { 
      label: 'Approve', 
      onClick: (campaign: Record<string, unknown>) => handleCampaignAction('Approve', campaign),
      variant: 'primary' as const,
      disabled: (campaign: Record<string, unknown>) => campaign.status === 'approved'
    },
    { 
      label: 'Reject', 
      onClick: (campaign: Record<string, unknown>) => handleCampaignAction('Reject', campaign),
      variant: 'secondary' as const
    }
  ]

  const tabItems = [
    {
      id: 'overview',
      label: 'Overview',
      content: (
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mockReports.map((report, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    {report.metric}
                  </CardTitle>
                  <span className={`text-xs ${report.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {report.trend === 'up' ? '↗' : '↘'}
                  </span>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{report.value}</div>
                  <p className={`text-xs ${report.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {report.change} from last month
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button className="w-full" onClick={() => handleUserAction('Create New User', { name: 'New User' })}>
                  Add User
                </Button>
                <Button variant="outline" className="w-full" onClick={() => handleCampaignAction('Create Campaign', { title: 'New Campaign' })}>
                  New Campaign
                </Button>
                <Button variant="outline" className="w-full">
                  View Reports
                </Button>
                <Button variant="outline" className="w-full">
                  System Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    },
    {
      id: 'users',
      label: 'User Management',
      badge: mockUsers.length,
      content: (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Platform Users</h2>
            <Button onClick={() => handleUserAction('Create', { name: 'New User' })}>
              Add New User
            </Button>
          </div>
          <Table
            columns={userColumns}
            data={mockUsers}
            actions={userActions}
          />
        </div>
      )
    },
    {
      id: 'campaigns',
      label: 'Campaign Management',
      badge: mockCampaigns.length,
      content: (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Active Campaigns</h2>
            <Button onClick={() => handleCampaignAction('Create', { title: 'New Campaign' })}>
              Create Campaign
            </Button>
          </div>
          <Table
            columns={campaignColumns}
            data={mockCampaigns}
            actions={campaignActions}
          />
        </div>
      )
    },
    {
      id: 'analytics',
      label: 'Analytics',
      content: (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Platform Analytics</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>User Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <p>📊 Chart placeholder</p>
                  <p className="text-sm">User growth analytics would be displayed here</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Campaign Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <p>📈 Chart placeholder</p>
                  <p className="text-sm">Campaign performance metrics would be displayed here</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    },
    {
      id: 'settings',
      label: 'System Settings',
      content: (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">System Configuration</h2>
          
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Platform Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Maintenance Mode</span>
                  <Button variant="outline" size="sm">Toggle</Button>
                </div>
                <div className="flex justify-between items-center">
                  <span>User Registration</span>
                  <Button variant="outline" size="sm">Configure</Button>
                </div>
                <div className="flex justify-between items-center">
                  <span>Email Notifications</span>
                  <Button variant="outline" size="sm">Manage</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Super Admin Dashboard" />
      
      {/* Notifications */}
      <div className="fixed top-20 right-4 z-50 space-y-2 max-w-sm w-full">
        {notifications.map((notification) => (
          <Notification
            key={notification.id}
            {...notification}
            onClose={() => removeNotification(notification.id)}
          />
        ))}
      </div>
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-dark mb-2">Super Admin Dashboard</h1>
          <p className="text-gray-600">Manage all aspects of the ZEST platform from this central hub.</p>
        </div>

        <Tab 
          tabs={tabItems} 
          defaultTab="overview"
          onTabChange={(tabId) => {
            const notification: NotificationItem = {
              id: Date.now().toString(),
              type: 'info',
              message: `Switched to ${tabId} tab`,
              autoClose: true,
              duration: 2000
            }
            setNotifications(prev => [...prev, notification])
          }}
        />
      </div>
    </div>
  )
}