# 🔑 Notion 연동 설정 가이드

이 문서는 노션 기반 견적서 관리 시스템이 실제 Notion 데이터베이스와 통신하기 위해 필요한 자격증명 설정 방법과, Task 007(Notion API 통합 구현) 착수 순서를 안내합니다.

## 1. Notion Integration 발급

1. [Notion Developers](https://www.notion.so/my-integrations) 접속
2. "New integration" 클릭
3. Integration 이름 입력 (예: "견적서 시스템")
4. 워크스페이스 선택 후 생성
5. 생성된 Integration의 "Internal Integration Secret"을 복사해 둡니다 (다음 단계에서 사용)

## 2. 데이터베이스에 Integration 연결

1. Notion에서 견적서(Invoices) 데이터베이스 페이지를 엽니다
2. 우측 상단 "..." 메뉴 → "연결 추가(Add connections)" → 1단계에서 만든 Integration 선택
3. 항목(Items) 데이터베이스에도 동일하게 Integration을 연결합니다 (견적서와 항목이 Relation으로 연결되어 있으므로 두 데이터베이스 모두 연결 필요)

## 3. Database ID 확인

1. Notion에서 Invoices 데이터베이스를 브라우저로 엽니다
2. 주소창 URL에서 데이터베이스 ID(32자리 영숫자)를 확인합니다
   ```
   https://www.notion.so/workspace/{DATABASE_ID}?v=...
   ```
3. `-` 하이픈 유무는 무관하며, 하이픈 없는 32자리 형태를 그대로 사용합니다

## 4. .env.local 설정

1. 프로젝트 루트에서 `.env.example`을 복사해 `.env.local`을 생성합니다
   ```bash
   cp .env.example .env.local
   ```
2. 아래와 같이 실제 값을 입력합니다
   ```env
   NOTION_API_KEY=secret_xxxxxxxxxxxxx
   NOTION_DATABASE_ID=xxxxxxxxxxxxx
   ```
3. `NOTION_DATABASE_ID`는 Invoices 데이터베이스 ID를 사용합니다 (Items 데이터베이스는 Invoices 페이지의 `항목` Relation을 통해 조회하므로 별도 환경 변수가 필요하지 않습니다)

> ⚠️ 실제 Integration Secret 발급과 `.env.local` 값 입력은 보안상 AI가 대신 수행할 수 없는 사용자 액션입니다.

---

## 5. Notion 데이터베이스 구성 체크리스트

`docs/PRD.md`의 데이터 모델을 기준으로 아래 속성이 실제 Notion 데이터베이스에 구성되어 있는지 확인합니다.

### Invoices 데이터베이스

- [ ] `견적서 번호` — Title
- [ ] `클라이언트명` — Text
- [ ] `발행일` — Date
- [ ] `유효기간` — Date
- [ ] `상태` — Select (`대기` / `승인` / `거절`)
- [ ] `총 금액` — Number
- [ ] `항목` — Relation → Items 데이터베이스

### Items 데이터베이스

- [ ] `항목명` — Title
- [ ] `수량` — Number
- [ ] `단가` — Number
- [ ] `금액` — Formula (수량 × 단가) 또는 Number
- [ ] `Invoices` — Relation → Invoices 데이터베이스 (역방향 Relation)

## 6. Task 007 착수 순서

Task 007(Notion API 통합 구현)은 아래 순서로 진행합니다.

1. `src/lib/env.ts` 확인 — `NOTION_API_KEY`/`NOTION_DATABASE_ID` 검증 스키마는 이미 구현되어 있음 (완료)
2. `src/lib/notion.ts` 생성 — Notion 클라이언트 초기화
3. `src/lib/utils/notion-parser.ts` 작성 — Notion 페이지/관계형 항목 데이터를 `Invoice`/`InvoiceItem` 타입으로 변환
4. `src/lib/services/invoice.service.ts` 작성 — 페이지 조회 + 관계형 항목 조회 + 파싱을 조합한 `getInvoiceById()`
5. `src/app/invoice/[notionPageId]/page.tsx`에서 목업 대신 실제 데이터 페칭 연결 (Task 008)
6. `.env.local`에 실제 Integration Secret / Database ID 입력 (사용자 액션)
