import type { PageObjectResponse } from '@notionhq/client'

export type NotionInvoicePage = PageObjectResponse

// 견적서의 `항목` relation 으로 연결된 Items DB 페이지
// (구조상 PageObjectResponse 와 동일하지만, 의미를 구분하기 위한 별칭)
export type NotionInvoiceItemPage = PageObjectResponse

export type NotionPropertyValue = PageObjectResponse['properties'][string]
