import { ResultCard, type ResultCardProps } from '@/components/ui/ResultCard'

// Figma 1:1: Tile · ResultListPanel · v1 (432:853) > ResultListPanel COMPONENT
// 5 ResultCards (첫 번째 selected, 나머지 default)
// 페이지당 카드 수 — 결과 페이지(JobFinder/Preference)에서 import해 동일 값 사용
export const RESULTS_PAGE_SIZE = 5

export interface ResultListPanelProps {
  results: ResultCardProps[]
  selectedId?: string
  /** 카드 클릭 시 선택 — 결과 id 전달 */
  onSelect?: (id: string) => void
}

export function ResultListPanel({ results, selectedId, onSelect }: ResultListPanelProps) {
  return (
    <div className="flex w-full max-w-[381px] flex-col items-center justify-center gap-xs">
      {results.map((r, i) => (
        <div
          key={r.id ?? r.dong}
          className="w-full animate-fade-in-up opacity-0"
          style={{
            animationDelay: `${i * 60}ms`,
            animationFillMode: 'forwards',
          }}
        >
          <ResultCard
            {...r}
            state={r.id === selectedId ? 'selected' : 'default'}
            onClick={r.id ? () => onSelect?.(r.id!) : r.onClick}
          />
        </div>
      ))}
    </div>
  )
}
