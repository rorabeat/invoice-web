import { APIErrorCode, APIResponseError } from '@notionhq/client'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/lib/notion', () => ({
  notion: {
    pages: {
      retrieve: vi.fn(),
    },
  },
}))

const { notion } = await import('@/lib/notion')
const { fetchInvoiceById, NotionInvoiceNotFoundError } = await import(
  './invoice.service'
)

function fullPage(overrides: Record<string, unknown> = {}) {
  return {
    object: 'page',
    id: 'invoice-1',
    url: 'https://notion.so/invoice-1',
    archived: false,
    in_trash: false,
    properties: {
      '견적서 번호': { type: 'title', title: [{ plain_text: 'INV-2025-001' }] },
      클라이언트명: {
        type: 'rich_text',
        rich_text: [{ plain_text: 'ABC 회사' }],
      },
      발행일: { type: 'date', date: { start: '2026-06-22' } },
      유효기간: { type: 'date', date: { start: '2026-06-29' } },
      상태: { type: 'status', status: { name: '대기' } },
      '총 금액': { type: 'number', number: 5000000 },
      항목: { type: 'relation', relation: [] },
    },
    ...overrides,
  }
}

describe('fetchInvoiceById', () => {
  beforeEach(() => {
    vi.mocked(notion.pages.retrieve).mockReset()
  })

  it('정상 조회 시 Invoice 를 반환한다', async () => {
    vi.mocked(notion.pages.retrieve).mockResolvedValueOnce(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      fullPage() as any
    )

    const invoice = await fetchInvoiceById('invoice-1')

    expect(invoice.invoiceNumber).toBe('INV-2025-001')
    expect(invoice.clientName).toBe('ABC 회사')
  })

  it('object_not_found 에러를 NotionInvoiceNotFoundError 로 변환한다', async () => {
    vi.mocked(notion.pages.retrieve).mockRejectedValueOnce(
      new APIResponseError({
        code: APIErrorCode.ObjectNotFound,
        message: 'not found',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        headers: new Headers() as any,
        status: 404,
        rawBodyText: '',
        additional_data: undefined,
        request_id: undefined,
      })
    )

    await expect(fetchInvoiceById('missing-id')).rejects.toBeInstanceOf(
      NotionInvoiceNotFoundError
    )
  })

  it('archived 페이지는 NotionInvoiceNotFoundError 로 취급한다', async () => {
    vi.mocked(notion.pages.retrieve).mockResolvedValueOnce(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      fullPage({ archived: true }) as any
    )

    await expect(fetchInvoiceById('invoice-1')).rejects.toBeInstanceOf(
      NotionInvoiceNotFoundError
    )
  })

  it('그 외 에러는 그대로 rethrow 한다', async () => {
    vi.mocked(notion.pages.retrieve).mockRejectedValueOnce(
      new Error('rate limited')
    )

    await expect(fetchInvoiceById('invoice-1')).rejects.toThrow('rate limited')
  })
})
