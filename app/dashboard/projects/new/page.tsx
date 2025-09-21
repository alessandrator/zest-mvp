import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { CreateProjectForm } from '@/components/dashboard/create-project-form'

export default async function CreateProjectPage() {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/login')
  }

  if (!['student', 'influencer'].includes(user.role)) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Nuovo Progetto
              </h1>
              <p className="text-sm text-gray-600">
                Crea un nuovo progetto per una campagna
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CreateProjectForm user={user} />
      </div>
    </div>
  )
}