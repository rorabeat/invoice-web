import { describe, expect, it } from 'vitest'

import { cn, formatCurrency } from './utils'

describe('formatCurrency', () => {
  it('원화 기호와 천단위 구분자를 포함해 포맷한다', () => {
    expect(formatCurrency(5000000)).toBe('₩5,000,000')
  })

  it('0원을 올바르게 표시한다', () => {
    expect(formatCurrency(0)).toBe('₩0')
  })
})

describe('cn', () => {
  it('클래스명을 병합한다', () => {
    expect(cn('a', false && 'b', 'c')).toBe('a c')
  })

  it('충돌하는 tailwind 클래스는 마지막 값을 우선한다', () => {
    expect(cn('p-2', 'p-4')).toBe('p-4')
  })
})
