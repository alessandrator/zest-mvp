import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { SuperadminNavbar } from '@/components/layouts/superadmin-navbar'
import { DashboardOverview } from '@/components/dashboard/overview'
import { QuickActions } from '@/components/dashboard/quick-actions'
import { AuditLog } from '@/components/dashboard/audit-log'
import { PaymentsSummary } from '@/components/dashboard/payments-summary'
import { PendingRequests } from '@/components/dashboard/pending-requests'
import { ReportingSection } from '@/components/dashboard/reporting-section'

/**
 * Superadmin Dashboard Page
 * 
 * Main dashboard for super admin users with comprehensive overview and management tools.
 * Features:
 * - Overview metrics cards
 * - Quick approval actions
 * - Audit log timeline
 * - Payments summary
 * - Pending requests management
 * - Reporting and export tools
 * 
 * Backend Integration Points:
 * - User role verification (super_admin)
 * - Real-time metrics data
 * - Audit log API endpoints
 * - Payment processing APIs
 * - Request approval workflows
 * - Report generation services
 */
export default async function SuperadminDashboardPage() {
  const user = await getCurrentUser()
  
  // Ensure user is authenticated and has super_admin role
  if (!user) {
    redirect('/login')
  }
  
  if (user.role !== 'super_admin') {
    redirect('/dashboard') // Redirect to general dashboard if not super admin
  }

  return (
    <div className="min-h-screen bg-zest-bg">
      {/* Custom Superadmin Navigation */}
      <SuperadminNavbar user={user} />
      
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