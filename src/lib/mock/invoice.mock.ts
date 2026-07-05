import type { Invoice, InvoiceItem, InvoiceStatus } from '@/types/invoice'

function createMockItem(overrides?: Partial<InvoiceItem>): InvoiceItem {
  const quantity = overrides?.quantity ?? 1
  const unitPrice = overrides?.unitPrice ?? 100000

  return {
    id: 'item-1',
    description: '작업 항목',
    quantity,
    unitPrice,
    amount: quantity * unitPrice,
    ...overrides,
  }
}

export function createMockInvoice(overrides?: Partial<Invoice>): Invoice {
  const items = overrides?.items ?? [createMockItem()]
  const totalAmount =
    overrides?.totalAmount ?? items.reduce((sum, item) => sum + item.amount, 0)

  return {
    id: 'mock-invoice-1',
    invoiceNumber: 'INV-2026-0001',
    clientName: '홍길동',
    issueDate: '2026-07-01',
    validUntil: '2026-07-31',
    status: 'pending',
    ...overrides,
    items,
    totalAmount,
  }
}

const statusScenarios: { id: string; status: InvoiceStatus }[] = [
  { id: 'mock-invoice-pending', status: 'pending' },
  { id: 'mock-invoice-approved', status: 'approved' },
  { id: 'mock-invoice-rejected', status: 'rejected' },
]

export const mockInvoices: Invoice[] = [
  // 단일 항목 - 대기
  createMockInvoice({
    id: statusScenarios[0].id,
    invoiceNumber: 'INV-2026-0001',
    clientName: '홍길동',
    status: statusScenarios[0].status,
    items: [
      createMockItem({
        id: 'item-1',
        description: '홈페이지 리디자인',
        quantity: 1,
        unitPrice: 1500000,
      }),
    ],
  }),
  // 다항목 - 승인
  createMockInvoice({
    id: statusScenarios[1].id,
    invoiceNumber: 'INV-2026-0002',
    clientName: '(주)테크노벨리',
    status: statusScenarios[1].status,
    items: [
      createMockItem({
        id: 'item-1',
        description: '요구사항 분석 및 기획',
        quantity: 1,
        unitPrice: 800000,
      }),
      createMockItem({
        id: 'item-2',
        description: 'UI/UX 디자인',
        quantity: 2,
        unitPrice: 500000,
      }),
      createMockItem({
        id: 'item-3',
        description: '프론트엔드 개발',
        quantity: 1,
        unitPrice: 3000000,
      }),
      createMockItem({
        id: 'item-4',
        description: '유지보수 (1개월)',
        quantity: 1,
        unitPrice: 300000,
      }),
    ],
  }),
  // 긴 설명 포함 - 거절
  createMockInvoice({
    id: statusScenarios[2].id,
    invoiceNumber: 'INV-2026-0003',
    clientName: '김철수',
    status: statusScenarios[2].status,
    items: [
      createMockItem({
        id: 'item-1',
        description:
          '반응형 웹사이트 전면 리뉴얼 작업 (기획, 디자인, 퍼블리싱, 프론트엔드/백엔드 개발, QA 및 배포까지 전체 프로세스 포함)',
        quantity: 1,
        unitPrice: 5000000,
      }),
      createMockItem({
        id: 'item-2',
        description: '도메인 및 호스팅 (1년)',
        quantity: 1,
        unitPrice: 200000,
      }),
    ],
  }),
  // 대량 항목 - 대기
  createMockInvoice({
    id: 'mock-invoice-many-items',
    invoiceNumber: 'INV-2026-0004',
    clientName: '(주)글로벌상사',
    status: 'pending',
    items: Array.from({ length: 8 }, (_, index) =>
      createMockItem({
        id: `item-${index + 1}`,
        description: `자재 구매 항목 ${index + 1}`,
        quantity: index + 1,
        unitPrice: 50000,
      })
    ),
  }),
  // 항목 없음 - 승인 (빈 상태 테스트용)
  createMockInvoice({
    id: 'mock-invoice-empty',
    invoiceNumber: 'INV-2026-0005',
    clientName: '이영희',
    status: 'approved',
    items: [],
    totalAmount: 0,
  }),
]
