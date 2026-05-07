import { Minus, TrendingDown, TrendingUp, type LucideIcon } from 'lucide-react'
import { cva } from 'class-variance-authority'

const variants = cva(
  'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-body-s font-bold',
  {
    variants: {
      trend: {
        down: 'bg-[#fce3e3] text-[#c72e2e]',
        up: 'bg-[#d9f2de] text-[#218c45]',
        flat: 'bg-[#ebf0f5] text-[#5c6980]',
      },
    },
  },
)

const ICON: Record<NonNullable<TrendPillProps['trend']>, LucideIcon> = {
  down: TrendingDown,
  up: TrendingUp,
  flat: Minus,
}

const LABEL: Record<NonNullable<TrendPillProps['trend']>, string> = {
  down: '감소 예상',
  up: '증가 예상',
  flat: '평소 수준',
}

export interface TrendPillProps {
  trend?: 'down' | 'up' | 'flat'
}

export function TrendPill({ trend = 'flat' }: TrendPillProps) {
  const IconComponent = ICON[trend]
  return (
    <span className={variants({ trend })}>
      <IconComponent size={14} />
      {LABEL[trend]}
    </span>
  )
}
