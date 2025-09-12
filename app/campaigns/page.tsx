import Link from 'next/link'
import { Navbar } from '@/components/layouts/navbar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { getCurrentUser } from '@/lib/auth'
import { formatCurrency, formatDate } from '@/lib/utils'

// Mock data for demonstration
const mockCampaigns = [
  {
    id: '1',
    title: 'TechFlow App Launch Campaign',
    description: 'We\'re launching our new productivity app and looking for students and young professionals to create authentic content showcasing how our app helps with daily productivity and workflow management.',
    budget_min: 500,
    budget_max: 2000,
    target_audience: ['students', 'young professionals', 'productivity enthusiasts'],
    deadline: '2024-10-15',
    brand: {
      name: 'TechFlow Solutions',
      logo_url: null,
    },
  },
  {
    id: '2',
    title: 'Sustainable Campus Challenge',
    description: 'Partner with us to promote sustainable living on campus! We\'re looking for environmentally conscious students to showcase our eco-friendly product line and inspire sustainable habits among their peers.',
    budget_min: 300,
    budget_max: 1500,
    target_audience: ['college students', 'environmental advocates', 'sustainability enthusiasts'],
    deadline: '2024-11-01',
    brand: {
      name: 'EcoLife Brands',
      logo_url: null,
    },
  },
  {
    id: '3',
    title: 'Study Abroad Experience Sharing',
    description: 'Share your study abroad journey! We want authentic stories and experiences from students who have studied internationally to inspire others to take the leap.',
    budget_min: 800,
    budget_max: 2500,
    target_audience: ['international students', 'study abroad alumni', 'university students'],
    deadline: '2024-10-30',
    brand: {
      name: 'Global Education Partners',
      logo_url: null,
    },
  },
]

export default async function CampaignsPage() {
  const user = await getCurrentUser()

  return (
    <div className="min-h-screen bg-white">
      <Navbar user={user} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-dark mb-2">
            Active Campaigns
          </h1>
          <p className="text-gray-600">
            Discover exciting collaboration opportunities with top brands
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-wrap gap-4">
          <Button variant="outline" size="sm">All Categories</Button>
          <Button variant="ghost" size="sm">Technology</Button>
          <Button variant="ghost" size="sm">Sustainability</Button>
          <Button variant="ghost" size="sm">Education</Button>
          <Button variant="ghost" size="sm">Lifestyle</Button>
        </div>

        {/* Campaigns Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockCampaigns.map((campaign) => (
            <Card key={campaign.id} className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg line-clamp-2 mb-2">
                      {campaign.title}
                    </CardTitle>
                    <p className="text-sm text-gray-600 font-medium">
                      {campaign.brand.name}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center flex-shrink-0 ml-4">
                    <span className="text-dark font-bold text-lg">
                      {campaign.brand.name.charAt(0)}
                    </span>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-gray-600 text-sm line-clamp-3">
                  {campaign.description}
                </p>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Budget:</span>
                    <span className="font-medium text-dark">
                      {formatCurrency(campaign.budget_min)} - {formatCurrency(campaign.budget_max)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Deadline:</span>
                    <span className="font-medium text-dark">
                      {formatDate(campaign.deadline)}
                    </span>
                  </div>
                </div>
                
                <div>
                  <p className="text-xs text-gray-500 mb-2">Target Audience:</p>
                  <div className="flex flex-wrap gap-1">
                    {campaign.target_audience.slice(0, 2).map((audience, index) => (
                      <span
                        key={index}
                        className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full"
                      >
                        {audience}
                      </span>
                    ))}
                    {campaign.target_audience.length > 2 && (
                      <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                        +{campaign.target_audience.length - 2} more
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="pt-2">
                  {user ? (
                    <Button className="w-full" size="sm">
                      Apply Now
                    </Button>
                  ) : (
                    <Button className="w-full" size="sm" asChild>
                      <Link href="/login">Sign in to Apply</Link>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State / Load More */}
        {mockCampaigns.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No campaigns available
            </h3>
            <p className="text-gray-600">
              Check back soon for new opportunities!
            </p>
          </div>
        )}

        {/* Call to Action */}
        {!user && (
          <div className="mt-12 text-center bg-gray-50 rounded-lg p-8">
            <h3 className="text-xl font-display font-semibold text-dark mb-2">
              Ready to Start Creating?
            </h3>
            <p className="text-gray-600 mb-4">
              Join ZEST to apply for campaigns and start collaborating with amazing brands.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild>
                <Link href="/request-access">Join as Creator</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}