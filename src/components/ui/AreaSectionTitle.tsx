import type { ReactNode } from 'react'

export interface AreaSectionTitleProps {
  children: ReactNode
}

export function AreaSectionTitle({ children }: AreaSectionTitleProps) {
  return <h3 className="text-h3 font-bold text-text-secondary">{children}</h3>
}
