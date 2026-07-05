import type { Invoice } from './invoice'

export interface InvoicePdfProps {
  data: Invoice
}

export interface GeneratePdfRequestBody {
  invoiceData: Invoice
}
