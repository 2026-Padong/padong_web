import { Minus, TrendingDown, TrendingUp, type LucideIcon } from 'lucide-react'
import { cva } from 'class-variance-authority'

// Figma 1:1: Tile · TrendPill (1304:4053) > TrendPill COMPONENT_SET (3 variants)
// flex gap-[5px] items-center px-[10px] py-[4px] rounded-full
// 14x14 icon + Bold 11px text
// Variant: 감소(critical) / 증가(positive) / 유지(neutral)
const variants = cva(
  'inline-flex items-center gap-[5px] rounded-full px-[10px] py-[4px] text-body-s font-bold whitespace-nowrap',
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
