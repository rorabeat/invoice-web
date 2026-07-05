import { APIErrorCode, APIResponseError, isFullPage } from '@notionhq/client'

import { notion } from '@/lib/notion'
import { getRelationIds, parseInvoicePage } from '@/lib/utils/notion-parser'
import type { Invoice } from '@/types/invoice'
import type { NotionInvoiceItemPage, NotionInvoicePage } from '@/types/notion'

// 견적서 relation 속성 키 (Invoices DB → Items DB 연결)
const ITEMS_RELATION_KEY = '항목'

/**
 * 조회하려는 견적서 페이지를 찾을 수 없을 때 발생하는 커스텀 에러
 * - Notion object_not_found, partial 응답, archived 페이지를 "없음"으로 통일 처리
 * - Task 008 의 상위 계층에서 notFound() 등으로 매핑하기 위해 별도 타입으로 구분
 */
export class NotionInvoiceNotFoundError extends Error {
  constructor(pageId: string) {
    super(`견적서 페이지를 찾을 수 없습니다. (pageId: ${pageId})`)
    this.name = 'NotionInvoiceNotFoundError'
  }
}

/** Notion 페이지가 사용 가능한 완전한(full) 활성 페이지인지 확인 */
function assertUsablePage(
  page: Awaited<ReturnType<typeof notion.pages.retrieve>>,
  pageId: string
): NotionInvoicePage {
  // partial 응답(속성 미포함)이면 파싱 불가 → 없음으로 취급
  if (!isFullPage(page)) {
    throw new NotionInvoiceNotFoundError(pageId)
  }
  // 보관(archived)/삭제(in_trash)된 페이지도 없음으로 취급
  if (page.archived || page.in_trash) {
    throw new NotionInvoiceNotFoundError(pageId)
  }
  return page
}

/**
 * Notion 페이지 id 로 견적서 단건 조회
 * @param notionPageId 조회할 견적서 페이지의 UUID
 * @returns 파싱된 Invoice
 * @throws {NotionInvoiceNotFoundError} 페이지가 없거나 archived/partial 인 경우
 * @throws 그 외 Notion API 에러는 그대로 rethrow (상위 error 경계에서 처리)
 */
export async function getInvoiceById(notionPageId: string): Promise<Invoice> {
  try {
    // 1) 견적서 본문 페이지 조회 및 유효성 검증
    const rawPage = await notion.pages.retrieve({ page_id: notionPageId })
    const invoicePage = assertUsablePage(rawPage, notionPageId)

    // 2) `항목` relation 에서 연결된 Items 페이지 id 배열 추출
    const itemPageIds = getRelationIds(
      invoicePage.properties,
      ITEMS_RELATION_KEY,
      invoicePage.id
    )

    // 3) 각 항목 페이지를 병렬 조회 (partial/archived 항목은 제외)
    const itemPages = await Promise.all(
      itemPageIds.map(itemPageId =>
        notion.pages.retrieve({ page_id: itemPageId })
      )
    )
    const usableItemPages: NotionInvoiceItemPage[] = itemPages.filter(
      (itemPage): itemPage is NotionInvoiceItemPage =>
        isFullPage(itemPage) && !itemPage.archived && !itemPage.in_trash
    )

    // 4) Invoice 타입으로 파싱하여 반환
    return parseInvoicePage(invoicePage, usableItemPages)
  } catch (error) {
    // Notion API 가 "대상 없음" 을 반환하면 커스텀 NotFound 에러로 변환
    if (
      error instanceof APIResponseError &&
      error.code === APIErrorCode.ObjectNotFound
    ) {
      throw new NotionInvoiceNotFoundError(notionPageId)
    }
    // 이미 NotFound 로 판정된 경우 그대로 전파
    if (error instanceof NotionInvoiceNotFoundError) {
      throw error
    }
    // 그 외(rate limit, 인증 오류 등)는 상위 계층에서 처리하도록 rethrow
    throw error
  }
}
