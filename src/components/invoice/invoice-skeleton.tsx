import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function InvoiceSkeleton() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-8 sm:py-12">
      <Card>
        <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-7 w-40" />
          </div>
          <div className="flex flex-col gap-2 sm:items-end">
            <Skeleton className="h-5 w-14" />
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-4 w-36" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex flex-col gap-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-6 w-32" />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex flex-col gap-3">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-center justify-between">
          <Skeleton className="h-5 w-12" />
          <Skeleton className="h-7 w-28" />
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Skeleton className="h-9 w-32" />
      </div>
    </div>
  )
}
