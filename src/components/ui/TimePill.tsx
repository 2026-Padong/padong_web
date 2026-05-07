import type { ReactNode } from 'react'

export interface TimePillProps {
  children: ReactNode
}

export function TimePill({ children }: TimePillProps) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-xxs text-body-s font-bold text-text-secondary">
      {children}
    </span>
  )
}
