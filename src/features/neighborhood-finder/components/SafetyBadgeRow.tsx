import { SafetyBadge, type SafetyBadgeProps } from '@/components/ui/SafetyBadge'

// Figma 1:1: Tile · SafetyBadgeRow (431:877) > SafetyBadgeRow COMPONENT
// w-[332px] flex gap-xs items-start justify-center overflow-clip
// 4 SafetyBadge (각 flex-1, h-[66px])
export interface SafetyBadgeRowProps {
  badges: SafetyBadgeProps[]
}

export function SafetyBadgeRow({ badges }: SafetyBadgeRowProps) {
  return (
    <div className="flex items-start justify-center gap-xs overflow-clip whitespace-nowrap">
      {badges.map((b) => (
        <SafetyBadge key={b.category} {...b} className="flex-1" />
      ))}
    </div>
  )
}
