export interface ResultListSummaryProps {
  resultCount: number
  subtitle?: string
}

export function ResultListSummary({
  resultCount,
  subtitle = `추천 동네 ${resultCount}개`,
}: ResultListSummaryProps) {
  return (
    <div className="flex flex-col">
      <span className="text-h4 font-bold text-text-primary">검색 결과</span>
      <span className="text-body text-text-tertiary">{subtitle}</span>
    </div>
  )
}
