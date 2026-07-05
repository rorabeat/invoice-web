import { describe, expect, it } from 'vitest'

import type { NotionInvoiceItemPage, NotionInvoicePage } from '@/types/notion'

import { getRelationIds, parseInvoicePage } from './notion-parser'

function makeProperties(overrides: Record<string, unknown> = {}) {
  return {
    '견적서 번호': { type: 'title', title: [{ plain_text: 'INV-2025-001' }] },
    클라이언트명: {
      type: 'rich_text',
      rich_text: [{ plain_text: 'ABC 회사' }],
    },
    발행일: { type: 'date', date: { start: '2026-06-22' } },
    유효기간: { type: 'date', date: { start: '2026-06-29' } },
    상태: { type: 'status', status: { name: '대기' } },
    '총 금액': { type: 'number', number: 5000000 },
    항목: { type: 'relation', relation: [{ id: 'item-1' }, { id: 'item-2' }] },
    ...overrides,
  }
}

function makeInvoicePage(
  properties: Record<string, unknown>
): NotionInvoicePage {
  return {
    id: 'invoice-1',
    properties,
  } as unknown as NotionInvoicePage
}

function makeItemPage(
  id: string,
  description: string,
  quantity: number,
  unitPrice: number
): NotionInvoiceItemPage {
  return {
    id,
    properties: {
      항목명: { type: 'title', title: [{ plain_text: description }] },
      수량: { type: 'number', number: quantity },
      단가: { type: 'number', number: unitPrice },
    },
  } as unknown as NotionInvoiceItemPage
}

describe('parseInvoicePage', () => {
  it('실제 한글 스키마(상태=status 타입)를 Invoice 로 정상 변환한다', () => {
    const page = makeInvoicePage(makeProperties())
    const items = [
      makeItemPage('item-1', '웹사이트 디자인', 1, 3000000),
      makeItemPage('item-2', '로고 제작', 2, 500000),
    ]

    const invoice = parseInvoicePage(page, items)

    expect(invoice).toMatchObject({
      id: 'invoice-1',
      invoiceNumber: 'INV-2025-001',
      clientName: 'ABC 회사',
      issueDate: '2026-06-22',
      validUntil: '2026-06-29',
      status: 'pending',
      totalAmount: 5000000,
    })
    expect(invoice.items).toHaveLength(2)
    expect(invoice.items[0]).toMatchObject({
      description: '웹사이트 디자인',
      quantity: 1,
      unitPrice: 3000000,
      amount: 3000000,
    })
  })

  it('select 타입 상태 속성도 처리한다', () => {
    const page = makeInvoicePage(
      makeProperties({ 상태: { type: 'select', select: { name: '승인' } } })
    )

    const invoice = parseInvoicePage(page, [])

    expect(invoice.status).toBe('approved')
  })

  it('금액(Formula) 필드를 신뢰하지 않고 수량×단가로 계산한다', () => {
    const page = makeInvoicePage(makeProperties())
    const items = [makeItemPage('item-1', '항목', 3, 10000)]

    const invoice = parseInvoicePage(page, items)

    expect(invoice.items[0].amount).toBe(30000)
  })

  it('항목이 없으면 totalAmount 는 총 금액 속성값을 사용한다', () => {
    const page = makeInvoicePage(makeProperties())

    const invoice = parseInvoicePage(page, [])

    expect(invoice.items).toHaveLength(0)
    expect(invoice.totalAmount).toBe(5000000)
  })

  it('총 금액 속성이 비어 있으면 항목 합계로 폴백한다', () => {
    const page = makeInvoicePage(
      makeProperties({ '총 금액': { type: 'number', number: null } })
    )
    const items = [
      makeItemPage('item-1', '항목1', 1, 1000),
      makeItemPage('item-2', '항목2', 2, 2000),
    ]

    const invoice = parseInvoicePage(page, items)

    expect(invoice.totalAmount).toBe(5000)
  })

  it('필수 속성이 없으면 에러를 던진다', () => {
    const properties = makeProperties()
    delete (properties as Record<string, unknown>)['클라이언트명']
    const page = makeInvoicePage(properties)

    expect(() => parseInvoicePage(page, [])).toThrow(/클라이언트명/)
  })

  it('상태값이 알 수 없는 라벨이면 에러를 던진다', () => {
    const page = makeInvoicePage(
      makeProperties({ 상태: { type: 'status', status: { name: '알수없음' } } })
    )

    expect(() => parseInvoicePage(page, [])).toThrow(/매핑할 수 없습니다/)
  })
})

describe('getRelationIds', () => {
  it('relation 속성에서 연결된 페이지 id 배열을 추출한다', () => {
    const page = makeInvoicePage(makeProperties())

    const ids = getRelationIds(page.properties, '항목', page.id)

    expect(ids).toEqual(['item-1', 'item-2'])
  })
})
