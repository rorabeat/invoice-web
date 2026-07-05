'use client'

import { Button } from '@/components/ui/button'

export default function InvoiceError({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 px-4 py-16 text-center">
      <h1 className="text-2xl font-bold">문제가 발생했습니다</h1>
      <p className="text-muted-foreground text-sm">
        견적서를 불러오는 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.
      </p>
      <Button onClick={reset}>다시 시도</Button>
    </div>
  )
}
