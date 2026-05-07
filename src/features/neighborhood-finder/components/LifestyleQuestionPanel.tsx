import type { ReactNode } from 'react'
import { PageHeader } from '@/components/ui/PageHeader'
import { LikertScale } from './LikertScale'
import { PageNavigation } from '@/components/ui/PageNavigation'
import { QuestionProgress } from './QuestionProgress'
import { QuestionStatement } from './QuestionStatement'

// Figma 1:1: Tile · CustomizedPanel (538:1017) > LifestyleQuestionPanel COMPONENT
// w-[420px] h-[900px] flex flex-col gap-2xl items-center p-xl
// PageHeader + QuestionFlow (V gap-[70px] items-center w-full):
//   QuestionProgress + QuestionStatement + LikertScale + PageNavigation
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
}: LifestyleQuestionPanelProps) {
  return (
    <aside className="flex h-[900px] w-[420px] flex-col items-center gap-2xl p-xl">
      <PageHeader type="Search" title={title} />
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
