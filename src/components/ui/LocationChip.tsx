import { MapPin } from 'lucide-react'

// Figma 1:1: Tile · LocationChip (598:1650) > LocationChip COMPONENT
// w-[69px] flex items-center justify-between rounded-lg bg-neutral-white
// LocationIcon: 20x17 컨테이너 + Pin 12x17 (Figma raster, lucide MapPin로 대체)
// Text: Noto Sans KR Bold 16px text-brand-primary
export interface LocationChipProps {
  /** 지명 (기본: "연희동") */
  name?: string
}

export function LocationChip({ name = '연희동' }: LocationChipProps) {
  return (
    <div className="inline-flex w-[69px] items-center justify-between rounded-lg bg-neutral-white">
      <div className="flex w-[20px] items-center justify-center overflow-clip px-xxs">
        <MapPin size={14} className="text-brand-primary" />
      </div>
      <span className="text-subhead font-bold text-brand-primary whitespace-nowrap">{name}</span>
    </div>
  )
}
