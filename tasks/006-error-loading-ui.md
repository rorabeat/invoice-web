# Task 006: 에러 및 로딩 상태 UI 구현

## 개요

기본 골격(Phase 1)에서 만든 `not-found.tsx`, `error.tsx`, `loading.tsx`는 범용 플레이스홀더 상태다. Task 005에서 완성된 실제 견적서 레이아웃(헤더 + 클라이언트 정보 + 테이블 + 요약)에 맞춰 스켈레톤을 다듬고, 항목이 없는 경우를 위한 빈 상태 컴포넌트를 추가한다.

## 선행 조건

- Task 005 완료 (실제 견적서 레이아웃 구조 확정)

## 현재 상태 참고

- `src/app/not-found.tsx` — 커스텀 404 존재 (제목/설명/홈 버튼)
- `src/app/invoice/[notionPageId]/error.tsx` — 클라이언트 컴포넌트, 재시도 버튼 존재
- `src/app/invoice/[notionPageId]/loading.tsx` — 범용 Skeleton 4개 (제목/텍스트 2줄/큰 블록), 실제 레이아웃과 불일치

## 관련 파일

- `src/app/invoice/[notionPageId]/loading.tsx` (수정) — Task 005 레이아웃(헤더/클라이언트정보/테이블/요약) 형태에 맞춘 스켈레톤으로 교체
- `src/components/invoice/invoice-skeleton.tsx` (신규) — loading.tsx에서 사용할 스켈레톤 본체 (재사용 목적)
- `src/components/ui/empty-state.tsx` (신규) — 항목 없음 등 범용 빈 상태 컴포넌트 (아이콘 + 메시지 + 선택적 액션)
- `src/app/invoice/[notionPageId]/error.tsx` (검토) — 메시지/버튼 톤 일관성 확인, 필요 시 문구만 다듬기

## 구현 단계

1. **`invoice-skeleton.tsx`**: Task 005의 `invoice-view.tsx` 구조(헤더 영역, 클라이언트 정보 영역, 테이블 행 3~4개, 요약 영역)를 Skeleton 블록으로 재현
2. **`loading.tsx` 교체**: 기존 범용 Skeleton 대신 `InvoiceSkeleton` 사용
3. **`empty-state.tsx`**: `icon`, `title`, `description`, 선택적 `action` props를 받는 재사용 컴포넌트 — 견적 항목이 0개인 극단적 케이스에서 `invoice-items-table.tsx`가 이 컴포넌트를 사용하도록 연결
4. **404/에러 페이지 문구 검토**: F011(잘못된 URL 접근 시 에러 처리) 기준에 맞게 사용자 친화적 문구인지 확인, 과도한 수정은 지양

## 수락 기준

- [ ] `/invoice/[id]` 접속 직후(느린 네트워크 시뮬레이션) 실제 레이아웃과 유사한 스켈레톤이 보임
- [ ] 항목이 0개인 목업으로 테스트 시 빈 상태 컴포넌트가 표시됨
- [ ] 존재하지 않는 `notionPageId` 접근 시 404 페이지, 강제 에러 발생 시 error.tsx가 정상 동작
- [ ] `npm run check-all` 및 `npm run build` 통과

## 다음 작업과의 연결

- Phase 3(Task 007~008)에서 실제 Notion API 에러(존재하지 않는 페이지, 권한 오류 등)를 이 UI들과 연결
