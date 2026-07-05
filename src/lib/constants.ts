import type { InvoiceStatus } from '@/types/invoice'

export const INVOICE_STATUS_LABEL: Record<InvoiceStatus, string> = {
  pending: '대기',
  approved: '승인',
  rejected: '거절',
}
