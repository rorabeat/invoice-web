import { expect, test } from '@playwright/test'

// 실제 Notion 워크스페이스의 유효한 견적서 페이지 ID가 필요한 테스트는
// E2E_INVOICE_ID 환경변수가 설정된 경우에만 실행한다 (자격증명 없는 환경에서는 skip).
const invoiceId = process.env.E2E_INVOICE_ID
const hasLiveInvoice = Boolean(invoiceId)

test.describe('견적서 조회 - 정상 플로우', () => {
  test.skip(!hasLiveInvoice, 'E2E_INVOICE_ID 환경변수가 설정되지 않음')

  test('유효한 견적서 ID로 접근 시 상세 정보가 렌더링된다', async ({
    page,
  }) => {
    await page.goto(`/invoice/${invoiceId}`)

    await expect(page.getByText('견적서 번호')).toBeVisible()
    await expect(page.getByRole('table')).toBeVisible()
    await expect(
      page.getByRole('button', { name: 'PDF 다운로드' })
    ).toBeVisible()
  })

  test('PDF 다운로드 버튼 클릭 시 파일이 다운로드된다', async ({ page }) => {
    await page.goto(`/invoice/${invoiceId}`)

    const downloadPromise = page.waitForEvent('download')
    await page.getByRole('button', { name: 'PDF 다운로드' }).click()
    const download = await downloadPromise

    expect(download.suggestedFilename()).toMatch(/\.pdf$/)
  })

  for (const viewport of [
    { width: 360, height: 800, label: '모바일' },
    { width: 768, height: 1024, label: '태블릿' },
    { width: 1280, height: 900, label: '데스크톱' },
  ]) {
    test(`${viewport.label} 뷰포트(${viewport.width}px)에서 레이아웃이 정상 표시된다`, async ({
      page,
    }) => {
      await page.setViewportSize(viewport)
      await page.goto(`/invoice/${invoiceId}`)

      await expect(page.getByText('견적서 번호')).toBeVisible()
      await expect(
        page.getByRole('button', { name: 'PDF 다운로드' })
      ).toBeVisible()
    })
  }
})

test.describe('견적서 조회 - 에러 플로우', () => {
  test('존재하지 않는 견적서 ID 접근 시 404 페이지가 표시된다', async ({
    page,
  }) => {
    await page.goto('/invoice/00000000-0000-0000-0000-000000000000')

    await expect(page.getByText('견적서를 찾을 수 없습니다')).toBeVisible()
  })
})
