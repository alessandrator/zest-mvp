import { Header } from '@/components/Header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function OnboardingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Welcome to ZEST" showBackButton />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-dark mb-4">Welcome to the ZEST Platform!</h1>
          <p className="text-lg text-gray-600">
            Get started by selecting your role and completing your profile setup.
          </p>
        </div>

        {/* Role Selection */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span className="text-2xl">🏢</span>
                <span>Brand</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Create campaigns and connect with talented creators to promote your brand.
              </p>
              <Button asChild className="w-full">
                <Link href="/brand">Go to Brand Dashboard</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span className="text-2xl">🎓</span>
                <span>Student</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Apply to campaigns and showcase your creativity to earn money.
              </p>
              <Button asChild className="w-full">
                <Link href="/studente">Go to Student Dashboard</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span className="text-2xl">⭐</span>
                <span>Influencer</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Leverage your following to participate in exciting brand campaigns.
              </p>
              <Button asChild className="w-full">
                <Link href="/influencer">Go to Influencer Dashboard</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span className="text-2xl">🏫</span>
                <span>School/Institute</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Manage student participation and oversee educational partnerships.
              </p>
              <Button asChild className="w-full">
                <Link href="/scuola">Go to School Dashboard</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span className="text-2xl">👨‍💼</span>
                <span>Admin</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Manage platform operations and moderate content.
              </p>
              <Button asChild className="w-full">
                <Link href="/admin">Go to Admin Dashboard</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span className="text-2xl">🔧</span>
                <span>Super Admin</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Full platform administration and system management.
              </p>
              <Button asChild className="w-full">
                <Link href="/superadmin">Go to Super Admin Dashboard</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Getting Started Guide */}
        <Card>
          <CardHeader>
            <CardTitle>Getting Started Guide</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="bg-primary rounded-full w-6 h-6 flex items-center justify-center text-white text-sm font-bold">1</div>
                <div>
                  <h4 className="font-medium text-dark">Complete Your Profile</h4>
                  <p className="text-gray-600 text-sm">Add your information, profile picture, and preferences.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="bg-primary rounded-full w-6 h-6 flex items-center justify-center text-white text-sm font-bold">2</div>
                <div>
                  <h4 className="font-medium text-dark">Explore the Platform</h4>
                  <p className="text-gray-600 text-sm">Familiarize yourself with features and navigation.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="bg-primary rounded-full w-6 h-6 flex items-center justify-center text-white text-sm font-bold">3</div>
                <div>
                  <h4 className="font-medium text-dark">Start Collaborating</h4>
                  <p className="text-gray-600 text-sm">Create campaigns or apply to existing ones based on your role.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}