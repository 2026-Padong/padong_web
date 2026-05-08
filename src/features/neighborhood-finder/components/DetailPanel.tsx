import { BackButton } from '@/components/ui/BackButton'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { DetailHeader, type DetailHeaderProps } from './DetailHeader'
import { MobilityRow, type MobilityRowProps } from './MobilityRow'
import { RentRow, type RentRowProps } from './RentRow'
import { SafetyGradeCard, type SafetyGradeCardProps } from './SafetyGradeCard'
import { StatCellBordered, type StatCellBorderedProps } from './StatCellBordered'
import { cn } from '@/lib/cn'

// Figma 1:1: Tile · DetailPanel (432:850) > DetailPanel COMPONENT
// 380×900 (Figma 의도) — 모바일 풀폭, md+ 고정
// BackButton + DetailHeader + StatCellBordered + SafetyGradeCard
// SectionTitle "임대료" + 4 RentRows
// SectionTitle "이동 시간" + MobilityRow
export interface DetailPanelProps
  extends DetailHeaderProps, StatCellBorderedProps, SafetyGradeCardProps, MobilityRowProps {
  onBack?: () => void
  rents: RentRowProps[]
  rentSectionTitle?: string
  mobilitySectionTitle?: string
  className?: string
}

export function DetailPanel({
  onBack,
  score,
  dong,
  fullAddress,
  rows,
  badges,
  rents,
  cells,
  rentSectionTitle = '임대료',
  mobilitySectionTitle = '이동 시간',
  className,
}: DetailPanelProps) {
  return (
    <aside
      className={cn(
        'flex w-full flex-col items-start gap-md overflow-clip border border-border-default p-xl md:w-[380px] md:shrink-0 md:min-h-screen',
        className,
      )}
    >
      <BackButton onClick={onBack} />
      <DetailHeader score={score} dong={dong} fullAddress={fullAddress} />
      <StatCellBordered rows={rows} />
      <SafetyGradeCard badges={badges} />
      <SectionTitle>{rentSectionTitle}</SectionTitle>
      {rents.map((r, i) => (
        <RentRow key={i} {...r} />
      ))}
      <SectionTitle>{mobilitySectionTitle}</SectionTitle>
      <MobilityRow cells={cells} />
    </aside>
  )
}
