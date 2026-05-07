import { useState } from 'react'
import { useSearchParams } from 'react-router'
import { SideNav } from '@/components/layout/SideNav'
import { SearchListPanel } from '@/features/neighborhood-finder/components/SearchListPanel'
import { MapPlaceholder } from '@/components/ui/MapPlaceholder'
import { ErrorState } from '@/components/ui/ErrorState'
import { Skeleton } from '@/components/ui/Skeleton'
import { useResults } from '@/api/queries/useResults'

export function JobFinderPage() {
  const [params, setParams] = useSearchParams()
  const isMulti = params.get('multi') === '1'
  const [destination, setDestination] = useState('')
  const [page, setPage] = useState(1)

  const { data, isLoading, error, refetch } = useResults({ multi: isMulti })

  const handleModeChange = (m: 'single' | 'multi') => {
    if (m === 'multi') setParams({ multi: '1' })
    else setParams({})
  }

  if (isLoading) {
    return (
      <div className="flex h-screen overflow-hidden">
        <SideNav activeType="Commute" />
        <div className="flex h-[900px] w-[421px] flex-col gap-md p-xl">
          <Skeleton className="h-[60px] w-full" />
          <Skeleton className="h-[34px] w-full" />
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-[100px] w-full" />
          ))}
        </div>
        <MapPlaceholder width={907} height={900} />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-screen overflow-hidden">
        <SideNav activeType="Commute" />
        <div className="flex h-[900px] w-[421px] items-center justify-center">
          <ErrorState onRetry={() => refetch()} />
        </div>
        <MapPlaceholder width={907} height={900} />
      </div>
    )
  }

  const items = data?.items ?? []

  return (
    <div className="flex h-screen overflow-hidden">
      <SideNav activeType="Commute" />
      <SearchListPanel
        title="출퇴근 기반"
        mode={isMulti ? 'multi' : 'single'}
        onModeChange={handleModeChange}
        destination={destination}
        onDestinationChange={setDestination}
        results={items.map((r) => ({
          id: r.id,
          dong: r.dong,
          fullAddress: r.fullAddress,
          liked: r.liked,
          tags: r.tags,
          score: r.score,
        }))}
        selectedId={items[0]?.id}
        resultCount={data?.total ?? 0}
        currentPage={page}
        totalPages={5}
        onPageChange={setPage}
      />
      <MapPlaceholder width={907} height={900} />
    </div>
  )
}
