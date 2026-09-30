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
// [옵션] "이동 시간" MobilityRow — hideMobility=true 면 미노출
// [옵션] "동네 사진" — placeImageUrl 있으면 노출
export interface DetailPanelProps
  extends DetailHeaderProps, StatCellBorderedProps, SafetyGradeCardProps, MobilityRowProps {
  onBack?: () => void
  rents: RentRowProps[]
  rentSectionTitle?: string
  mobilitySectionTitle?: string
  /** 이동 시간 섹션 숨김 — 출발지 없는 추천 흐름(취향) 등에서 사용 */
  hideMobility?: boolean
  /** 동네 사진 URL — 있으면 임대료 아래(또는 이동 시간 아래) "동네 사진" 카드 노출 */
  placeImageUrl?: string
  placeImageAlt?: string
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
  hideMobility = false,
  placeImageUrl,
  placeImageAlt,
  className,
}: DetailPanelProps) {
  return (
    <aside
      className={cn(
        'flex w-full flex-col items-start gap-md border border-border-default p-xl md:w-[380px] md:shrink-0 md:h-screen md:overflow-y-auto',
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
      {!hideMobility && (
        <>
          <SectionTitle>{mobilitySectionTitle}</SectionTitle>
          <MobilityRow cells={cells} />
        </>
      )}
      {placeImageUrl && (
        <>
          <SectionTitle>동네 사진</SectionTitle>
          <img
            src={placeImageUrl}
            alt={placeImageAlt ?? `${dong} 사진`}
            className="aspect-[16/10] w-full rounded-md object-cover"
          />
        </>
      )}
    </aside>
  )
}
