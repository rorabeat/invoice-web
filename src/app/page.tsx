export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-2 px-4 text-center">
      <h1 className="text-2xl font-bold">견적서 관리 시스템</h1>
      <p className="text-muted-foreground text-sm">
        견적서는 전달받은 고유 링크(/invoice/[id])로 접속해 주세요.
      </p>
    </div>
  )
}
