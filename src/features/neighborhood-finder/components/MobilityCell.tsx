import { Bus, Car, Footprints, type LucideIcon } from 'lucide-react'

// Figma 1:1: Tile · MobilityCell (453:854) > MobilityCell COMPONENT
// w-[105px] flex gap-0 items-center justify-center p-sm rounded-md bg-surface-subtle
// Inner: 36x36 icon + Text(V gap-xxs items-center) → label 10px Regular tertiary + value 14px Bold secondary
const ICON: Record<MobilityType, LucideIcon> = {
  transit: Bus,
  car: Car,
  walk: Footprints,
}

export type MobilityType = 'transit' | 'car' | 'walk'

const DEFAULT_LABEL: Record<MobilityType, string> = {
  transit: '대중교통',
  car: '자가용',
  walk: '도보',
}

export interface MobilityCellProps {
  type: MobilityType
  label?: string
  value: string
}

export function MobilityCell({ type, label, value }: MobilityCellProps) {
  const IconComponent = ICON[type]
  return (
    <div className="flex w-[105px] items-center justify-center rounded-md bg-surface-subtle p-sm">
      <div className="flex w-[81px] items-center justify-center gap-xxs">
        <IconComponent size={36} className="shrink-0 text-text-secondary" />
        <div className="flex flex-col items-center justify-center gap-xxs overflow-clip whitespace-nowrap">
          <span className="text-caption font-normal text-text-tertiary">
            {label ?? DEFAULT_LABEL[type]}
          </span>
          <span className="text-body-l font-bold text-text-secondary">{value}</span>
        </div>
      </div>
    </div>
  )
}
