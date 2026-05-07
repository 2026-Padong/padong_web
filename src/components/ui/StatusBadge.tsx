import type { ReactNode } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

const variants = cva('inline-flex items-center rounded-full px-2.5 py-xxs text-body-s font-bold', {
  variants: {
    state: {
      positive: 'bg-[#d9f2de] text-[#218c45]',
      neutral: 'bg-[#ebf0f5] text-[#5c6980]',
      warning: 'bg-[#fff0c7] text-[#8c660d]',
      critical: 'bg-[#fce3e3] text-[#c72e2e]',
    },
  },
})

export interface StatusBadgeProps extends VariantProps<typeof variants> {
  children: ReactNode
}

export function StatusBadge({ state, children }: StatusBadgeProps) {
  return <span className={variants({ state })}>{children}</span>
}
