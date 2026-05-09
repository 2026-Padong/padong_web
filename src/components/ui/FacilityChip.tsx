import { Icon, type IconName } from './Icon'

// Figma 1:1: Tile · FacilityChip (1143:3708) > FacilityChip COMPONENT_SET (3 variants)
// size-[22px] rounded-full bg-brand-primary-tint
// Icon: 11×11 자체 SVG (facility-*)
export interface FacilityChipProps {
  type: 'subway' | 'bus' | 'bike'
}

const ICON: Record<FacilityChipProps['type'], IconName> = {
  subway: 'facility-subway',
  bus: 'facility-bus',
  bike: 'facility-bike',
}

export function FacilityChip({ type }: FacilityChipProps) {
  return (
    <span className="inline-flex size-[22px] items-center justify-center rounded-full bg-brand-primary-tint">
      <Icon name={ICON[type]} size={11} className="text-brand-primary" aria-hidden />
    </span>
  )
}
