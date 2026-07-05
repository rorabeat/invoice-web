import Link from 'next/link'

import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-2xl font-bold">견적서를 찾을 수 없습니다</h1>
      <p className="text-muted-foreground text-sm">
        요청하신 견적서가 존재하지 않거나 삭제되었을 수 있습니다.
      </p>
      <Button asChild>
        <Link href="/">홈으로 이동</Link>
      </Button>
    </div>
  )
}
