import { useState } from 'react'
import { SideNav } from '@/components/layout/SideNav'
import { LifestyleResultPanel } from '@/features/neighborhood-finder/components/LifestyleResultPanel'
import { MapPlaceholder } from '@/components/ui/MapPlaceholder'
import { MOCK_RESULTS } from '@/data/mocks'

export function PreferenceResultPage() {
  const [page, setPage] = useState(1)
  return (
    <div className="flex h-screen overflow-hidden">
      <SideNav activeType="Custom" />
      <LifestyleResultPanel
        title="내 취향 기반"
        resultTitle="🚀 효율 생활형"
        recommendedCount={12}
        cards={MOCK_RESULTS}
        currentPage={page}
        totalPages={3}
        onPageChange={setPage}
      />
      <MapPlaceholder width={908} height={900} />
    </div>
  )
}
