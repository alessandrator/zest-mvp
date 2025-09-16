import { SuperadminNavbar } from '@/components/layouts/superadmin-navbar'
import { DashboardOverview } from '@/components/dashboard/overview'
import { QuickActions } from '@/components/dashboard/quick-actions'
import { AuditLog } from '@/components/dashboard/audit-log'
import { PaymentsSummary } from '@/components/dashboard/payments-summary'
import { PendingRequests } from '@/components/dashboard/pending-requests'
import { ReportingSection } from '@/components/dashboard/reporting-section'

/**
 * Superadmin Dashboard Demo Page
 * 
 * Demo version of the superadmin dashboard for testing and presentation purposes.
 * Shows the complete dashboard layout with placeholder data without requiring authentication.
 * 
 * This is the production-ready interface for super admin users with:
 * - ZEST brand styling (#fcff59 background, Orbitron font for titles)
 * - Complete navigation with all admin sections
 * - Overview metrics cards
 * - Quick approval actions  
 * - Audit log timeline
 * - Payments summary
 * - Pending requests management
 * - Reporting and export tools
 * - Responsive design
 * - Inline documentation for backend integration
 */
export default function SuperadminDashboardDemoPage() {
  // Mock user for demo purposes
  const mockUser = {
    id: 'demo-user',
    email: 'admin@zest.com',
    role: 'super_admin' as const,
    profile: {
      id: 'demo-profile',
      user_id: 'demo-user',
      first_name: 'Super',
      last_name: 'Admin',
      avatar_url: null,
      phone: null,
      company: null,
      school_id: null,
      bio: null,
      website: null,
      social_links: null,
      verified: true,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    },
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  }

  return (
    <div className="min-h-screen bg-zest-bg">
      {/* Custom Superadmin Navigation */}
      <SuperadminNavbar user={mockUser} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-4xl font-stencil font-bold text-zest-black mb-2">
            Superadmin Dashboard
          </h1>
          <p className="text-lg text-gray-600">
            Central command center for ZEST platform management
          </p>
        </div>

        {/* Dashboard Overview Cards */}
        <DashboardOverview />

        {/* Quick Actions Section */}
        <QuickActions />

        {/* Two Column Layout for Additional Sections */}
        <div className="grid lg:grid-cols-2 gap-8 mt-8">
          {/* Audit Log */}
          <AuditLog />
          
          {/* Payments Summary */}
          <PaymentsSummary />
        </div>

        {/* Full Width Sections */}
        <div className="space-y-8 mt-8">
          {/* Pending Requests Table */}
          <PendingRequests />
          
          {/* Reporting Section */}
          <ReportingSection />
        </div>
      </div>
    </div>
  )
}