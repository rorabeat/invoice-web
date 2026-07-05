import { INVOICE_STATUS_LABEL } from '@/lib/constants'
import type { Invoice, InvoiceItem, InvoiceStatus } from '@/types/invoice'
import type {
  NotionInvoiceItemPage,
  NotionInvoicePage,
  NotionPropertyValue,
} from '@/types/notion'

// ---------------------------------------------------------------------------
// Notion 속성 키 상수 (실제 데이터베이스 스키마의 한글 필드명)
// - 오타/불일치를 막기 위해 한 곳에서만 관리
// ---------------------------------------------------------------------------
const INVOICE_PROPERTY = {
  invoiceNumber: '견적서 번호', // Title
  issueDate: '발행일', // Date
  status: '상태', // Select (대기/승인/거절)
  validUntil: '유효기간', // Date
  clientName: '클라이언트명', // Rich text
  items: '항목', // Relation → Items DB
} as const

const ITEM_PROPERTY = {
  description: '항목명', // Title
  amount: '금액', // Number/Formula (신뢰하지 않음)
  unitPrice: '단가', // Number
  quantity: '수량', // Number
} as const

// 한글 상태 라벨 → InvoiceStatus 역매핑 테이블
// INVOICE_STATUS_LABEL(정방향)을 뒤집어 생성하므로 라벨 정의가 바뀌어도 자동 동기화됨
const STATUS_BY_LABEL: Record<string, InvoiceStatus> = Object.entries(
  INVOICE_STATUS_LABEL
).reduce<Record<string, InvoiceStatus>>((acc, [status, label]) => {
  acc[label] = status as InvoiceStatus
  return acc
}, {})

type NotionProperties = NotionInvoicePage['properties']

// ---------------------------------------------------------------------------
// 속성 추출 헬퍼 (타입 가드 포함)
// - 속성이 없거나 예상과 다른 타입이면 어떤 페이지/필드에서 실패했는지 알 수 있는 에러 throw
// ---------------------------------------------------------------------------

/** 지정한 키의 속성을 가져오되, 없으면 에러 */
function getProperty(
  properties: NotionProperties,
  key: string,
  pageId: string
): NotionPropertyValue {
  const property = properties[key]
  if (!property) {
    throw new Error(
      `Notion 페이지(${pageId})에 '${key}' 속성이 존재하지 않습니다.`
    )
  }
  return property
}

/** Title 속성의 평문 텍스트 추출 */
function getTitle(
  properties: NotionProperties,
  key: string,
  pageId: string
): string {
  const property = getProperty(properties, key, pageId)
  if (property.type !== 'title') {
    throw new Error(
      `Notion 페이지(${pageId})의 '${key}' 속성 타입이 title 이 아닙니다. (실제: ${property.type})`
    )
  }
  return property.title.map(token => token.plain_text).join('')
}

/** Rich text 속성의 평문 텍스트 추출 */
function getRichText(
  properties: NotionProperties,
  key: string,
  pageId: string
): string {
  const property = getProperty(properties, key, pageId)
  if (property.type !== 'rich_text') {
    throw new Error(
      `Notion 페이지(${pageId})의 '${key}' 속성 타입이 rich_text 가 아닙니다. (실제: ${property.type})`
    )
  }
  return property.rich_text.map(token => token.plain_text).join('')
}

/** Number 속성 추출. 값이 비어 있으면 null 반환 */
function getNumber(
  properties: NotionProperties,
  key: string,
  pageId: string
): number | null {
  const property = getProperty(properties, key, pageId)
  if (property.type !== 'number') {
    throw new Error(
      `Notion 페이지(${pageId})의 '${key}' 속성 타입이 number 가 아닙니다. (실제: ${property.type})`
    )
  }
  return property.number
}

/** Date 속성의 시작일(ISO 문자열) 추출. 필수값이 비어 있으면 에러 */
function getDateStart(
  properties: NotionProperties,
  key: string,
  pageId: string
): string {
  const property = getProperty(properties, key, pageId)
  if (property.type !== 'date') {
    throw new Error(
      `Notion 페이지(${pageId})의 '${key}' 속성 타입이 date 가 아닙니다. (실제: ${property.type})`
    )
  }
  const start = property.date?.start
  if (!start) {
    throw new Error(
      `Notion 페이지(${pageId})의 '${key}' 날짜 속성이 비어 있습니다.`
    )
  }
  return start
}

/**
 * Select 또는 Status 속성의 선택된 이름 추출. 비어 있으면 에러.
 * Notion의 "Status" 속성(type: 'status')은 UI상 Select와 유사해 보이지만
 * API 응답 타입이 별도(select와 다른 프로퍼티 타입)이므로 둘 다 처리한다.
 */
function getSelectName(
  properties: NotionProperties,
  key: string,
  pageId: string
): string {
  const property = getProperty(properties, key, pageId)
  const name =
    property.type === 'select'
      ? property.select?.name
      : property.type === 'status'
        ? property.status?.name
        : undefined

  if (property.type !== 'select' && property.type !== 'status') {
    throw new Error(
      `Notion 페이지(${pageId})의 '${key}' 속성 타입이 select/status 가 아닙니다. (실제: ${property.type})`
    )
  }
  if (!name) {
    throw new Error(
      `Notion 페이지(${pageId})의 '${key}' select/status 속성이 비어 있습니다.`
    )
  }
  return name
}

/** Relation 속성에 연결된 페이지 id 배열 추출 */
export function getRelationIds(
  properties: NotionProperties,
  key: string,
  pageId: string
): string[] {
  const property = getProperty(properties, key, pageId)
  if (property.type !== 'relation') {
    throw new Error(
      `Notion 페이지(${pageId})의 '${key}' 속성 타입이 relation 이 아닙니다. (실제: ${property.type})`
    )
  }
  return property.relation.map(relation => relation.id)
}

/** 한글 상태 라벨을 InvoiceStatus 로 역매핑. 매칭 실패 시 에러 */
function toInvoiceStatus(label: string, pageId: string): InvoiceStatus {
  const status = STATUS_BY_LABEL[label]
  if (!status) {
    throw new Error(
      `Notion 페이지(${pageId})의 상태값 '${label}' 을(를) InvoiceStatus 로 매핑할 수 없습니다.`
    )
  }
  return status
}

// ---------------------------------------------------------------------------
// 항목(Items) 페이지 → InvoiceItem 변환
// ---------------------------------------------------------------------------
function parseInvoiceItem(itemPage: NotionInvoiceItemPage): InvoiceItem {
  const { id, properties } = itemPage

  const description = getTitle(properties, ITEM_PROPERTY.description, id)
  // 수량/단가가 비어 있으면 0 으로 간주하여 계산 안정성 확보
  const quantity = getNumber(properties, ITEM_PROPERTY.quantity, id) ?? 0
  const unitPrice = getNumber(properties, ITEM_PROPERTY.unitPrice, id) ?? 0

  return {
    id,
    description,
    quantity,
    unitPrice,
    // `금액`(Formula) 필드는 API 로 읽기 까다로워 신뢰하지 않고 항상 계산값 사용
    amount: quantity * unitPrice,
  }
}

// ---------------------------------------------------------------------------
// 견적서 페이지 + 항목 페이지들 → Invoice 변환 (순수 함수)
// ---------------------------------------------------------------------------
export function parseInvoicePage(
  page: NotionInvoicePage,
  itemPages: NotionInvoiceItemPage[]
): Invoice {
  const { id, properties } = page

  const invoiceNumber = getTitle(properties, INVOICE_PROPERTY.invoiceNumber, id)
  const clientName = getRichText(properties, INVOICE_PROPERTY.clientName, id)
  const issueDate = getDateStart(properties, INVOICE_PROPERTY.issueDate, id)
  const validUntil = getDateStart(properties, INVOICE_PROPERTY.validUntil, id)
  const status = toInvoiceStatus(
    getSelectName(properties, INVOICE_PROPERTY.status, id),
    id
  )

  const items = itemPages.map(parseInvoiceItem)

  // 항목이 추가/변경되어도 항상 최신 합계가 반영되도록 `총 금액` 속성은 사용하지 않고 매번 재계산
  const totalAmount = items.reduce((sum, item) => sum + item.amount, 0)

  return {
    id,
    invoiceNumber,
    clientName,
    issueDate,
    validUntil,
    items,
    totalAmount,
    status,
  }
}
