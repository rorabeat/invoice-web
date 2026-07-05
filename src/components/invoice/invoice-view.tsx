import { ClientInfo } from '@/components/invoice/client-info'
import { InvoiceHeader } from '@/components/invoice/invoice-header'
import { InvoiceItemsTable } from '@/components/invoice/invoice-items-table'
import { InvoiceSummary } from '@/components/invoice/invoice-summary'
import { PdfDownloadButton } from '@/components/invoice/pdf-download-button'
import { Card, CardContent } from '@/components/ui/card'
import type { Invoice } from '@/types/invoice'

interface InvoiceViewProps {
  invoice: Invoice
}

export function InvoiceView({ invoice }: InvoiceViewProps) {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-8 sm:py-12">
      <InvoiceHeader invoice={invoice} />
      <ClientInfo invoice={invoice} />
      <Card>
        <CardContent>
          <InvoiceItemsTable items={invoice.items} />
        </CardContent>
      </Card>
      <InvoiceSummary totalAmount={invoice.totalAmount} />
      <div className="flex justify-end">
        <PdfDownloadButton invoice={invoice} />
      </div>
    </div>
  )
}
