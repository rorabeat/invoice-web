export type InvoiceStatus = 'pending' | 'approved' | 'rejected'

export interface InvoiceItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
  amount: number
}

export interface Invoice {
  id: string
  invoiceNumber: string
  clientName: string
  issueDate: string
  validUntil: string
  items: InvoiceItem[]
  totalAmount: number
  status: InvoiceStatus
}
