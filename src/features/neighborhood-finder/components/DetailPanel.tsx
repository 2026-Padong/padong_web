import { BackButton } from '@/components/ui/BackButton'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { DetailHeader, type DetailHeaderProps } from './DetailHeader'
import { MobilityRow, type MobilityRowProps } from './MobilityRow'
import { RentRow, type RentRowProps } from './RentRow'
import { SafetyGradeCard, type SafetyGradeCardProps } from './SafetyGradeCard'
import { StatCellBordered, type StatCellBorderedProps } from './StatCellBordered'

// Figma 1:1: Tile · DetailPanel (432:850) > DetailPanel COMPONENT
// w-[380px] h-[900px] border border-border-default flex flex-col gap-md items-start
// overflow-clip p-xl
// BackButton + DetailHeader + StatCellBordered + SafetyGradeCard
// SectionTitle "임대료" + 4 RentRows
// SectionTitle "이동 시간" + MobilityRow
export interface DetailPanelProps
  extends DetailHeaderProps, StatCellBorderedProps, SafetyGradeCardProps, MobilityRowProps {
  onBack?: () => void
  rents: RentRowProps[]
  rentSectionTitle?: string
  mobilitySectionTitle?: string
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
}: DetailPanelProps) {
  return (
    <aside className="flex h-[900px] w-[380px] flex-col items-start gap-md overflow-clip border border-border-default p-xl">
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
