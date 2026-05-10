import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { SideNav } from '@/components/layout/SideNav'
import { BottomNav } from '@/components/layout/BottomNav'
import { LifestyleQuestionPanelWide } from '@/features/neighborhood-finder/components/LifestyleQuestionPanelWide'
import { AnalyzingCard } from '@/features/neighborhood-finder/components/AnalyzingCard'

// Figma 1:1: Card · 동네찾기 - 분석중 (1511:4243)
// 3개 step은 "여기서 이런 작업을 합니다" 정보 표시 (모두 active), 진행 인디케이터는 sweep 애니메이션
export function PreferenceAnalyzingPage() {
  const nav = useNavigate()

  useEffect(() => {
    const t = setTimeout(
      () => nav('/finder/preference/result', { viewTransition: true }),
      3000,
    )
    return () => clearTimeout(t)
  }, [nav])

  return (
    <div className="flex min-h-screen w-full pb-14 lg:pb-0">
      <SideNav activeType="Custom" />
      <LifestyleQuestionPanelWide
        title="내 취향 기반"
        step="02"
        stepLabel="취향 분석"
        showCount={false}
      >
        <AnalyzingCard
          loadingIndeterminate
          loadingMessage="결과 페이지로 곧 이동합니다"
        />
      </LifestyleQuestionPanelWide>
      <BottomNav activeType="Custom" className="lg:hidden" />
    </div>
  )
}
