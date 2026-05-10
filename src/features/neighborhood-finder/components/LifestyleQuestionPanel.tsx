import type { ReactNode } from 'react'
import { PageHeader } from '@/components/ui/PageHeader'
import { LikertScale } from './LikertScale'
import { PageNavigation } from '@/components/ui/PageNavigation'
import { QuestionProgress } from './QuestionProgress'
import { QuestionStatement } from './QuestionStatement'
import { cn } from '@/lib/cn'

// Figma 1:1: Tile · CustomizedPanel (538:1017) > LifestyleQuestionPanel COMPONENT
// 420×900 (Figma 의도) — 모바일 풀폭, md+ 고정
export interface LifestyleQuestionPanelProps {
  title?: string
  current: number
  total?: number
  question: string
  questionSubtitle?: string
  selected?: 1 | 2 | 3 | 4 | 5
  onSelect?: (v: 1 | 2 | 3 | 4 | 5) => void
  currentPage?: number
  totalPages?: number
  onPageChange?: (p: number) => void
  /** 커스텀 자식 — 기본 구조 대신 직접 조립 */
  children?: ReactNode
  className?: string
}

export function LifestyleQuestionPanel({
  title = '내 취향 기반',
  current,
  total = 10,
  question,
  questionSubtitle,
  selected,
  onSelect,
  currentPage = 1,
  totalPages = 3,
  onPageChange,
  children,
  className,
}: LifestyleQuestionPanelProps) {
  return (
    <aside
      className={cn(
        'flex w-full flex-col items-center gap-2xl p-xl md:w-[420px] md:shrink-0 md:min-h-screen',
        className,
      )}
    >
      <div className="flex w-full">
        <PageHeader type="Search" title={title} />
      </div>
      {children ?? (
        <div className="flex w-full flex-col items-center gap-[70px]">
          <QuestionProgress current={current} total={total} step="01" stepLabel="취향 질문" />
          <QuestionStatement question={question} subtitle={questionSubtitle} />
          <LikertScale value={selected} onChange={onSelect} />
          <PageNavigation current={currentPage} total={totalPages} onChange={onPageChange} />
        </div>
      )}
    </aside>
  )
}
