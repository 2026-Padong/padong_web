import { useNavigate, useSearchParams } from 'react-router'
import { useEffect, useState } from 'react'
import { SideNav } from '@/components/layout/SideNav'
import { LifestyleQuestionPanelWide } from '@/features/neighborhood-finder/components/LifestyleQuestionPanelWide'
import { QHeroCard } from '@/features/neighborhood-finder/components/QHeroCard'
import { NavButton } from '@/features/neighborhood-finder/components/NavButton'
import { ErrorState } from '@/components/ui/ErrorState'
import { Skeleton } from '@/components/ui/Skeleton'
import { usePreferenceQuestions } from '@/api/queries/usePreferenceQuestions'
import { useAnalyze } from '@/api/queries/useResults'

const TOTAL = 10

type Likert = 1 | 2 | 3 | 4 | 5

// Figma 1:1: Card · 동네찾기 - 취향 (가로버전) (1492:4158)
// SideNav (112) + LifestyleQuestionPanelWide (1328 × 900):
//   Topbar: PageHeader + QuestionProgress
//   Q-HeroCard (current, active) + Q-HeroCard (next, disabled)
//   Q10에선 두번째 슬롯이 ButtonRow (NavButton "분석 시작")
export function PreferencePage() {
  const nav = useNavigate()
  const [params, setParams] = useSearchParams()
  const q = Number(params.get('q') ?? 1)
  const [answers, setAnswers] = useState<Record<number, Likert>>({})

  const { data, isLoading, error, refetch } = usePreferenceQuestions()
  const analyze = useAnalyze()

  useEffect(() => {
    if (q < 1 || q > TOTAL) setParams({ q: '1' })
  }, [q, setParams])

  const setAnswer = (v: Likert) => setAnswers((a) => ({ ...a, [q]: v }))

  const goNext = () => {
    if (q < TOTAL) {
      setParams({ q: String(q + 1) })
      return
    }
    analyze.mutate({ answers }, { onSuccess: () => nav('/finder/preference/analyzing') })
  }

  if (isLoading) {
    return (
      <div className="flex h-screen overflow-hidden">
        <SideNav activeType="Custom" />
        <LifestyleQuestionPanelWide current={1} total={TOTAL} step="01">
          <Skeleton className="h-[388px] w-full" />
          <Skeleton className="h-[388px] w-full" />
        </LifestyleQuestionPanelWide>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="flex h-screen overflow-hidden">
        <SideNav activeType="Custom" />
        <div className="flex flex-1 items-center justify-center">
          <ErrorState
            title="질문을 불러올 수 없어요"
            message="네트워크를 확인해주세요"
            onRetry={() => refetch()}
          />
        </div>
      </div>
    )
  }

  const safeQ = Math.max(1, Math.min(TOTAL, q))
  const current = data.items[safeQ - 1]
  const next = data.items[safeQ] ?? null
  const isLast = safeQ === TOTAL

  return (
    <div className="flex h-screen overflow-hidden">
      <SideNav activeType="Custom" />
      <LifestyleQuestionPanelWide
        title="내 취향 기반"
        current={safeQ}
        total={TOTAL}
        step="01"
        stepLabel="취향 질문"
        showCount
      >
        {/* 현재 질문 — active */}
        {current && (
          <QHeroCard
            state="active"
            number={current.id}
            question={current.question}
            left={current.left}
            right={current.right}
            selected={answers[safeQ]}
            onSelect={(v) => {
              setAnswer(v)
              setTimeout(goNext, 200)
            }}
          />
        )}

        {/* 다음 질문 prefetch (Q1~Q9) 또는 ButtonRow (Q10) */}
        {!isLast && next && (
          <QHeroCard
            state="disabled"
            number={next.id}
            question={next.question}
            left={next.left}
            right={next.right}
          />
        )}
        {isLast && (
          <div className="flex w-full items-center justify-end">
            <NavButton
              type="next"
              label="분석 시작"
              onClick={goNext}
              disabled={!answers[safeQ] || analyze.isPending}
            />
          </div>
        )}
      </LifestyleQuestionPanelWide>
    </div>
  )
}
