import { useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { SideNav } from '@/components/layout/SideNav'
import { BottomNav } from '@/components/layout/BottomNav'
import { LifestyleQuestionPanelWide } from '@/features/neighborhood-finder/components/LifestyleQuestionPanelWide'
import { AnalyzingCard } from '@/features/neighborhood-finder/components/AnalyzingCard'
import { ErrorState } from '@/components/ui/ErrorState'
import { useAnalyze } from '@/api/queries/useResults'

type Likert = 1 | 2 | 3 | 4 | 5
type LocationState = { answers?: Record<number, Likert> } | null

// Figma 1:1: Card · 동네찾기 - 분석중 (1511:4243)
// 백엔드 /dongne/recommendations 호출 대기 → 응답 도착 시 결과 페이지로 이동
export function PreferenceAnalyzingPage() {
  const nav = useNavigate()
  const location = useLocation()
  const answers = (location.state as LocationState)?.answers
  const analyze = useAnalyze()
  const started = useRef(false)

  useEffect(() => {
    // 답변 없이 직접 진입 — 설문 페이지로 되돌림
    if (!answers || Object.keys(answers).length < 10) {
      nav('/finder/preference', { replace: true })
      return
    }
    // StrictMode 더블 마운트 방지 — mutation 은 최초 1회만
    if (started.current) return
    started.current = true
    analyze.mutate(
      { answers },
      {
        onSuccess: () => nav('/finder/preference/result', { viewTransition: true }),
      },
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="flex min-h-screen w-full pb-14 lg:pb-0">
      <SideNav activeType="Custom" />
      <LifestyleQuestionPanelWide
        title="내 취향 기반"
        step="02"
        stepLabel="취향 분석"
        showCount={false}
      >
        {analyze.isError ? (
          <ErrorState
            title="분석에 실패했어요"
            message="잠시 후 다시 시도해주세요"
            onRetry={() => {
              started.current = false
              if (answers) analyze.mutate({ answers }, {
                onSuccess: () => nav('/finder/preference/result', { viewTransition: true }),
              })
            }}
          />
        ) : (
          <AnalyzingCard
            loadingIndeterminate
            loadingMessage="추천 동네를 분석하고 있어요"
          />
        )}
      </LifestyleQuestionPanelWide>
      <BottomNav activeType="Custom" className="lg:hidden" />
    </div>
  )
}
