import { PageNavigation } from '@/components/ui/PageNavigation'
import { ResultListSummary } from '@/components/ui/ResultListSummary'
import { ResultListPanel, type ResultListPanelProps } from './ResultListPanel'

// Figma 1:1: Tile · ResultListPanel · v2 (432:856) > ResultListPanelExpanded COMPONENT
// w-[381px] h-[666px] flex flex-col gap-md items-start
// ResultListSummary + ResultListPanel + PageNavigation
export interface ResultListPanelExpandedProps extends ResultListPanelProps {
  resultCount: number
  currentPage: number
  totalPages: number
  onPageChange?: (p: number) => void
}

export function ResultListPanelExpanded({
  results,
  selectedId,
  resultCount,
  currentPage,
  totalPages,
  onPageChange,
}: ResultListPanelExpandedProps) {
  return (
    <div className="flex h-[666px] w-[381px] flex-col items-start gap-md">
      <ResultListSummary resultCount={resultCount} />
      <ResultListPanel results={results} selectedId={selectedId} />
      <PageNavigation current={currentPage} total={totalPages} onChange={onPageChange} />
    </div>
  )
}
