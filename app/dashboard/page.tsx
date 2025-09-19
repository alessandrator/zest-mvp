import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { getCurrentUser } from '@/lib/auth'
import Link from 'next/link'
import { Bell, Settings, User, Award, Target, Eye, Play, CheckCircle, AlertCircle } from 'lucide-react'

export default async function UserDashboard() {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/login')
  }

  // Redirect to role-specific dashboard if available
  if (user.role === 'super_admin') {
    redirect('/dashboard/admin')
  }
  if (user.role === 'brand') {
    redirect('/dashboard/brand')
  }
  if (user.role === 'school_admin') {
    redirect('/dashboard/school')
  }
  if (user.role === 'influencer') {
    redirect('/dashboard/influencer')
  }

  /* 
   * ZEST User Dashboard
   * 
   * Backend Integration Notes:
   * - Replace demo data with real API calls
   * - Connect to campaigns, badges, notifications, and preferences endpoints
   * - Implement real-time updates for notifications
   * - Add loading states and error handling
   */

  // Demo data - replace with real API calls
  const demoData = {
    profileStatus: 85, // percentage complete
    activeCampaigns: 3,
    badgesEarned: 5,
    unreadNotifications: 2,
    campaigns: [
      { id: 1, title: "TechFlow App Launch", status: "active", action: "participate" },
      { id: 2, title: "Summer Fashion Week", status: "pending", action: "view" },
      { id: 3, title: "Sustainable Products", status: "completed", action: "view" }
    ],
    badges: [
      { id: 1, name: "First Campaign", description: "Completed your first campaign", earned: true },
      { id: 2, name: "Social Media Star", description: "Reached 1000 followers", earned: true },
      { id: 3, name: "Content Creator", description: "Created 10 posts", earned: false },
      { id: 4, name: "Brand Ambassador", description: "Worked with 5 brands", earned: false }
    ],
    notifications: [
      { id: 1, title: "New Campaign Match", message: "You have a new campaign match", read: false, time: "2 hours ago" },
      { id: 2, title: "Application Approved", message: "Your application was approved", read: false, time: "1 day ago" },
      { id: 3, title: "Profile Updated", message: "Your profile was successfully updated", read: true, time: "3 days ago" }
    ],
    preferences: {
      emailNotifications: true,
      pushNotifications: true,
      profileVisibility: "public",
      theme: "light"
    }
  }

  return (
    <div className="min-h-screen bg-zest-yellow">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="bg-zest-yellow rounded-lg p-2">
                <span className="text-zest-black font-stencil font-bold text-xl">Z</span>
              </div>
              <span className="font-stencil font-bold text-xl text-zest-black">ZEST</span>
            </Link>

            {/* Title */}
            <h1 className="text-2xl font-stencil font-bold text-zest-black">User Dashboard</h1>

            {/* Navigation Menu */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/dashboard/profile" className="flex items-center space-x-1 text-zest-black hover:text-gray-600 transition-colors">
                <User size={16} />
                <span>Profilo</span>
              </Link>
              <Link href="/dashboard/notifications" className="flex items-center space-x-1 text-zest-black hover:text-gray-600 transition-colors relative">
                <Bell size={16} />
                <span>Notifiche</span>
                {demoData.unreadNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {demoData.unreadNotifications}
                  </span>
                )}
              </Link>
              <Link href="/campaigns" className="flex items-center space-x-1 text-zest-black hover:text-gray-600 transition-colors">
                <Target size={16} />
                <span>Campagne</span>
              </Link>
              <Link href="/dashboard/badges" className="flex items-center space-x-1 text-zest-black hover:text-gray-600 transition-colors">
                <Award size={16} />
                <span>Badge</span>
              </Link>
              <Link href="/dashboard/preferences" className="flex items-center space-x-1 text-zest-black hover:text-gray-600 transition-colors">
                <Settings size={16} />
                <span>Preferenze</span>
              </Link>
              <Button variant="outline" size="sm" asChild>
                <Link href="/logout">Logout</Link>
              </Button>
            </nav>
          </div>
        </div>
      </header>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero/Overview Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-stencil font-bold text-zest-black mb-6">Panoramica</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {/* Profile Status Card */}
            <Card className="bg-white border-0 shadow-md">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                  <User size={16} className="mr-2" />
                  Stato Profilo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-zest-black mb-2">{demoData.profileStatus}%</div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-zest-yellow rounded-full h-2" 
                    style={{ width: `${demoData.profileStatus}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-600 mt-2">Completo</p>
              </CardContent>
            </Card>
            
            {/* Active Campaigns Card */}
            <Card className="bg-white border-0 shadow-md">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                  <Target size={16} className="mr-2" />
                  Campagne Attive
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-zest-black">{demoData.activeCampaigns}</div>
                <p className="text-xs text-gray-600">In corso</p>
              </CardContent>
            </Card>
            
            {/* Badges Earned Card */}
            <Card className="bg-white border-0 shadow-md">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                  <Award size={16} className="mr-2" />
                  Badge Ottenuti
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-zest-black">{demoData.badgesEarned}</div>
                <p className="text-xs text-gray-600">Totali</p>
              </CardContent>
            </Card>
            
            {/* Recent Notifications Card */}
            <Card className="bg-white border-0 shadow-md">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                  <Bell size={16} className="mr-2" />
                  Notifiche Recenti
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-zest-black">{demoData.unreadNotifications}</div>
                <p className="text-xs text-gray-600">Non lette</p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Campaigns Section */}
          <div>
            <h3 className="text-xl font-stencil font-bold text-zest-black mb-4">Le Mie Campagne</h3>
            <Card className="bg-white border-0 shadow-md">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {demoData.campaigns.map((campaign) => (
                    <div key={campaign.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-zest-black">{campaign.title}</h4>
                        <div className="flex items-center mt-1">
                          {campaign.status === 'active' && <CheckCircle size={14} className="text-green-500 mr-1" />}
                          {campaign.status === 'pending' && <AlertCircle size={14} className="text-yellow-500 mr-1" />}
                          {campaign.status === 'completed' && <CheckCircle size={14} className="text-blue-500 mr-1" />}
                          <span className="text-sm text-gray-600 capitalize">{campaign.status}</span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Eye size={14} className="mr-1" />
                          Visualizza
                        </Button>
                        {campaign.action === 'participate' && (
                          <Button size="sm">
                            <Play size={14} className="mr-1" />
                            Partecipa
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/campaigns">Visualizza Tutte le Campagne</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>


          {/* Badges Section */}
          <div>
            <h3 className="text-xl font-stencil font-bold text-zest-black mb-4">Badge e Obiettivi</h3>
            <Card className="bg-white border-0 shadow-md">
              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-4">
                  {demoData.badges.map((badge) => (
                    <div key={badge.id} className={`p-4 rounded-lg border ${badge.earned ? 'bg-zest-yellow/10 border-zest-yellow' : 'bg-gray-50 border-gray-200'}`}>
                      <div className="text-center">
                        <Award size={24} className={`mx-auto mb-2 ${badge.earned ? 'text-zest-yellow' : 'text-gray-400'}`} />
                        <h4 className="font-medium text-sm text-zest-black">{badge.name}</h4>
                        <p className="text-xs text-gray-600 mt-1">{badge.description}</p>
                        {badge.earned && (
                          <span className="inline-block mt-2 px-2 py-1 bg-zest-yellow text-zest-black text-xs rounded-full">
                            Ottenuto
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/dashboard/badges">Visualizza Tutti i Badge</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
 main
        </div>

        {/* Notifications and Preferences Section */}
        <div className="grid lg:grid-cols-2 gap-8 mt-8">
          {/* Notifications Section */}
          <div>
            <h3 className="text-xl font-stencil font-bold text-zest-black mb-4">Notifiche Recenti</h3>
            <Card className="bg-white border-0 shadow-md">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {demoData.notifications.map((notification) => (
                    <div key={notification.id} className={`p-4 rounded-lg border ${notification.read ? 'bg-gray-50 border-gray-200' : 'bg-zest-yellow/10 border-zest-yellow'}`}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-zest-black">{notification.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                          <span className="text-xs text-gray-500">{notification.time}</span>
                        </div>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-zest-yellow rounded-full"></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/dashboard/notifications">Visualizza Tutte le Notifiche</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Preferences Section */}
          <div>
            <h3 className="text-xl font-stencil font-bold text-zest-black mb-4">Preferenze Utente</h3>
            <Card className="bg-white border-0 shadow-md">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-zest-black">Notifiche Email</span>
                    <button className={`w-12 h-6 rounded-full transition-colors ${demoData.preferences.emailNotifications ? 'bg-zest-yellow' : 'bg-gray-300'}`}>
                      <div className={`w-5 h-5 bg-white rounded-full transition-transform ${demoData.preferences.emailNotifications ? 'translate-x-6' : 'translate-x-1'}`}></div>
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-zest-black">Notifiche Push</span>
                    <button className={`w-12 h-6 rounded-full transition-colors ${demoData.preferences.pushNotifications ? 'bg-zest-yellow' : 'bg-gray-300'}`}>
                      <div className={`w-5 h-5 bg-white rounded-full transition-transform ${demoData.preferences.pushNotifications ? 'translate-x-6' : 'translate-x-1'}`}></div>
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-zest-black">Visibilità Profilo</span>
                    <select className="border border-gray-200 rounded px-3 py-1 text-sm">
                      <option value="public">Pubblico</option>
                      <option value="private">Privato</option>
                      <option value="friends">Solo Amici</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-zest-black">Tema</span>
                    <select className="border border-gray-200 rounded px-3 py-1 text-sm">
                      <option value="light">Chiaro</option>
                      <option value="dark">Scuro</option>
                      <option value="auto">Automatico</option>
                    </select>
                  </div>
                </div>
                <div className="mt-6">
                  <Button className="w-full">Salva Preferenze</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}