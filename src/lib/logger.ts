/** 구조화된 에러 로그 출력 (타임스탬프 + 컨텍스트 + 메시지) */
export function logError(context: string, error: unknown) {
  const message = error instanceof Error ? error.message : String(error)
  console.error(`[${new Date().toISOString()}] [${context}] ${message}`)
}
