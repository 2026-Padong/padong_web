import type { ReactNode } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

// Figma 1:1: Tile · StatusBadge (1315:4051) > StatusBadge COMPONENT_SET
// flex items-center px-sm py-xxs rounded-full
// Text: Noto Sans KR Bold 11px
const variants = cva(
  'inline-flex items-center rounded-full px-sm py-xxs text-body-s font-bold whitespace-nowrap',
  {
    variants: {
      state: {
        positive: 'bg-status-positive-bg text-status-positive',
        neutral: 'bg-status-neutral-bg text-status-neutral',
        warning: 'bg-status-warning-bg text-status-warning',
        critical: 'bg-status-critical-bg text-status-critical',
      },
    },
  },
)

export interface StatusBadgeProps extends VariantProps<typeof variants> {
  children: ReactNode
}

export function StatusBadge({ state, children }: StatusBadgeProps) {
  return <span className={variants({ state })}>{children}</span>
}
