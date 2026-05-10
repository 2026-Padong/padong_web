import { PageHeader } from '@/components/ui/PageHeader'
import { PageNavigation } from '@/components/ui/PageNavigation'
import { type ResultCardProps } from '@/components/ui/ResultCard'
import { QuestionProgress } from './QuestionProgress'
import { LifestyleResultBlock } from './LifestyleResultBlock'
import { ResultListPanel } from './ResultListPanel'
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
  /** 라이프스타일 설명 (description) — LIFESTYLE_TYPES에서 옴 */
  resultDescription?: string
  recommendedCount?: number
  resultSubtitle?: string
  /** 추천 동네 카드 */
  cards: ResultCardProps[]
  /** 선택된 카드 id — 클릭 시 호출되는 onSelect와 함께 사용 */
  selectedId?: string
  onSelect?: (id: string) => void
  currentPage?: number
  totalPages?: number
  onPageChange?: (p: number) => void
  className?: string
}

export function LifestyleResultPanel({
  title = '내 취향 기반',
  resultTitle,
  resultDescription,
  recommendedCount,
  resultSubtitle,
  cards,
  selectedId,
  onSelect,
  currentPage = 1,
  totalPages = 3,
  onPageChange,
  className,
}: LifestyleResultPanelProps) {
  return (
    <aside
      className={cn(
        'flex w-full flex-col items-center gap-md p-xl md:w-[420px] md:shrink-0 md:min-h-screen',
        className,
      )}
    >
      <div className="flex w-full">
        <PageHeader type="Search" title={title} />
      </div>
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
            description={resultDescription}
            recommendedCount={recommendedCount}
            subtitle={resultSubtitle}
          />
          <ResultListPanel results={cards} selectedId={selectedId} onSelect={onSelect} />
          <PageNavigation current={currentPage} total={totalPages} onChange={onPageChange} />
        </div>
      </div>
    </aside>
  )
}
