import { NextResponse } from 'next/server'

import { logError } from '@/lib/logger'
import { generateInvoicePdf } from '@/lib/pdf/generator'
import { checkRateLimit } from '@/lib/rate-limit'
import { generatePdfRequestSchema } from '@/lib/schemas/pdf'

const RATE_LIMIT = 10
const RATE_LIMIT_WINDOW_MS = 60_000

function getClientKey(request: Request): string {
  return request.headers.get('x-forwarded-for') ?? 'unknown'
}

export async function POST(request: Request) {
  const clientKey = getClientKey(request)
  const { allowed } = checkRateLimit(
    `generate-pdf:${clientKey}`,
    RATE_LIMIT,
    RATE_LIMIT_WINDOW_MS
  )

  if (!allowed) {
    return NextResponse.json(
      { message: '요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.' },
      { status: 429 }
    )
  }

  const body = await request.json()
  const parsed = generatePdfRequestSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { message: '요청 데이터가 올바르지 않습니다.' },
      { status: 400 }
    )
  }

  try {
    const pdfBuffer = await generateInvoicePdf(parsed.data.invoiceData)

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${parsed.data.invoiceData.invoiceNumber}.pdf"`,
      },
    })
  } catch (error) {
    logError('api/generate-pdf', error)
    return NextResponse.json(
      { message: 'PDF 생성 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
