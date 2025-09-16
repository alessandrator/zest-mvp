'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Download, FileText, BarChart3, Calendar, Filter } from 'lucide-react'

/**
 * Reporting Section Component
 * 
 * Provides access to analytics reports, export functionality, and recent report history.
 * Enables superadmins to generate and download various platform reports.
 * 
 * Backend Integration Points:
 * - POST /api/admin/reports/generate - Generate new reports (CSV/PDF)
 * - GET /api/admin/reports/history - Get recent report history
 * - GET /api/admin/reports/download/:id - Download specific report
 * - GET /api/admin/analytics/summary - Get analytics summary data
 */
export function ReportingSection() {
  // TODO: Replace with real API calls
  const recentReports = [
    {
      id: 'RPT001',
      name: 'Monthly User Activity Report',
      type: 'PDF',
      generated: '2024-01-15',
      size: '2.4 MB',
      status: 'completed'
    },
    {
      id: 'RPT002',
      name: 'Campaign Performance Q4 2023',
      type: 'CSV',
      generated: '2024-01-10',
      size: '856 KB',
      status: 'completed'
    },
    {
      id: 'RPT003',
      name: 'Payment Transactions Export',
      type: 'CSV',
      generated: '2024-01-08',
      size: '1.2 MB',
      status: 'completed'
    },
    {
      id: 'RPT004',
      name: 'User Demographics Analysis',
      type: 'PDF',
      generated: '2024-01-05',
      size: '3.1 MB',
      status: 'completed'
    }
  ]

  const reportTypes = [
    {
      name: 'User Activity Report',
      description: 'Detailed user engagement and activity metrics',
      icon: BarChart3,
      formats: ['CSV', 'PDF']
    },
    {
      name: 'Campaign Analytics',
      description: 'Performance data for all campaigns',
      icon: FileText,
      formats: ['CSV', 'PDF']
    },
    {
      name: 'Financial Summary',
      description: 'Payment transactions and financial overview',
      icon: Calendar,
      formats: ['CSV', 'PDF']
    },
    {
      name: 'Platform Usage Stats',
      description: 'Overall platform utilization statistics',
      icon: Filter,
      formats: ['CSV', 'PDF']
    }
  ]

  const handleGenerateReport = (reportType: string, format: string) => {
    console.log(`Generating ${reportType} report in ${format} format`)
    // TODO: Implement API call to generate report
  }

  const handleDownloadReport = (reportId: string) => {
    console.log(`Downloading report: ${reportId}`)
    // TODO: Implement download functionality
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-50'
      case 'generating':
        return 'text-blue-600 bg-blue-50'
      case 'failed':
        return 'text-red-600 bg-red-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  return (
    <Card className="border-2 border-zest-black shadow-md">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-stencil font-bold text-zest-black">
            Reportistica
          </CardTitle>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <FileText className="w-4 h-4" />
            <span>Analytics & Export</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Report Generation */}
          <div>
            <h3 className="text-lg font-semibold text-zest-black mb-4">
              Genera Nuovo Report
            </h3>
            <div className="space-y-4">
              {reportTypes.map((report, index) => {
                const Icon = report.icon
                return (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors duration-200">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-50 rounded-lg">
                          <Icon className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-zest-black">
                            {report.name}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {report.description}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {report.formats.map((format) => (
                        <Button
                          key={format}
                          size="sm"
                          variant="outline"
                          onClick={() => handleGenerateReport(report.name, format)}
                          className="text-xs"
                        >
                          <Download className="w-3 h-3 mr-1" />
                          {format}
                        </Button>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Recent Reports */}
          <div>
            <h3 className="text-lg font-semibold text-zest-black mb-4">
              Report Recenti
            </h3>
            <div className="space-y-3">
              {recentReports.map((report) => (
                <div key={report.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-zest-black text-sm">
                      {report.name}
                    </h4>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                      {report.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center space-x-4">
                      <span>{report.type}</span>
                      <span>{report.size}</span>
                      <span>{report.generated}</span>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDownloadReport(report.id)}
                      className="h-6 px-2 text-xs"
                    >
                      <Download className="w-3 h-3 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            
            {/* View All Reports */}
            <div className="mt-4">
              <Button variant="outline" className="w-full">
                <FileText className="w-4 h-4 mr-2" />
                Visualizza Tutti i Report
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-stencil font-bold text-zest-black">
                127
              </div>
              <div className="text-sm text-gray-600">Report Generati</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-stencil font-bold text-zest-black">
                45.2GB
              </div>
              <div className="text-sm text-gray-600">Dati Processati</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-stencil font-bold text-zest-black">
                98.7%
              </div>
              <div className="text-sm text-gray-600">Successo Export</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-stencil font-bold text-zest-black">
                24h
              </div>
              <div className="text-sm text-gray-600">Tempo Medio</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}