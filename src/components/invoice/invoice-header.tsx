import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { INVOICE_STATUS_LABEL } from '@/lib/constants'
import type { Invoice } from '@/types/invoice'

const STATUS_BADGE_VARIANT: Record<
  Invoice['status'],
  'secondary' | 'default' | 'destructive'
> = {
  pending: 'secondary',
  approved: 'default',
  rejected: 'destructive',
}

interface InvoiceHeaderProps {
  invoice: Invoice
}

export function InvoiceHeader({ invoice }: InvoiceHeaderProps) {
  return (
    <Card>
      <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-muted-foreground text-sm">견적서 번호</p>
          <h1 className="text-xl font-bold sm:text-2xl">
            {invoice.invoiceNumber}
          </h1>
        </div>
        <div className="flex flex-col gap-2 sm:items-end">
          <Badge variant={STATUS_BADGE_VARIANT[invoice.status]}>
            {INVOICE_STATUS_LABEL[invoice.status]}
          </Badge>
          <div className="text-muted-foreground text-sm">
            <p>발행일: {invoice.issueDate}</p>
            <p>유효기간: {invoice.validUntil}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
