import { z } from 'zod'

const invoiceItemSchema = z.object({
  id: z.string().min(1),
  description: z.string().min(1),
  quantity: z.number(),
  unitPrice: z.number(),
  amount: z.number(),
})

const invoiceSchema = z.object({
  id: z.string().min(1),
  invoiceNumber: z.string().min(1),
  clientName: z.string().min(1),
  issueDate: z.string().min(1),
  validUntil: z.string().min(1),
  items: z.array(invoiceItemSchema),
  totalAmount: z.number(),
  status: z.enum(['pending', 'approved', 'rejected']),
})

export const generatePdfRequestSchema = z.object({
  invoiceData: invoiceSchema,
})
