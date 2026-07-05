# 🚀 Vercel 배포 가이드

이 문서는 노션 기반 견적서 관리 시스템을 Vercel에 배포하는 절차를 안내합니다. Next.js 프로젝트는 별도 설정 파일 없이 Vercel에서 자동 인식되므로, 여기서는 프로젝트 연결과 환경변수 등록 절차만 다룹니다.

## 1. Vercel 프로젝트 생성 및 저장소 연결

1. [Vercel](https://vercel.com) 계정으로 로그인 후 "Add New Project" 선택
2. 이 저장소(GitHub 등)를 Import
3. Framework Preset은 Next.js가 자동 감지됨 (별도 설정 불필요)

## 2. 환경변수 등록

Vercel 프로젝트의 "Settings → Environment Variables"에서 아래 값을 등록합니다. 값은 `docs/guides/notion-setup.md`에서 발급받은 실제 값을 사용합니다.

| 변수명                | 설명                            | 환경                           |
| --------------------- | ------------------------------- | ------------------------------ |
| `NOTION_API_KEY`      | Notion Integration Secret       | Production/Preview/Development |
| `NOTION_DATABASE_ID`  | Invoices 데이터베이스 ID        | Production/Preview/Development |
| `NEXT_PUBLIC_APP_URL` | 배포된 서비스의 공개 URL (선택) | Production                     |

## 3. 배포

환경변수 등록 후 "Deploy" 버튼을 클릭하면 자동으로 빌드 및 배포가 진행됩니다. 이후 `main` 브랜치에 푸시할 때마다 자동 배포됩니다.

## 4. 배포 후 확인

- `/invoice/[실제 견적서 페이지 ID]` 접속 시 실제 Notion 데이터가 표시되는지 확인
- 존재하지 않는 ID 접근 시 404 페이지가 표시되는지 확인
- PDF 다운로드 버튼이 정상 동작하는지 확인

> ⚠️ 실제 Vercel 프로젝트 생성, 저장소 연결, 환경변수 값 입력은 AI가 대신 수행할 수 없는 사용자 액션입니다.
