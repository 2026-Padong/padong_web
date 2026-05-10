import { cva } from 'class-variance-authority'
import { Icon, type IconName } from './Icon'

// Figma 1:1: Tile · TrendPill (1304:4053) > TrendPill COMPONENT_SET (3 variants)
// flex gap-xxs items-center px-sm py-xxs rounded-full
// 14x14 자체 SVG (trend-*) + Bold 11px text
// Variant: 감소(critical) / 증가(positive) / 유지(neutral)
const variants = cva(
  'inline-flex items-center gap-xxs rounded-full px-sm py-xxs text-body-s font-bold whitespace-nowrap',
  {
    variants: {
      trend: {
        down: 'bg-status-critical-bg text-status-critical',
        up: 'bg-status-positive-bg text-status-positive',
        flat: 'bg-status-neutral-bg text-status-neutral',
      },
    },
  },
)

export interface TrendPillProps {
  trend?: 'down' | 'up' | 'flat'
}

const ICON: Record<NonNullable<TrendPillProps['trend']>, IconName> = {
  down: 'trend-down',
  up: 'trend-up',
  flat: 'trend-flat',
}

const LABEL: Record<NonNullable<TrendPillProps['trend']>, string> = {
  down: '감소 예상',
  up: '증가 예상',
  flat: '평소 수준',
}

export function TrendPill({ trend = 'flat' }: TrendPillProps) {
  return (
    <span className={variants({ trend })}>
      <Icon name={ICON[trend]} size={14} aria-hidden />
      {LABEL[trend]}
    </span>
  )
}
