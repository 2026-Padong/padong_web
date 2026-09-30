import { useLocation, useNavigate } from 'react-router'
import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { SideNav } from '@/components/layout/SideNav'
import { BottomNav } from '@/components/layout/BottomNav'
import { LifestyleQuestionPanelWide } from '@/features/neighborhood-finder/components/LifestyleQuestionPanelWide'
import { QHeroCard } from '@/features/neighborhood-finder/components/QHeroCard'
import { NavButton } from '@/features/neighborhood-finder/components/NavButton'
import { ErrorState } from '@/components/ui/ErrorState'
import { Skeleton } from '@/components/ui/Skeleton'
import { usePreferenceQuestions } from '@/api/queries/usePreferenceQuestions'
import { fetchMyPreferenceAnswers } from '@/api/preference'
import { loadPreferenceAnswers } from '@/lib/preferenceStorage'

const TOTAL = 10

type Likert = 1 | 2 | 3 | 4 | 5

// Figma 1:1: Card · 동네찾기 - 취향 (가로버전) (1492:4158)
// 전체 10개 질문을 세로 스택으로 한 페이지에 나열, 사용자가 각자 답변 후 마지막에 분석 시작
export function PreferencePage() {
  const nav = useNavigate()
  const location = useLocation()
  const [answers, setAnswers] = useState<Record<number, Likert>>({})
  // 결과 페이지의 "다시 설문하기" 진입 시 nav state.restart=true → 저장 답변 무시하고 설문 진행
  const restartMode = (location.state as { restart?: boolean } | null)?.restart === true

  // 이미 저장된 답변이 있으면 설문 받지 않고 결과 페이지로 즉시 이동.
  // 로그인: GET /api/preference/me/answers / 비로그인: localStorage 폴백.
  const savedAnswers = useQuery({
    queryKey: ['preference', 'me', 'answers', 'check'],
    queryFn: async () => {
      const fromDb = await fetchMyPreferenceAnswers().catch(() => null)
      if (fromDb) return fromDb
      return loadPreferenceAnswers()
    },
    retry: false,
    staleTime: 60_000,
    enabled: !restartMode,
  })

  useEffect(() => {
    if (restartMode) return
    if (!savedAnswers.isPending && savedAnswers.data) {
      nav('/finder/preference/result', { replace: true })
    }
  }, [restartMode, savedAnswers.isPending, savedAnswers.data, nav])

  const { data, isLoading, error, refetch } = usePreferenceQuestions()

  const setAnswer = (q: number, v: Likert) =>
    setAnswers((prev) => ({ ...prev, [q]: v }))

  const answeredCount = Object.keys(answers).length
  const allAnswered = answeredCount === TOTAL

  // 답변 들고 분석 페이지로 즉시 이동 — 실제 /dongne/recommendations 호출은 분석 페이지가 담당
  const submit = () => {
    if (!allAnswered) return
    nav('/finder/preference/analyzing', { state: { answers }, viewTransition: true })
  }

  // 저장된 답변 확인 중 (restart 모드 시 skip) — 질문 fetch 와 동일한 스켈레톤
  if ((!restartMode && savedAnswers.isPending) || isLoading) {
    return (
      <div className="flex min-h-screen w-full pb-14 lg:pb-0">
        <SideNav activeType="Custom" />
        <LifestyleQuestionPanelWide current={0} total={TOTAL} step="01">
          <Skeleton className="h-[388px] w-full" />
          <Skeleton className="h-[388px] w-full" />
        </LifestyleQuestionPanelWide>
        <BottomNav activeType="Custom" className="lg:hidden" />
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="flex min-h-screen w-full pb-14 lg:pb-0">
        <SideNav activeType="Custom" />
        <div className="flex flex-1 items-center justify-center">
          <ErrorState
            title="질문을 불러올 수 없어요"
            message="네트워크를 확인해주세요"
            onRetry={() => refetch()}
          />
        </div>
        <BottomNav activeType="Custom" className="lg:hidden" />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen">
      <SideNav activeType="Custom" />
      <LifestyleQuestionPanelWide
        title="내 취향 기반"
        current={answeredCount}
        total={TOTAL}
        step="01"
        stepLabel="취향 질문"
        showCount
      >
        {data.items.map((item) => (
          <QHeroCard
            key={item.id}
            state="active"
            number={item.id}
            question={item.question}
            left={item.left}
            right={item.right}
            selected={answers[item.id]}
            onSelect={(v) => setAnswer(item.id, v)}
          />
        ))}
        <div className="flex w-full max-w-[840px] items-center justify-end gap-md pb-14 lg:pb-0">
          {!allAnswered && (
            <p
              className="text-body-l font-normal text-status-warning"
              aria-live="polite"
            >
              {data.items
                .filter((q) => !(q.id in answers))
                .map((q) => `Q${q.id}`)
                .join(', ')}
              <span className="text-text-tertiary"> 답변해주세요</span>
            </p>
          )}
          <NavButton
            type="next"
            label="다음으로"
            onClick={submit}
            disabled={!allAnswered}
          />
        </div>
      </LifestyleQuestionPanelWide>
      <BottomNav activeType="Custom" className="lg:hidden" />
    </div>
  )
}
