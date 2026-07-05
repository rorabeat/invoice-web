import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { InvoiceView } from '@/components/invoice/invoice-view'
import {
  getInvoiceById,
  NotionInvoiceNotFoundError,
} from '@/lib/services/invoice.service'

interface InvoicePageProps {
  params: Promise<{ notionPageId: string }>
}

export async function generateMetadata({
  params,
}: InvoicePageProps): Promise<Metadata> {
  const { notionPageId } = await params
  return {
    title: `견적서 ${notionPageId} | 견적서 관리 시스템`,
  }
}

export default async function InvoicePage({ params }: InvoicePageProps) {
  const { notionPageId } = await params

  try {
    const invoice = await getInvoiceById(notionPageId)
    return <InvoiceView invoice={invoice} />
  } catch (error) {
    if (error instanceof NotionInvoiceNotFoundError) {
      notFound()
    }
    throw error
  }
}
