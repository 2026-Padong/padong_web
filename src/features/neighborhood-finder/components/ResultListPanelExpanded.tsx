import { PageNavigation } from '@/components/ui/PageNavigation'
import { ResultListSummary } from '@/components/ui/ResultListSummary'
import { ResultListPanel, type ResultListPanelProps } from './ResultListPanel'

// Figma 1:1: Tile · ResultListPanel · v2 (432:856) > ResultListPanelExpanded COMPONENT
// w-[381px] h-[666px] flex flex-col gap-md items-start
// ResultListSummary (+ filterSlot 오른쪽) + ResultListPanel + PageNavigation
export interface ResultListPanelExpandedProps extends ResultListPanelProps {
  resultCount: number
  /** subtitle 오버라이드 (예: "추천 동네 12개 · 3개 직장 종합") */
  resultSubtitle?: string
  currentPage: number
  totalPages: number
  onPageChange?: (p: number) => void
  /** 헤더 우측에 노출할 필터 UI (옵션) */
  filterSlot?: React.ReactNode
}

export function ResultListPanelExpanded({
  results,
  selectedId,
  onSelect,
  resultCount,
  resultSubtitle,
  currentPage,
  totalPages,
  onPageChange,
  filterSlot,
}: ResultListPanelExpandedProps) {
  return (
    <div className="flex w-full max-w-[381px] flex-col items-start gap-md">
      <div className="flex w-full items-end justify-between gap-sm">
        <ResultListSummary resultCount={resultCount} subtitle={resultSubtitle} />
        {filterSlot && <div className="shrink-0">{filterSlot}</div>}
      </div>
      <ResultListPanel results={results} selectedId={selectedId} onSelect={onSelect} />
      <PageNavigation current={currentPage} total={totalPages} onChange={onPageChange} />
    </div>
  )
}
