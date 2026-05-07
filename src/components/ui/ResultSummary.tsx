import { LocationChip } from './LocationChip'

// Figma 1:1: Tile · ResultSummary (598:1653) > ResultSummary COMPONENT
// flex items-end justify-between w-[445px]
// Left SearchInfo (V gap-xxs): "검색 결과" 18px Bold text-primary + count 13px Regular tertiary
// Right LocationChip
export interface ResultSummaryProps {
  title?: string
  countLabel?: string
  location: string
}

export function ResultSummary({ title = '검색 결과', countLabel, location }: ResultSummaryProps) {
  return (
    <div className="flex items-end justify-between">
      <div className="flex flex-col gap-xxs">
        <h3 className="text-h4 font-bold text-text-primary whitespace-nowrap">{title}</h3>
        {countLabel && (
          <span className="text-body font-normal text-text-tertiary whitespace-nowrap">
            {countLabel}
          </span>
        )}
      </div>
      <LocationChip name={location} />
    </div>
  )
}
