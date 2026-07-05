import { Client } from '@notionhq/client'

import { env } from '@/lib/env'

// Notion API 클라이언트 싱글턴
// - 인증 키는 환경 변수(NOTION_API_KEY)에서만 주입하여 클라이언트로 노출되지 않도록 함
// - 서버 전용 모듈에서만 import 할 것 (Server Component / Server Action / 서비스 계층)
export const notion = new Client({
  auth: env.NOTION_API_KEY,
})
