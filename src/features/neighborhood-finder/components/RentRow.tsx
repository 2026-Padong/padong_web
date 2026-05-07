import { KindIcon, type KindIconType } from '@/components/ui/KindIcon'

// Figma 1:1: Tile · RentRow (453:848) > RentRow COMPONENT
// w-[373px] flex gap-sm items-center py-xs
// 36x36 icon (Figma raster 'Frame' — KindIcon SVG 사용, 시각 ≈동일)
// TextContent (V gap-xxs items-start):
//   - title: Noto Sans KR Bold 16px text-text-secondary
//   - meta: Noto Sans KR Regular 12px text-text-tertiary
export interface RentRowProps {
  iconType?: KindIconType
  title: string
  /** 가격 정보 — 예: "월세 200/30 · 전세 8,000 만원" */
  meta?: string
}

export function RentRow({ iconType = 'Apart', title, meta }: RentRowProps) {
  return (
    <div className="flex items-center gap-sm py-xs">
      <KindIcon type={iconType} size={36} className="shrink-0 text-text-secondary" />
      <div className="flex flex-1 flex-col items-start gap-xxs overflow-clip whitespace-nowrap">
        <span className="text-subhead font-bold text-text-secondary">{title}</span>
        {meta && <span className="text-[12px] font-normal text-text-tertiary">{meta}</span>}
      </div>
    </div>
  )
}
