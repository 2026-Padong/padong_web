import { LocationChip } from './LocationChip'

export interface ResultSummaryProps {
  count: number
  location: string
}

export function ResultSummary({ count, location }: ResultSummaryProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-col gap-xxs">
        <span className="text-h4 font-bold text-text-primary">검색 결과</span>
        <span className="text-body text-text-tertiary">{count}개의 결과</span>
      </div>
      <LocationChip name={location} />
    </div>
  )
}
