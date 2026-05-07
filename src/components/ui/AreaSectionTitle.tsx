import type { ReactNode } from 'react'

// Figma 1:1: Tile · AreaSectionTitle (927:3129) > AreaSectionTitle COMPONENT
// flex items-start
// Text: Noto Sans KR Bold 18px text-text-primary
// Figma 기본값 "용산구 지역 정보"
export interface AreaSectionTitleProps {
  children?: ReactNode
}

export function AreaSectionTitle({ children = '용산구 지역 정보' }: AreaSectionTitleProps) {
  return (
    <div className="flex items-start">
      <h3 className="text-h4 font-bold text-text-primary whitespace-nowrap">{children}</h3>
    </div>
  )
}
