interface RateLimitEntry {
  count: number
  windowStart: number
}

// 서버리스 인스턴스별 in-memory 저장소 - 인스턴스가 여러 개거나 재시작되면 카운트가 초기화됨
// MVP 트래픽 규모의 남용 방지용 최소 장치이며, 엄밀한 보안 경계가 아님
const requestCounts = new Map<string, RateLimitEntry>()

interface RateLimitResult {
  allowed: boolean
  remaining: number
}

/** 지정한 key에 대해 windowMs 동안 최대 limit회 요청을 허용하는 고정 윈도우 rate limiter */
export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number
): RateLimitResult {
  const now = Date.now()
  const entry = requestCounts.get(key)

  if (!entry || now - entry.windowStart >= windowMs) {
    requestCounts.set(key, { count: 1, windowStart: now })
    return { allowed: true, remaining: limit - 1 }
  }

  if (entry.count >= limit) {
    return { allowed: false, remaining: 0 }
  }

  entry.count += 1
  return { allowed: true, remaining: limit - entry.count }
}
