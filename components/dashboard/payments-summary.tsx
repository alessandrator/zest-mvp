import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CreditCard, TrendingUp } from 'lucide-react'

/**
 * Payments Summary Component
 * 
 * Displays payment analytics and summary for the last 30 days.
 * Includes total processed payments, successful transactions, and payment trends.
 * 
 * Backend Integration Points:
 * - GET /api/admin/payments/summary?period=30d - 30-day payment summary
 * - GET /api/admin/payments/transactions/recent - Recent transaction list
 * - GET /api/admin/payments/metrics - Payment processing metrics
 */
export function PaymentsSummary() {
  // TODO: Replace with real API calls
  const paymentData = {
    totalProcessed: 15430.50,
    totalTransactions: 127,
    successRate: 98.4,
    averageTransaction: 121.50,
    topCategories: [
      { name: 'Influencer Payouts', amount: 8520.00, percentage: 55.2 },
      { name: 'Campaign Bonuses', amount: 4210.50, percentage: 27.3 },
      { name: 'School Partnerships', amount: 2700.00, percentage: 17.5 }
    ],
    recentTransactions: [
      {
        id: 'TXN001',
        type: 'Payout',
        recipient: 'Marco Rossi (@marco_social)',
        amount: 250.00,
        status: 'completed',
        date: '2024-01-15'
      },
      {
        id: 'TXN002',
        type: 'Bonus',
        recipient: 'TechFlow Campaign',
        amount: 500.00,
        status: 'completed',
        date: '2024-01-15'
      },
      {
        id: 'TXN003',
        type: 'Partnership',
        recipient: 'Università Bocconi',
        amount: 1200.00,
        status: 'pending',
        date: '2024-01-14'
      }
    ]
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-50'
      case 'pending':
        return 'text-orange-600 bg-orange-50'
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
            Pagamenti Ultimi 30gg
          </CardTitle>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <CreditCard className="w-4 h-4" />
            <span>Payment Analytics</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="text-2xl font-stencil font-bold text-green-600">
              €{paymentData.totalProcessed.toLocaleString()}
            </div>
            <div className="text-sm text-green-700">Totale Processato</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-2xl font-stencil font-bold text-blue-600">
              {paymentData.totalTransactions}
            </div>
            <div className="text-sm text-blue-700">Transazioni</div>
          </div>
        </div>

        {/* Payment Categories */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-zest-black mb-3">
            Categorie di Pagamento
          </h4>
          <div className="space-y-3">
            {paymentData.topCategories.map((category, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">
                      {category.name}
                    </span>
                    <span className="text-sm font-medium text-zest-black">
                      €{category.amount.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-zest-bg h-2 rounded-full border border-zest-black"
                      style={{ width: `${category.percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Transactions */}
        <div>
          <h4 className="text-sm font-semibold text-zest-black mb-3">
            Transazioni Recenti
          </h4>
          <div className="space-y-3 max-h-48 overflow-y-auto">
            {paymentData.recentTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-zest-black">
                      {transaction.recipient}
                    </span>
                    <span className="text-sm font-bold text-green-600">
                      €{transaction.amount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-gray-500">
                      {transaction.type} • {transaction.date}
                    </span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                      {transaction.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Success Rate */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Tasso di Successo</span>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-bold text-green-600">
                {paymentData.successRate}%
              </span>
              <TrendingUp className="w-4 h-4 text-green-600" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}