'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { User } from '@/types'

interface SchoolAdminDashboardProps {
  user: User
}

// Demo data - TODO: Replace with actual API calls
const mockStats = {
  activeClasses: 12,
  enrolledStudents: 248,
  pendingSubmissions: 7,
  activeHackathons: 3
}

const mockClasses = [
  { id: 1, name: "Digital Marketing 101", students: 25, teacher: "Prof. Rossi", year: "2024" },
  { id: 2, name: "Social Media Strategy", students: 30, teacher: "Prof. Bianchi", year: "2024" },
  { id: 3, name: "Content Creation", students: 22, teacher: "Prof. Verdi", year: "2024" },
]

const mockSubmissions = [
  { id: 1, student: "Marco Ferrari", class: "Digital Marketing 101", title: "Instagram Campaign Analysis", date: "2024-01-15", status: "pending" },
  { id: 2, student: "Laura Conti", class: "Social Media Strategy", title: "TikTok Content Strategy", date: "2024-01-14", status: "pending" },
  { id: 3, student: "Alessandro Neri", class: "Content Creation", title: "Brand Video Project", date: "2024-01-13", status: "pending" },
]

const mockHackathons = [
  { id: 1, name: "Innovation Challenge 2024", participants: 45, startDate: "2024-02-01", endDate: "2024-02-03", status: "upcoming" },
  { id: 2, name: "Sustainability Hack", participants: 32, startDate: "2024-01-20", endDate: "2024-01-22", status: "active" },
  { id: 3, name: "FinTech Solutions", participants: 28, startDate: "2024-01-15", endDate: "2024-01-17", status: "completed" },
]

const mockStudents = [
  { id: 1, name: "Marco Ferrari", class: "Digital Marketing 101", badges: 3, activity: "High", email: "m.ferrari@student.edu" },
  { id: 2, name: "Laura Conti", class: "Social Media Strategy", badges: 5, activity: "Medium", email: "l.conti@student.edu" },
  { id: 3, name: "Alessandro Neri", class: "Content Creation", badges: 2, activity: "High", email: "a.neri@student.edu" },
  { id: 4, name: "Sofia Greco", class: "Digital Marketing 101", badges: 4, activity: "Low", email: "s.greco@student.edu" },
]

export function SchoolAdminDashboard({ user }: SchoolAdminDashboardProps) {
  const [activeSection, setActiveSection] = useState('overview')

  const handleApproveSubmission = (id: number) => {
    // TODO: Implement submission approval API call
    console.log('Approving submission:', id)
  }

  const handleRejectSubmission = (id: number) => {
    // TODO: Implement submission rejection API call
    console.log('Rejecting submission:', id)
  }

  const handleInviteStudents = (classId: number) => {
    // TODO: Implement student invitation functionality
    console.log('Inviting students to class:', classId)
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fcff59' }}>
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Title */}
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2">
                <div className="bg-primary rounded-lg p-2">
                  <span className="text-black font-stencil font-bold text-xl">Z</span>
                </div>
                <span className="font-stencil font-bold text-xl text-black">ZEST</span>
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-xl font-stencil font-bold text-black">School Admin</h1>
            </div>

            {/* Navigation Menu */}
            <nav className="hidden md:flex items-center space-x-6">
              <button
                onClick={() => setActiveSection('overview')}
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  activeSection === 'overview' 
                    ? 'text-black border-b-2 border-black' 
                    : 'text-gray-600 hover:text-black'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveSection('classi')}
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  activeSection === 'classi' 
                    ? 'text-black border-b-2 border-black' 
                    : 'text-gray-600 hover:text-black'
                }`}
              >
                Classi
              </button>
              <button
                onClick={() => setActiveSection('studenti')}
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  activeSection === 'studenti' 
                    ? 'text-black border-b-2 border-black' 
                    : 'text-gray-600 hover:text-black'
                }`}
              >
                Studenti
              </button>
              <button
                onClick={() => setActiveSection('submission')}
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  activeSection === 'submission' 
                    ? 'text-black border-b-2 border-black' 
                    : 'text-gray-600 hover:text-black'
                }`}
              >
                Submission
              </button>
              <button
                onClick={() => setActiveSection('hackathon')}
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  activeSection === 'hackathon' 
                    ? 'text-black border-b-2 border-black' 
                    : 'text-gray-600 hover:text-black'
                }`}
              >
                Hackathon
              </button>
              <button
                onClick={() => setActiveSection('profilo')}
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  activeSection === 'profilo' 
                    ? 'text-black border-b-2 border-black' 
                    : 'text-gray-600 hover:text-black'
                }`}
              >
                Profilo
              </button>
              <Button variant="outline" size="sm" asChild>
                <Link href="/login">Logout</Link>
              </Button>
            </nav>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button variant="outline" size="sm">Menu</Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Section */}
        {activeSection === 'overview' && (
          <div className="space-y-8">
            {/* Welcome Message */}
            <div className="text-center">
              <h2 className="text-3xl font-stencil font-bold text-black mb-2">
                Benvenuto, {user.profile.first_name}!
              </h2>
              <p className="text-gray-700">Gestisci la tua scuola con facilità</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-white border-2 border-gray-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Classi Attive</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-black">{mockStats.activeClasses}</div>
                  <p className="text-sm text-gray-600">In corso quest&apos;anno</p>
                </CardContent>
              </Card>

              <Card className="bg-white border-2 border-gray-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Studenti Iscritti</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-black">{mockStats.enrolledStudents}</div>
                  <p className="text-sm text-gray-600">Totale registrati</p>
                </CardContent>
              </Card>

              <Card className="bg-white border-2 border-gray-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Submission Ricevute</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-black">{mockStats.pendingSubmissions}</div>
                  <p className="text-sm text-gray-600">Da approvare</p>
                </CardContent>
              </Card>

              <Card className="bg-white border-2 border-gray-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Hackathon Attivi</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-black">{mockStats.activeHackathons}</div>
                  <p className="text-sm text-gray-600">In programma</p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card className="bg-white border-2 border-gray-200">
              <CardHeader>
                <CardTitle className="font-stencil text-lg">Azioni Rapide</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Button 
                  onClick={() => setActiveSection('classi')}
                  className="bg-black text-white hover:bg-gray-800"
                >
                  Gestisci Classi
                </Button>
                <Button 
                  onClick={() => setActiveSection('submission')}
                  variant="outline"
                  className="border-black text-black hover:bg-gray-50"
                >
                  Approva Submission
                </Button>
                <Button 
                  onClick={() => setActiveSection('studenti')}
                  variant="outline"
                  className="border-black text-black hover:bg-gray-50"
                >
                  Visualizza Studenti
                </Button>
                <Button 
                  onClick={() => setActiveSection('hackathon')}
                  variant="outline"
                  className="border-black text-black hover:bg-gray-50"
                >
                  Crea Hackathon
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Classi Section */}
        {activeSection === 'classi' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-stencil font-bold text-black">Gestione Classi</h2>
              <Button className="bg-black text-white hover:bg-gray-800">
                Aggiungi Classe
              </Button>
            </div>

            <div className="grid gap-6">
              {mockClasses.map((classe) => (
                <Card key={classe.id} className="bg-white border-2 border-gray-200">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="font-stencil text-lg">{classe.name}</CardTitle>
                        <p className="text-gray-600">Docente: {classe.teacher}</p>
                        <p className="text-sm text-gray-500">Anno: {classe.year}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-black">{classe.students}</div>
                        <p className="text-sm text-gray-600">studenti</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline"
                        size="sm"
                        className="border-black text-black hover:bg-gray-50"
                      >
                        Modifica
                      </Button>
                      <Button 
                        onClick={() => handleInviteStudents(classe.id)}
                        size="sm"
                        className="bg-black text-white hover:bg-gray-800"
                      >
                        Invia Inviti
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Students Section */}
        {activeSection === 'studenti' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-stencil font-bold text-black">Gestione Studenti</h2>
              <Button className="bg-black text-white hover:bg-gray-800">
                Aggiungi Studente
              </Button>
            </div>

            <Card className="bg-white border-2 border-gray-200">
              <CardHeader>
                <CardTitle className="font-stencil text-lg">Lista Studenti</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Nome</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Classe</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Badge</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Attività</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Azioni</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockStudents.map((student) => (
                        <tr key={student.id} className="border-b border-gray-100">
                          <td className="py-3 px-4">
                            <div>
                              <div className="font-medium text-black">{student.name}</div>
                              <div className="text-sm text-gray-500">{student.email}</div>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-gray-700">{student.class}</td>
                          <td className="py-3 px-4">
                            <span className="bg-primary text-black px-2 py-1 rounded text-sm font-medium">
                              {student.badges} badge
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded text-sm font-medium ${
                              student.activity === 'High' ? 'bg-green-100 text-green-800' :
                              student.activity === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {student.activity}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <Button variant="outline" size="sm" className="border-black text-black hover:bg-gray-50">
                              Visualizza
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Submissions Section */}
        {activeSection === 'submission' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-stencil font-bold text-black">Submission da Approvare</h2>

            <div className="grid gap-6">
              {mockSubmissions.map((submission) => (
                <Card key={submission.id} className="bg-white border-2 border-gray-200">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="font-stencil text-lg">{submission.title}</CardTitle>
                        <p className="text-gray-600">Studente: {submission.student}</p>
                        <p className="text-gray-600">Classe: {submission.class}</p>
                        <p className="text-sm text-gray-500">Data: {submission.date}</p>
                      </div>
                      <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm font-medium">
                        {submission.status}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => handleApproveSubmission(submission.id)}
                        className="bg-green-600 text-white hover:bg-green-700"
                        size="sm"
                      >
                        Approva
                      </Button>
                      <Button 
                        onClick={() => handleRejectSubmission(submission.id)}
                        variant="outline"
                        size="sm"
                        className="border-red-600 text-red-600 hover:bg-red-50"
                      >
                        Rifiuta
                      </Button>
                      <Button 
                        variant="outline"
                        size="sm"
                        className="border-black text-black hover:bg-gray-50"
                      >
                        Visualizza Dettagli
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Hackathons Section */}
        {activeSection === 'hackathon' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-stencil font-bold text-black">Gestione Hackathon</h2>
              <Button className="bg-black text-white hover:bg-gray-800">
                Crea Nuovo Hackathon
              </Button>
            </div>

            <div className="grid gap-6">
              {mockHackathons.map((hackathon) => (
                <Card key={hackathon.id} className="bg-white border-2 border-gray-200">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="font-stencil text-lg">{hackathon.name}</CardTitle>
                        <p className="text-gray-600">Partecipanti: {hackathon.participants}</p>
                        <p className="text-sm text-gray-500">
                          {hackathon.startDate} - {hackathon.endDate}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded text-sm font-medium ${
                        hackathon.status === 'active' ? 'bg-green-100 text-green-800' :
                        hackathon.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {hackathon.status}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline"
                        size="sm"
                        className="border-black text-black hover:bg-gray-50"
                      >
                        Modifica
                      </Button>
                      <Button 
                        variant="outline"
                        size="sm"
                        className="border-black text-black hover:bg-gray-50"
                      >
                        Visualizza Partecipanti
                      </Button>
                      {hackathon.status === 'upcoming' && (
                        <Button 
                          size="sm"
                          className="bg-black text-white hover:bg-gray-800"
                        >
                          Avvia
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Profile Section */}
        {activeSection === 'profilo' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-stencil font-bold text-black">Profilo Amministratore</h2>

            <Card className="bg-white border-2 border-gray-200">
              <CardHeader>
                <CardTitle className="font-stencil text-lg">Informazioni Personali</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                    <div className="p-2 bg-gray-50 rounded border">
                      {user.profile.first_name} {user.profile.last_name}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <div className="p-2 bg-gray-50 rounded border">
                      {user.email}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ruolo</label>
                    <div className="p-2 bg-gray-50 rounded border">
                      School Administrator
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Scuola</label>
                    <div className="p-2 bg-gray-50 rounded border">
                      {/* TODO: Add school info from user profile */}
                      Università di Milano
                    </div>
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button className="bg-black text-white hover:bg-gray-800">
                    Modifica Profilo
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      {/* Mobile Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
        <div className="flex justify-around">
          <button
            onClick={() => setActiveSection('overview')}
            className={`py-2 px-3 text-xs font-medium ${
              activeSection === 'overview' ? 'text-black' : 'text-gray-600'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveSection('classi')}
            className={`py-2 px-3 text-xs font-medium ${
              activeSection === 'classi' ? 'text-black' : 'text-gray-600'
            }`}
          >
            Classi
          </button>
          <button
            onClick={() => setActiveSection('studenti')}
            className={`py-2 px-3 text-xs font-medium ${
              activeSection === 'studenti' ? 'text-black' : 'text-gray-600'
            }`}
          >
            Studenti
          </button>
          <button
            onClick={() => setActiveSection('submission')}
            className={`py-2 px-3 text-xs font-medium ${
              activeSection === 'submission' ? 'text-black' : 'text-gray-600'
            }`}
          >
            Submission
          </button>
        </div>
      </div>
    </div>
  )
}