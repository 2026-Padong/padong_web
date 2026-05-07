import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { SideNav } from '@/components/layout/SideNav'
import { LifestyleQuestionPanelWide } from '@/features/neighborhood-finder/components/LifestyleQuestionPanelWide'
import { AnalyzingCard } from '@/features/neighborhood-finder/components/AnalyzingCard'

// Figma 1:1: Card · 동네찾기 - 분석중 (1511:4243)
// SideNav (112) + LifestyleQuestionPanelWide:
//   Topbar: PageHeader + QuestionProgress (showCount=false, step="02", stepLabel="취향 분석")
//   AnalyzingCard (1232×595)
export function PreferenceAnalyzingPage() {
  const nav = useNavigate()
  useEffect(() => {
    const t = setTimeout(() => nav('/finder/preference/result'), 3000)
    return () => clearTimeout(t)
  }, [nav])

  return (
    <div className="flex h-screen overflow-hidden">
      <SideNav activeType="Custom" />
      <LifestyleQuestionPanelWide
        title="내 취향 기반"
        step="02"
        stepLabel="취향 분석"
        showCount={false}
      >
        <AnalyzingCard activeStep={1} />
      </LifestyleQuestionPanelWide>
    </div>
  )
}
