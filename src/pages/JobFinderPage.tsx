import { useState } from 'react'
import { useSearchParams } from 'react-router'
import { SideNav } from '@/components/layout/SideNav'
import { SearchListPanel } from '@/features/neighborhood-finder/components/SearchListPanel'
import { MapPlaceholder } from '@/components/ui/MapPlaceholder'
import { MOCK_RESULTS } from '@/data/mocks'

export function JobFinderPage() {
  const [params, setParams] = useSearchParams()
  const isMulti = params.get('multi') === '1'
  const [destination, setDestination] = useState('')
  const [page, setPage] = useState(1)

  const handleModeChange = (m: 'single' | 'multi') => {
    if (m === 'multi') setParams({ multi: '1' })
    else setParams({})
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <SideNav activeType="Commute" />
      <SearchListPanel
        title="출퇴근 기반"
        mode={isMulti ? 'multi' : 'single'}
        onModeChange={handleModeChange}
        destination={destination}
        onDestinationChange={setDestination}
        results={MOCK_RESULTS}
        selectedId={MOCK_RESULTS[0]?.id}
        resultCount={MOCK_RESULTS.length}
        currentPage={page}
        totalPages={5}
        onPageChange={setPage}
      />
      <MapPlaceholder width={907} height={900} />
    </div>
  )
}
