# Task 005: 견적서 조회 페이지 UI 구현

## 개요

Task 004에서 만든 더미 데이터를 사용해 `/invoice/[notionPageId]` 페이지에 실제 견적서 뷰 UI를 구현한다. Notion 연동(Task 007~008) 이전까지는 목업 데이터로 화면을 완성하는 것이 목표.

## 선행 조건

- Task 004 완료 (`src/lib/mock/invoice.mock.ts`, `table` 컴포넌트)

## 관련 파일

- `src/components/invoice/invoice-header.tsx` (신규) — 회사 정보, 견적서 번호, 발행일/유효기간
- `src/components/invoice/client-info.tsx` (신규) — 클라이언트명 등 수신자 정보
- `src/components/invoice/invoice-items-table.tsx` (신규) — 항목/수량/단가/금액 테이블 (shadcn Table 사용)
- `src/components/invoice/invoice-summary.tsx` (신규) — 총액 요약
- `src/components/invoice/pdf-download-button.tsx` (신규, `'use client'`) — PDF 다운로드 버튼 UI (클릭 핸들러는 Task 009에서 구현, 지금은 UI만)
- `src/components/invoice/invoice-view.tsx` (신규) — 위 컴포넌트들을 조립하는 Server Component
- `src/app/invoice/[notionPageId]/page.tsx` (수정) — 목업 데이터를 조회해 `InvoiceView`에 전달

## 구현 단계

1. **`invoice-header.tsx`**: 견적서 번호(`invoiceNumber`), 상태 배지(`INVOICE_STATUS_LABEL` + Badge), 발행일/유효기간 표시
2. **`client-info.tsx`**: 클라이언트명 표시 (Card 또는 섹션)
3. **`invoice-items-table.tsx`**: `InvoiceItem[]`을 받아 설명/수량/단가/금액 컬럼으로 렌더링, 모바일에서는 가로 스크롤 또는 카드형으로 전환
4. **`invoice-summary.tsx`**: `totalAmount`를 통화 포맷(`Intl.NumberFormat('ko-KR')`)으로 표시
5. **`pdf-download-button.tsx`**: 버튼 UI만 구현 (onClick은 placeholder, 실제 PDF 로직은 Task 009)
6. **`invoice-view.tsx`**: 위 컴포넌트를 세로로 배치하는 Server Component, `Invoice` 타입을 props로 받음
7. **`page.tsx` 수정**: `createMockInvoice`/`mockInvoices`에서 `notionPageId`에 해당하는 목업을 찾아 `InvoiceView`에 전달 (없으면 임시로 첫 번째 목업 사용 — 실제 조회 로직은 Task 008)
8. **반응형 레이아웃**: `sm:`/`md:`/`lg:` 브레이크포인트로 모바일/태블릿/데스크톱 대응, 최대 너비 컨테이너로 가독성 확보

## 수락 기준

- [ ] `/invoice/[아무id]` 접속 시 목업 데이터 기반 견적서 화면이 표시됨
- [ ] 헤더, 클라이언트 정보, 항목 테이블, 총액, PDF 버튼이 모두 렌더링됨
- [ ] 항목이 1개인 경우와 여러 개인 경우 모두 레이아웃이 깨지지 않음
- [ ] 모바일(360px)/태블릿(768px)/데스크톱(1280px) 뷰포트에서 레이아웃 확인
- [ ] `npm run check-all` 및 `npm run build` 통과

## 다음 작업과의 연결

- Task 006에서 이 화면에 대응하는 로딩 스켈레톤을 실제 레이아웃에 맞춰 개선
- Task 008에서 목업 조회 로직을 실제 Notion API 호출로 교체
- Task 009에서 `pdf-download-button.tsx`의 클릭 핸들러에 실제 PDF 생성 로직 연결
