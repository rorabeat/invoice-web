import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Invoice } from '@/types/invoice'

interface ClientInfoProps {
  invoice: Invoice
}

export function ClientInfo({ invoice }: ClientInfoProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-muted-foreground text-sm">받는 분</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-lg font-medium">{invoice.clientName}</p>
      </CardContent>
    </Card>
  )
}
