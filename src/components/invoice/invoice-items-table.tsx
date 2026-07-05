import { PackageOpen } from 'lucide-react'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { EmptyState } from '@/components/ui/empty-state'
import { formatCurrency } from '@/lib/utils'
import type { InvoiceItem } from '@/types/invoice'

interface InvoiceItemsTableProps {
  items: InvoiceItem[]
}

export function InvoiceItemsTable({ items }: InvoiceItemsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>항목</TableHead>
          <TableHead className="text-right">수량</TableHead>
          <TableHead className="text-right">단가</TableHead>
          <TableHead className="text-right">금액</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.length === 0 ? (
          <TableRow>
            <TableCell colSpan={4}>
              <EmptyState
                icon={<PackageOpen className="mx-auto size-8" />}
                title="견적 항목이 없습니다"
              />
            </TableCell>
          </TableRow>
        ) : (
          items.map(item => (
            <TableRow key={item.id}>
              <TableCell className="whitespace-normal">
                {item.description}
              </TableCell>
              <TableCell className="text-right">{item.quantity}</TableCell>
              <TableCell className="text-right">
                {formatCurrency(item.unitPrice)}
              </TableCell>
              <TableCell className="text-right">
                {formatCurrency(item.amount)}
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )
}
