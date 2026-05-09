import { ResultCard, type ResultCardProps } from '@/components/ui/ResultCard'

// Figma 1:1: Tile · ResultListPanel · v1 (432:853) > ResultListPanel COMPONENT
// w-[381px] h-[565px] flex flex-col gap-xs items-center justify-center
// 5 ResultCards (첫 번째 selected, 나머지 default)
export interface ResultListPanelProps {
  results: ResultCardProps[]
  selectedId?: string
}

export function ResultListPanel({ results, selectedId }: ResultListPanelProps) {
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
          <ResultCard {...r} state={r.id === selectedId ? 'selected' : 'default'} />
        </div>
      ))}
    </div>
  )
}
