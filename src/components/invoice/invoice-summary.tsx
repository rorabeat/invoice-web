import { Card, CardContent } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils'

interface InvoiceSummaryProps {
  totalAmount: number
}

export function InvoiceSummary({ totalAmount }: InvoiceSummaryProps) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between">
        <p className="font-medium">총액</p>
        <p className="text-xl font-bold sm:text-2xl">
          {formatCurrency(totalAmount)}
        </p>
      </CardContent>
    </Card>
  )
}
