import { PageHeader } from '@/components/ui/PageHeader'
import { PageNavigation } from '@/components/ui/PageNavigation'
import { ResultCard, type ResultCardProps } from '@/components/ui/ResultCard'
import { QuestionProgress } from './QuestionProgress'
import { LifestyleResultBlock } from './LifestyleResultBlock'
import { cn } from '@/lib/cn'

// Figma 1:1: Tile · CustomizedPanel3 (566:1467) > LifestyleResultPanel (566:1216)
// 모바일: w-full / md+: w-[420px] md:min-h-screen — Phase 8 fluid (h-[900px]은 Figma frame 잔재, 코드는 min-h-screen 사용)
// PageHeader + ResultFlow (V gap-xs h-[753.976px] items-center justify-between w-full):
//   QuestionProgress (showCount=false, step="03", stepLabel="분석 결과")
//   ResultContent (V gap-md items-center px-0 py-md w-full flex-1):
//     LifestyleResultBlock + RecommendedList (V justify-between flex-1) + PageNavigation
export interface LifestyleResultPanelProps {
  title?: string
  resultTitle: string
  recommendedCount?: number
  resultSubtitle?: string
  /** 추천 동네 4개 카드 (첫 번째는 selected 권장) */
  cards: ResultCardProps[]
  currentPage?: number
  totalPages?: number
  onPageChange?: (p: number) => void
  className?: string
}

export function LifestyleResultPanel({
  title = '내 취향 기반',
  resultTitle,
  recommendedCount,
  resultSubtitle,
  cards,
  currentPage = 1,
  totalPages = 3,
  onPageChange,
  className,
}: LifestyleResultPanelProps) {
  return (
    <aside
      className={cn(
        'flex w-full flex-col items-center gap-2xl p-xl md:w-[420px] md:shrink-0 md:min-h-screen',
        className,
      )}
    >
      <PageHeader type="Search" title={title} />
      <div className="flex h-[753.976px] w-full flex-col items-center justify-between">
        <QuestionProgress
          current={0}
          total={10}
          step="03"
          stepLabel="분석 결과"
          showCount={false}
        />
        <div className="flex w-full flex-1 flex-col items-center gap-md py-md">
          <LifestyleResultBlock
            title={resultTitle}
            recommendedCount={recommendedCount}
            subtitle={resultSubtitle}
          />
          <div className="flex w-full flex-1 flex-col items-center justify-between">
            {cards.map((card, idx) => (
              <ResultCard key={card.id ?? `${card.dong}-${idx}`} {...card} />
            ))}
          </div>
          <PageNavigation current={currentPage} total={totalPages} onChange={onPageChange} />
        </div>
      </div>
    </aside>
  )
}
