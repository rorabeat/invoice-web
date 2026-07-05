# 노션 기반 견적서 관리 시스템

노션을 데이터베이스로 활용하여 견적서를 관리하고, 클라이언트가 웹에서 조회 및 PDF 다운로드할 수 있는 시스템입니다.

## 🎯 프로젝트 개요

**목적**: 노션을 데이터베이스로 활용하여 견적서를 관리하고, 클라이언트가 웹에서 조회 및 PDF 다운로드할 수 있는 시스템
**범위**: MVP는 별도의 관리자 페이지 없이 노션 데이터베이스를 직접 사용하며, 견적서 조회 페이지와 404 에러 페이지로 구성됩니다
**사용자**: 견적서를 발행하는 프리랜서/소규모 기업과 견적서를 받는 클라이언트

## 📱 주요 페이지

1. **견적서 조회 페이지** (`/invoice/[notionPageId]`) - 클라이언트가 고유 링크를 통해 견적서를 조회하고 PDF로 다운로드하는 공개 페이지 (인증 불필요)
2. **404 에러 페이지** - 존재하지 않는 견적서 ID로 접근 시 안내 메시지를 표시하는 페이지

## ⚡ 핵심 기능

- **노션 데이터베이스 연동**: Notion API를 통해 견적서 데이터 조회
- **견적서 조회**: 고유 URL로 특정 견적서 내용 표시 (발행일, 유효기간, 항목별 금액, 총액 등)
- **PDF 다운로드**: 견적서를 PDF 파일로 변환 및 다운로드
- **견적서 유효성 검증**: 존재하지 않는 견적서 접근 시 404 에러 처리
- **반응형 레이아웃**: 모바일/태블릿/데스크톱 대응

## 🛠️ 기술 스택

- **Framework**: Next.js 15.5.3 (App Router + Turbopack)
- **Runtime**: React 19.1.0
- **Language**: TypeScript 5
- **Styling**: TailwindCSS v4
- **UI Components**: shadcn/ui (new-york style) + Radix UI + Lucide Icons
- **Forms**: React Hook Form + Zod
- **외부 API**: @notionhq/client (Notion API) — 향후 연동 예정
- **PDF 생성**: @react-pdf/renderer 또는 Puppeteer — 향후 연동 예정
- **배포**: Vercel

## 🚀 시작하기

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build

# 전체 검사 (타입체크 + lint + format)
npm run check-all
```

개발 서버 실행 후 [http://localhost:3000](http://localhost:3000) 에서 확인할 수 있습니다.

### 환경 변수

Notion 연동 구현 시 다음 환경 변수가 필요합니다 (`.env.local`):

```env
NOTION_API_KEY=secret_xxxxxxxxxxxxx
NOTION_DATABASE_ID=xxxxxxxxxxxxx
```

## 📋 개발 상태

- ✅ 기본 프로젝트 구조 설정 (Next.js 15 + shadcn/ui 스타터 초기화 및 정리)
- ⏳ Notion API 연동 (F001)
- ⏳ 견적서 조회 페이지 `/invoice/[id]` (F002, F011, F012)
- ⏳ PDF 다운로드 (F003)

## 📖 문서

- [PRD 문서](./docs/PRD.md) - 상세 요구사항
- [개발 가이드](./CLAUDE.md) - 개발 지침
