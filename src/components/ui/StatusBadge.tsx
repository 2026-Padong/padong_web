import type { ReactNode } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

// Figma 1:1: Tile · StatusBadge (1315:4051) > StatusBadge COMPONENT_SET
// flex items-center px-[10px] py-[4px] rounded-full
// Text: Noto Sans KR Bold 11px
const variants = cva(
  'inline-flex items-center rounded-full px-[10px] py-[4px] text-body-s font-bold whitespace-nowrap',
  {
    variants: {
      state: {
        positive: 'bg-[#d9f2de] text-[#218c45]',
        neutral: 'bg-[#ebf0f5] text-[#5c6980]',
        warning: 'bg-[#fff0c7] text-[#8c660d]',
        critical: 'bg-[#fce3e3] text-[#c72e2e]',
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
