import type { ReactNode } from 'react'

// Figma 1:1: Tile · TimePill (1143:3705) > TimePill COMPONENT
// flex items-center pl-xs pr-sm py-xxs rounded-full
// label: Noto Sans KR Bold 11px text-text-secondary
export interface TimePillProps {
  children: ReactNode
}

export function TimePill({ children }: TimePillProps) {
  return (
    <span className="inline-flex items-center rounded-full pl-xs pr-sm py-xxs text-body-s font-bold text-text-secondary whitespace-nowrap">
      {children}
    </span>
  )
}
