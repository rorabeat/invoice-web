import { renderToBuffer } from '@react-pdf/renderer'

import { InvoiceTemplate } from '@/components/pdf/invoice-template'
import type { Invoice } from '@/types/invoice'

export async function generateInvoicePdf(data: Invoice): Promise<Buffer> {
  return renderToBuffer(<InvoiceTemplate data={data} />)
}
