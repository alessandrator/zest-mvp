'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { User } from '@/types'
import { 
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js'
import { Bar, Doughnut } from 'react-chartjs-2'

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

interface BrandDashboardClientProps {
  user: User
}

// Demo data for charts
const votingData = {
  labels: ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno'],
  datasets: [
    {
      label: 'Voti Studenti',
      data: [65, 59, 80, 81, 56, 89],
      backgroundColor: '#fcff59',
      borderColor: '#1a1a1a',
      borderWidth: 1,
    },
    {
      label: 'Voti Influencer',
      data: [28, 48, 40, 19, 86, 47],
      backgroundColor: '#bfbfbf',
      borderColor: '#1a1a1a',
      borderWidth: 1,
    },
    {
      label: 'Voti Consumatori',
      data: [45, 25, 35, 75, 62, 38],
      backgroundColor: '#1a1a1a',
      borderColor: '#1a1a1a',
      borderWidth: 1,
    }
  ],
}

const engagementData = {
  labels: ['Alta', 'Media', 'Bassa'],
  datasets: [
    {
      data: [45, 35, 20],
      backgroundColor: ['#fcff59', '#bfbfbf', '#1a1a1a'],
      borderColor: '#1a1a1a',
      borderWidth: 2,
    },
  ],
}

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: false,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
    },
  },
}

const doughnutOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'bottom' as const,
    },
  },
}

// Demo campaigns data
const campaigns = [
  {
    id: 1,
    name: 'Summer Collection Launch',
    status: 'Attiva',
    type: 'Social Media',
    startDate: '15/06/2024',
    endDate: '30/08/2024',
    statusColor: 'bg-green-500'
  },
  {
    id: 2,
    name: 'Back to School Campaign',
    status: 'In preparazione',
    type: 'Content Creation',
    startDate: '01/09/2024',
    endDate: '15/09/2024',
    statusColor: 'bg-yellow-500'
  },
  {
    id: 3,
    name: 'Black Friday Promo',
    status: 'Conclusa',
    type: 'Influencer Marketing',
    startDate: '20/11/2023',
    endDate: '30/11/2023',
    statusColor: 'bg-gray-500'
  }
]

// Demo payments data
const payments = [
  {
    id: 1,
    campaign: 'Summer Collection Launch',
    amount: '€2,500',
    status: 'Pagato',
    date: '15/07/2024',
    statusColor: 'bg-green-500'
  },
  {
    id: 2,
    campaign: 'Back to School Campaign',
    amount: '€1,800',
    status: 'In attesa',
    date: '05/09/2024',
    statusColor: 'bg-yellow-500'
  }
]

// Demo contracts data
const contracts = [
  {
    id: 1,
    name: 'Contratto Summer Collection',
    status: 'Firmato',
    date: '10/06/2024',
    statusColor: 'bg-green-500'
  },
  {
    id: 2,
    name: 'Contratto Back to School',
    status: 'In revisione',
    date: '25/08/2024',
    statusColor: 'bg-yellow-500'
  }
]

export function BrandDashboardClient({ user }: BrandDashboardClientProps) {
  const [uploadFiles, setUploadFiles] = useState<File[]>([])

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setUploadFiles(Array.from(event.target.files))
    }
  }

  const handleLogout = () => {
    // TODO: Implement logout functionality
    window.location.href = '/login'
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fcff59' }}>
      {/* Header */}
      <header className="bg-white border-b border-gray-light/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="bg-brand-bg rounded-lg p-2">
                <span className="text-dark font-display font-bold text-xl">Z</span>
              </div>
              <span className="font-display font-bold text-xl text-dark">ZEST</span>
            </Link>

            {/* Title */}
            <h1 className="font-stencil text-2xl font-bold text-dark">
              Brand Dashboard
            </h1>

            {/* Navigation Menu */}
            <nav className="hidden md:flex items-center space-x-6">
              <a href="#campaigns" className="text-dark hover:text-primary transition-colors font-medium">
                Campagne
              </a>
              <a href="#models" className="text-dark hover:text-primary transition-colors font-medium">
                Modelli
              </a>
              <a href="#reports" className="text-dark hover:text-primary transition-colors font-medium">
                Report
              </a>
              <a href="#payments" className="text-dark hover:text-primary transition-colors font-medium">
                Pagamenti
              </a>
              <Link href="/dashboard/profile" className="text-dark hover:text-primary transition-colors font-medium">
                Profilo
              </Link>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </nav>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button variant="outline" size="sm">
                Menu
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Message */}
        <div className="mb-8">
          <h2 className="text-3xl font-display font-bold text-dark mb-2">
            Benvenuto, {user.profile.first_name}!
          </h2>
          <p className="text-gray-600">
            Gestisci le tue campagne e monitora le performance
          </p>
        </div>

        {/* Hero/Overview Section */}
        <section className="mb-12">
          <div className="grid md:grid-cols-4 gap-6">
            <Card className="bg-white/90 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Campagne Attive
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-dark">2</div>
                <p className="text-sm text-gray-600">In corso</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/90 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Campagne Concluse
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-dark">5</div>
                <p className="text-sm text-gray-600">Questo mese</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/90 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Voti Ricevuti
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-dark">1,247</div>
                <p className="text-sm text-gray-600">+12% vs mese scorso</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/90 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Engagement Influencer
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-dark">8.4%</div>
                <p className="text-sm text-gray-600">Media campagne</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Campaigns Section */}
        <section id="campaigns" className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-stencil text-2xl font-bold text-dark">Campagne</h2>
            <Button className="bg-dark text-white hover:bg-dark/90">
              Crea Campagna
            </Button>
          </div>
          
          <Card className="bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Le Tue Campagne</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-light/20">
                      <th className="text-left py-3 font-medium text-gray-600">Nome Campagna</th>
                      <th className="text-left py-3 font-medium text-gray-600">Stato</th>
                      <th className="text-left py-3 font-medium text-gray-600">Tipo</th>
                      <th className="text-left py-3 font-medium text-gray-600">Date</th>
                      <th className="text-left py-3 font-medium text-gray-600">Azioni</th>
                    </tr>
                  </thead>
                  <tbody>
                    {campaigns.map((campaign) => (
                      <tr key={campaign.id} className="border-b border-gray-light/10">
                        <td className="py-4 font-medium text-dark">{campaign.name}</td>
                        <td className="py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white ${campaign.statusColor}`}>
                            {campaign.status}
                          </span>
                        </td>
                        <td className="py-4 text-gray-600">{campaign.type}</td>
                        <td className="py-4 text-gray-600">{campaign.startDate} - {campaign.endDate}</td>
                        <td className="py-4">
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">Modifica</Button>
                            <Button variant="outline" size="sm">Visualizza</Button>
                            <Button variant="outline" size="sm">Report</Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Upload Models Section */}
        <section id="models" className="mb-12">
          <h2 className="font-stencil text-2xl font-bold text-dark mb-6">Upload Modello</h2>
          <Card className="bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Carica Immagini e Modelli</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Titolo Modello
                </label>
                <Input placeholder="Inserisci il titolo del modello" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descrizione
                </label>
                <Textarea placeholder="Descrivi il tuo modello..." rows={3} />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  File (Immagini/Video)
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={handleFileUpload}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-brand-bg file:text-dark hover:file:bg-yellow-400"
                />
                {uploadFiles.length > 0 && (
                  <p className="text-sm text-gray-600 mt-2">
                    {uploadFiles.length} file selezionati
                  </p>
                )}
              </div>
              
              <Button className="bg-dark text-white hover:bg-dark/90">
                Carica Modello
              </Button>
            </CardContent>
          </Card>
        </section>

        {/* Reports Section */}
        <section id="reports" className="mb-12">
          <h2 className="font-stencil text-2xl font-bold text-dark mb-6">Report Aggregati</h2>
          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Voti per Categoria</CardTitle>
              </CardHeader>
              <CardContent>
                <Bar data={votingData} options={chartOptions} />
              </CardContent>
            </Card>
            
            <Card className="bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Distribuzione Engagement</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center">
                  <div className="w-64 h-64">
                    <Doughnut data={engagementData} options={doughnutOptions} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Payments Section */}
        <section id="payments" className="mb-12">
          <h2 className="font-stencil text-2xl font-bold text-dark mb-6">Pagamenti</h2>
          <Card className="bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Storico Pagamenti</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-light/20">
                      <th className="text-left py-3 font-medium text-gray-600">Campagna</th>
                      <th className="text-left py-3 font-medium text-gray-600">Importo</th>
                      <th className="text-left py-3 font-medium text-gray-600">Stato</th>
                      <th className="text-left py-3 font-medium text-gray-600">Data</th>
                      <th className="text-left py-3 font-medium text-gray-600">Azioni</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((payment) => (
                      <tr key={payment.id} className="border-b border-gray-light/10">
                        <td className="py-4 font-medium text-dark">{payment.campaign}</td>
                        <td className="py-4 font-semibold text-dark">{payment.amount}</td>
                        <td className="py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white ${payment.statusColor}`}>
                            {payment.status}
                          </span>
                        </td>
                        <td className="py-4 text-gray-600">{payment.date}</td>
                        <td className="py-4">
                          <Button variant="outline" size="sm">Dettagli</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Contracts Section */}
        <section className="mb-12">
          <h2 className="font-stencil text-2xl font-bold text-dark mb-6">Contratti</h2>
          <Card className="bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Elenco Contratti PDF</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {contracts.map((contract) => (
                  <div key={contract.id} className="flex items-center justify-between p-4 border border-gray-light/20 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="bg-gray-100 p-3 rounded-lg">
                        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-medium text-dark">{contract.name}</h3>
                        <p className="text-sm text-gray-600">{contract.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white ${contract.statusColor}`}>
                        {contract.status}
                      </span>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">Visualizza</Button>
                        <Button variant="outline" size="sm">Scarica</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}