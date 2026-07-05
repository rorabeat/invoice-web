import { NextResponse } from 'next/server'

import { generateInvoicePdf } from '@/lib/pdf/generator'
import { generatePdfRequestSchema } from '@/lib/schemas/pdf'

export async function POST(request: Request) {
  const body = await request.json()
  const parsed = generatePdfRequestSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { message: '요청 데이터가 올바르지 않습니다.' },
      { status: 400 }
    )
  }

  const pdfBuffer = await generateInvoicePdf(parsed.data.invoiceData)

  return new NextResponse(new Uint8Array(pdfBuffer), {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${parsed.data.invoiceData.invoiceNumber}.pdf"`,
    },
  })
}
