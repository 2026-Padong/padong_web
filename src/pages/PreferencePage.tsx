import { useNavigate, useSearchParams } from 'react-router'
import { useEffect, useState } from 'react'
import { SideNav } from '@/components/layout/SideNav'
import { LifestyleQuestionPanel } from '@/features/neighborhood-finder/components/LifestyleQuestionPanel'
import { ErrorState } from '@/components/ui/ErrorState'
import { Skeleton } from '@/components/ui/Skeleton'
import { usePreferenceQuestions } from '@/api/queries/usePreferenceQuestions'
import { useAnalyze } from '@/api/queries/useResults'

const TOTAL = 10

type Likert = 1 | 2 | 3 | 4 | 5

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
    // 마지막 질문 → analyze 호출 → 분석중 페이지로
    analyze.mutate(
      { answers },
      {
        onSuccess: () => nav('/finder/preference/analyzing'),
      },
    )
  }

  if (isLoading) {
    return (
      <div className="flex h-screen overflow-hidden">
        <SideNav activeType="Custom" />
        <div className="flex h-[900px] w-[420px] flex-col gap-md p-xl">
          <Skeleton className="h-[34px] w-full" />
          <Skeleton className="h-[80px] w-full" />
          <Skeleton className="h-[200px] w-full" />
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="flex h-screen overflow-hidden">
        <SideNav activeType="Custom" />
        <div className="flex h-[900px] w-[420px] items-center justify-center">
          <ErrorState
            title="질문을 불러올 수 없어요"
            message="네트워크를 확인해주세요"
            onRetry={() => refetch()}
          />
        </div>
      </div>
    )
  }

  const current = data.items[Math.max(0, Math.min(TOTAL - 1, q - 1))]

  return (
    <div className="flex h-screen overflow-hidden">
      <SideNav activeType="Custom" />
      <LifestyleQuestionPanel
        title="내 취향 기반"
        current={q}
        total={TOTAL}
        question={current?.question ?? ''}
        questionSubtitle={current?.subtitle ?? undefined}
        selected={answers[q]}
        onSelect={(v) => {
          setAnswer(v)
          setTimeout(goNext, 200)
        }}
        currentPage={1}
        totalPages={1}
      />
    </div>
  )
}
