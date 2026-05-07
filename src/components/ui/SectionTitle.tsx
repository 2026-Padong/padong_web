import type { ReactNode } from 'react'

export interface SectionTitleProps {
  children: ReactNode
}

export function SectionTitle({ children }: SectionTitleProps) {
  return <h3 className="text-subhead font-bold text-text-secondary">{children}</h3>
}
