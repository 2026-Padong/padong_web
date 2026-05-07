import type { ReactNode } from 'react'

// Figma 1:1: Tile · SectionTitle (453:857) > SectionTitle COMPONENT
// flex gap-0 items-start
// Text: Noto Sans KR Bold 16px text-text-secondary
export interface SectionTitleProps {
  children: ReactNode
}

export function SectionTitle({ children }: SectionTitleProps) {
  return (
    <h3 className="text-subhead font-bold text-text-secondary whitespace-nowrap">{children}</h3>
  )
}
