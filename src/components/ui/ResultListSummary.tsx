// Figma 1:1: Tile · ResultHeader (431:898) > ResultListSummary COMPONENT
// flex flex-col gap-0 items-start w-[381px]
// Title: 18px Bold text-text-primary "검색 결과"
// Subtitle: 13px Regular text-text-tertiary "추천 동네 N개"
export interface ResultListSummaryProps {
  resultCount: number
  title?: string
  subtitle?: string
}

export function ResultListSummary({
  resultCount,
  title = '검색 결과',
  subtitle = `추천 동네 ${resultCount}개`,
}: ResultListSummaryProps) {
  return (
    <div className="flex flex-col items-start">
      <span className="text-h4 font-bold text-text-primary">{title}</span>
      {subtitle && (
        <span className="text-body font-normal text-text-tertiary">{subtitle}</span>
      )}
    </div>
  )
}
