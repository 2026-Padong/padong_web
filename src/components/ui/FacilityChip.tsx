import { Bike, Bus, Train, type LucideIcon } from 'lucide-react'

// Figma 1:1: Tile · FacilityChip (1143:3708) > FacilityChip COMPONENT_SET (3 variants)
// size-[22px] rounded-full bg-brand-primary-tint
// Icon: 11x11 (Figma raster — lucide SVG로 대체, 시각 ≈동일)
const ICON: Record<FacilityChipProps['type'], LucideIcon> = {
  subway: Train,
  bus: Bus,
  bike: Bike,
}

export interface FacilityChipProps {
  type: 'subway' | 'bus' | 'bike'
}

export function FacilityChip({ type }: FacilityChipProps) {
  const IconComponent = ICON[type]
  return (
    <span className="inline-flex size-[22px] items-center justify-center rounded-full bg-brand-primary-tint">
      <IconComponent size={11} className="text-brand-primary" />
    </span>
  )
}
