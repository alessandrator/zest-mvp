'use client'

import { User } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { 
  BarChart3, 
  Eye, 
  Heart, 
  Euro, 
  TrendingUp, 
  Users, 
  Calendar,
  Download,
  ExternalLink,
  Play,
  CheckCircle
} from 'lucide-react'

interface InfluencerDashboardProps {
  user: User
}

// Demo data - in real implementation, this would come from the backend
const demoData = {
  // Hero/Overview metrics
  overview: {
    activeCampaigns: 3,
    votesExpressed: 127,
    averageEngagement: '4.2%',
    paymentsReceived: 2450
  },
  // Recent campaigns
  campaigns: [
    {
      id: '1',
      title: 'Summer Fashion Collection 2024',
      brand: 'FashionCorp',
      status: 'active',
      deadline: '2024-02-15',
      budget: '€500-800',
      description: 'Promote summer fashion collection through Instagram posts and stories'
    },
    {
      id: '2', 
      title: 'Tech Gadget Review',
      brand: 'TechGadgets',
      status: 'completed',
      deadline: '2024-01-30',
      budget: '€300-500',
      description: 'Create video review of new smartphone model'
    },
    {
      id: '3',
      title: 'Healthy Lifestyle Campaign',
      brand: 'HealthCorp',
      status: 'pending',
      deadline: '2024-02-20',
      budget: '€200-400',
      description: 'Share healthy meal preparation content'
    }
  ],
  // Recent votes
  votes: [
    {
      id: '1',
      campaign: 'Winter Accessories Line',
      date: '2024-01-15',
      rating: 5,
      type: 'Product Quality',
      comment: 'Excellent quality materials and design'
    },
    {
      id: '2',
      campaign: 'Gaming Setup Review',
      date: '2024-01-12',
      rating: 4,
      type: 'Brand Collaboration',
      comment: 'Great brand communication and support'
    },
    {
      id: '3',
      campaign: 'Food Delivery Service',
      date: '2024-01-10',
      rating: 3,
      type: 'Campaign Briefing',
      comment: 'Good brief but could be more detailed'
    }
  ],
  // Payment history
  payments: [
    {
      id: '1',
      campaign: 'Autumn Collection Promo',
      amount: 750,
      status: 'completed',
      date: '2024-01-20',
      paymentMethod: 'Bank Transfer'
    },
    {
      id: '2',
      campaign: 'Beauty Product Review',
      amount: 500,
      status: 'completed', 
      date: '2024-01-15',
      paymentMethod: 'PayPal'
    },
    {
      id: '3',
      campaign: 'Fitness App Promotion',
      amount: 1200,
      status: 'pending',
      date: '2024-01-25',
      paymentMethod: 'Bank Transfer'
    }
  ]
}

export function InfluencerDashboard({ user }: InfluencerDashboardProps) {
  return (
    <div className="min-h-screen bg-zest-yellow">
      {/* Header with Navigation */}
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

            {/* Navigation Menu */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link 
                href="#campagne" 
                className="text-zest-black hover:text-gray-600 font-medium transition-colors"
              >
                Campagne
              </Link>
              <Link 
                href="#voti" 
                className="text-zest-black hover:text-gray-600 font-medium transition-colors"
              >
                Voti
              </Link>
              <Link 
                href="#report" 
                className="text-zest-black hover:text-gray-600 font-medium transition-colors"
              >
                Report
              </Link>
              <Link 
                href="#pagamenti" 
                className="text-zest-black hover:text-gray-600 font-medium transition-colors"
              >
                Pagamenti
              </Link>
              <Link 
                href="/dashboard/profile" 
                className="text-zest-black hover:text-gray-600 font-medium transition-colors"
              >
                Profilo
              </Link>
              <Button variant="outline" size="sm" asChild>
                <Link href="/logout">Logout</Link>
              </Button>
            </nav>

            {/* Mobile menu button */}
            <Button variant="ghost" className="md:hidden">
              <Users className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Title */}
        <div className="mb-8">
          <h1 className="text-4xl font-stencil font-bold text-zest-black mb-2">
            Influencer Dashboard
          </h1>
          <p className="text-zest-black/70 text-lg">
            Benvenuto, {user.profile.first_name}! Gestisci le tue campagne e monitora le performance.
          </p>
        </div>

        {/* Hero/Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white border-2 border-zest-black">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Campagne Attive
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-stencil font-bold text-zest-black">
                {demoData.overview.activeCampaigns}
              </div>
              <p className="text-sm text-gray-600">In corso questo mese</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-2 border-zest-black">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <Heart className="h-4 w-4 mr-2" />
                Voti Espressi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-stencil font-bold text-zest-black">
                {demoData.overview.votesExpressed}
              </div>
              <p className="text-sm text-gray-600">Totale valutazioni</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-2 border-zest-black">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <TrendingUp className="h-4 w-4 mr-2" />
                Engagement Medio
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-stencil font-bold text-zest-black">
                {demoData.overview.averageEngagement}
              </div>
              <p className="text-sm text-gray-600">Ultimi 30 giorni</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-2 border-zest-black">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <Euro className="h-4 w-4 mr-2" />
                Pagamenti Ricevuti
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-stencil font-bold text-zest-black">
                €{demoData.overview.paymentsReceived}
              </div>
              <p className="text-sm text-gray-600">Totale guadagni</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Campagne Section */}
          <Card className="bg-white border-2 border-zest-black" id="campagne">
            <CardHeader>
              <CardTitle className="font-stencil text-xl text-zest-black flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Le Tue Campagne
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {demoData.campaigns.map((campaign) => (
                  <div 
                    key={campaign.id} 
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-zest-black">{campaign.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        campaign.status === 'active' 
                          ? 'bg-green-100 text-green-800'
                          : campaign.status === 'completed'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {campaign.status === 'active' ? 'Attiva' :
                         campaign.status === 'completed' ? 'Completata' : 'In Attesa'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{campaign.brand}</p>
                    <p className="text-sm text-gray-700 mb-3">{campaign.description}</p>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Scadenza: {campaign.deadline}</span>
                      <span className="font-medium text-zest-black">{campaign.budget}</span>
                    </div>
                    <div className="flex gap-2 mt-3">
                      {campaign.status === 'pending' ? (
                        <Button size="sm" className="bg-zest-yellow text-zest-black hover:bg-yellow-400">
                          <Play className="h-4 w-4 mr-1" />
                          Partecipa
                        </Button>
                      ) : (
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          Visualizza
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Voti Espressi Section */}
          <Card className="bg-white border-2 border-zest-black" id="voti">
            <CardHeader>
              <CardTitle className="font-stencil text-xl text-zest-black flex items-center">
                <Heart className="h-5 w-5 mr-2" />
                Voti Espressi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {demoData.votes.map((vote) => (
                  <div 
                    key={vote.id} 
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-zest-black">{vote.campaign}</h3>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Heart 
                            key={i} 
                            className={`h-4 w-4 ${
                              i < vote.rating ? 'text-red-500 fill-current' : 'text-gray-300'
                            }`} 
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{vote.type} • {vote.date}</p>
                    <p className="text-sm text-gray-700">{vote.comment}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Report Section */}
        <Card className="bg-white border-2 border-zest-black mb-8" id="report">
          <CardHeader>
            <CardTitle className="font-stencil text-xl text-zest-black flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Report Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              {/* Engagement Chart Placeholder */}
              <div className="bg-gray-50 rounded-lg p-6 text-center">
                <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <h3 className="font-semibold text-zest-black mb-2">Engagement</h3>
                <p className="text-sm text-gray-600">Trend ultimi 30 giorni</p>
                <div className="mt-4 text-2xl font-bold text-green-600">+12%</div>
              </div>
              
              {/* Reach Chart Placeholder */}
              <div className="bg-gray-50 rounded-lg p-6 text-center">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <h3 className="font-semibold text-zest-black mb-2">Reach</h3>
                <p className="text-sm text-gray-600">Impression totali</p>
                <div className="mt-4 text-2xl font-bold text-blue-600">45.2K</div>
              </div>
              
              {/* Conversions Placeholder */}
              <div className="bg-gray-50 rounded-lg p-6 text-center">
                <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <h3 className="font-semibold text-zest-black mb-2">Conversioni</h3>
                <p className="text-sm text-gray-600">Click to action</p>
                <div className="mt-4 text-2xl font-bold text-purple-600">8.4%</div>
              </div>
            </div>
            
            {/* Chart Placeholder */}
            <div className="mt-6 bg-gray-50 rounded-lg p-8 text-center">
              <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">
                Grafico dettagliato delle performance - Sarà integrato con i dati reali dal backend
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Pagamenti Section */}
        <Card className="bg-white border-2 border-zest-black" id="pagamenti">
          <CardHeader>
            <CardTitle className="font-stencil text-xl text-zest-black flex items-center">
              <Euro className="h-5 w-5 mr-2" />
              Storico Pagamenti
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {demoData.payments.map((payment) => (
                <div 
                  key={payment.id} 
                  className="border border-gray-200 rounded-lg p-4 flex justify-between items-center"
                >
                  <div>
                    <h3 className="font-semibold text-zest-black">{payment.campaign}</h3>
                    <p className="text-sm text-gray-600">
                      {payment.date} • {payment.paymentMethod}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-zest-black">€{payment.amount}</div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        payment.status === 'completed' 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {payment.status === 'completed' ? 'Completato' : 'In Sospeso'}
                      </span>
                      {payment.status === 'completed' && (
                        <Button size="sm" variant="ghost">
                          <Download className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 flex gap-3">
              <Button className="bg-zest-yellow text-zest-black hover:bg-yellow-400">
                Richiedi Pagamento
              </Button>
              <Button variant="outline">
                <ExternalLink className="h-4 w-4 mr-2" />
                Sfoglia Storico Completo
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
      
      {/* Footer with integration notes */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-500">
            {/* 
              INTEGRATION NOTES FOR BACKEND DEVELOPMENT:
              
              1. Replace demoData with real API calls to fetch:
                 - User campaign applications and their status
                 - Vote/rating history for completed campaigns  
                 - Performance metrics (engagement, reach, conversions)
                 - Payment history and pending payments
              
              2. Implement real-time updates for:
                 - Campaign status changes
                 - New payment notifications
                 - Performance metric updates
              
              3. Add authentication checks for all API endpoints
              
              4. Implement proper error handling and loading states
              
              5. Add pagination for large datasets (payments, votes history)
              
              6. Connect chart components with real analytics data
              
              7. Implement file upload for campaign deliverables
              
              8. Add notification system for campaign updates
            */}
            <p className="text-zest-black">
              Dashboard pronta per integrazione backend • 
              <Link href="/dashboard" className="underline hover:no-underline ml-1">
                Torna alla dashboard generale
              </Link>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}