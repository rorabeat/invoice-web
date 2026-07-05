# Task 004: 공통 컴포넌트 라이브러리 구축

## 개요

Phase 2(UI/UX 완성) 첫 단계. shadcn/ui 기본 컴포넌트는 이미 설치되어 있으므로, 이번 작업은 (1) 견적서 UI를 목업으로 만드는 데 필요한 **더미 데이터 생성 유틸리티**와 (2) Task 005에서 필요한 **추가 shadcn 컴포넌트(Table)**, (3) 디자인 시스템 토큰 점검에 집중한다.

## 현재 상태 참고

- `src/types/invoice.ts`에 `Invoice`, `InvoiceItem`, `InvoiceStatus` 타입 정의 완료
- `src/lib/constants.ts`에 `INVOICE_STATUS_LABEL` 정의 완료
- shadcn/ui 컴포넌트 설치 완료: alert, avatar, badge, button, card, checkbox, dialog, dropdown-menu, form, input, label, navigation-menu, progress, select, separator, sheet, skeleton, sonner
- **Table 컴포넌트 미설치** — Task 005의 견적 항목 테이블에 필요

## 관련 파일

- `src/lib/mock/invoice.mock.ts` (신규) — 더미 견적서 데이터 생성 함수
- `src/components/ui/table.tsx` (신규, shadcn 설치)
- `src/app/globals.css` (검토만, 필요 시 보강)

## 구현 단계

1. **shadcn table 컴포넌트 추가**

   ```bash
   npx shadcn@latest add table
   ```

2. **더미 데이터 유틸리티 작성** (`src/lib/mock/invoice.mock.ts`)
   - `createMockInvoice(overrides?: Partial<Invoice>): Invoice` — 단일 목업 견적서 생성
   - `mockInvoices: Invoice[]` — 상태(대기/승인/거절)별 샘플 3~5건 (항목 1개짜리, 다항목, 긴 설명 등 엣지 케이스 포함)
   - 금액 필드는 `quantity * unitPrice` 계산이 `amount`와 일치하도록 생성

3. **디자인 토큰 점검** (`src/app/globals.css`)
   - 기존 TailwindCSS v4 + shadcn `new-york` 테마의 색상/타이포그래피 변수 확인
   - 견적서 문서 성격에 맞는 폰트(가독성 있는 sans/serif) 필요 여부만 검토 — 새 토큰이 필요 없으면 변경하지 않는다 (과도한 설계 금지)

## 수락 기준

- [ ] `npx shadcn@latest add table` 실행 후 `src/components/ui/table.tsx` 생성됨
- [ ] `createMockInvoice`로 생성한 객체가 `Invoice` 타입을 만족함
- [ ] 최소 3개 상태(대기/승인/거절)를 포함한 목업 데이터 세트 존재
- [ ] `npm run check-all` 통과 (타입/린트/포맷)

## 다음 작업과의 연결

- Task 005에서 `mockInvoices`를 `/invoice/[notionPageId]` 페이지에 연결해 실제 UI를 렌더링한다.
