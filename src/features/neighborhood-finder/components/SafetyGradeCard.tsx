import { SafetyBadgeRow, type SafetyBadgeRowProps } from './SafetyBadgeRow'

// Figma 1:1: Tile · SafetyGradeBox (431:880) > SafetyGradeCard COMPONENT
// w-[332px] flex flex-col gap-md items-start
// Title: Noto Sans KR Bold 16px text-text-secondary "안전지수"
// SafetyBadgeRow
export interface SafetyGradeCardProps extends SafetyBadgeRowProps {
  title?: string
}

export function SafetyGradeCard({ title = '안전지수', badges }: SafetyGradeCardProps) {
  return (
    <div className="flex flex-col items-start gap-md">
      <h3 className="text-subhead font-bold text-text-secondary">{title}</h3>
      <SafetyBadgeRow badges={badges} />
    </div>
  )
}
