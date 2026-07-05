'use client'

import { Download, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import type { Invoice } from '@/types/invoice'

interface PdfDownloadButtonProps {
  invoice: Invoice
}

export function PdfDownloadButton({ invoice }: PdfDownloadButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false)

  async function handleDownload() {
    setIsGenerating(true)
    try {
      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invoiceData: invoice }),
      })

      if (!response.ok) {
        throw new Error('PDF 생성에 실패했습니다.')
      }

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${invoice.invoiceNumber}.pdf`
      link.click()
      URL.revokeObjectURL(url)
    } catch {
      toast.error('PDF 다운로드에 실패했습니다. 잠시 후 다시 시도해 주세요.')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Button onClick={handleDownload} disabled={isGenerating}>
      {isGenerating ? <Loader2 className="animate-spin" /> : <Download />}
      PDF 다운로드
    </Button>
  )
}
