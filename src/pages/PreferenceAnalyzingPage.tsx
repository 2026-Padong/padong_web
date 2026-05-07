import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { SideNav } from '@/components/layout/SideNav'
import { LifestyleAnalyzingPanel } from '@/features/neighborhood-finder/components/LifestyleAnalyzingPanel'

export function PreferenceAnalyzingPage() {
  const nav = useNavigate()
  useEffect(() => {
    const t = setTimeout(() => nav('/finder/preference/result'), 3000)
    return () => clearTimeout(t)
  }, [nav])

  return (
    <div className="flex h-screen overflow-hidden">
      <SideNav activeType="Custom" />
      <LifestyleAnalyzingPanel />
    </div>
  )
}
