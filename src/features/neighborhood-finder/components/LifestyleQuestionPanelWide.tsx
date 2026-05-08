import type { ReactNode } from 'react'
import { PageHeader } from '@/components/ui/PageHeader'
import { QuestionProgress } from './QuestionProgress'
import { cn } from '@/lib/cn'

// Figma 1:1: PreferencePage 가로형 LifestyleQuestionPanel (1429:3818)
// 가로형 메인 영역 — flex-1로 남는 공간 차지
// Topbar (V gap-[18px] items-start w-full): PageHeader + QuestionProgress
// children — Q-HeroCard들 또는 AnalyzingCard
export interface LifestyleQuestionPanelWideProps {
  title?: string
  /** 진행 표시용 — current=0, showCount=false면 step만 표시 (분석중/결과 등) */
  current?: number
  total?: number
  step?: string
  stepLabel?: string
  showCount?: boolean
  children?: ReactNode
  className?: string
}

export function LifestyleQuestionPanelWide({
  title = '내 취향 기반',
  current = 0,
  total = 10,
  step,
  stepLabel = '취향 질문',
  showCount = true,
  children,
  className,
}: LifestyleQuestionPanelWideProps) {
  return (
    <div
      className={cn(
        'flex w-full flex-1 min-w-0 flex-col items-center gap-2xl px-3xl py-xl md:min-h-screen',
        className,
      )}
    >
      <div className="flex w-full flex-col items-start gap-[18px]">
        <PageHeader type="Search" title={title} />
        <QuestionProgress
          current={current}
          total={total}
          step={step}
          stepLabel={stepLabel}
          showCount={showCount}
        />
      </div>
      {children}
    </div>
  )
}
