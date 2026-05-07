import { Bike, Bus, Train, type LucideIcon } from 'lucide-react'

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
    <span className="inline-flex h-[22px] w-[22px] items-center justify-center rounded-full bg-brand-primary-tint">
      <IconComponent size={11} className="text-brand-primary" />
    </span>
  )
}
