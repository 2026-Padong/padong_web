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

  const ITEMS_PER_PAGE = 4
  const allItems = data?.items ?? []
  const total = data?.total ?? 0
  const totalPages = Math.max(1, Math.ceil(total / ITEMS_PER_PAGE))
  const start = (page - 1) * ITEMS_PER_PAGE
  const items = allItems.slice(start, start + ITEMS_PER_PAGE)
  const destinations = isMulti ? ['연희동', '강남역', '시청'] : ['연희동']
  const hint = destinations.join(' · ')
  const summarySubtitle = isMulti
    ? `추천 동네 ${total}개 · ${destinations.length}개 직장 종합`
    : `추천 동네 ${total}개`

  return (
    <div className="flex h-screen overflow-hidden">
      <SideNav activeType="Commute" />
      <SearchListPanel
        title="직장 위치 기반"
        mode={isMulti ? 'multi' : 'single'}
        onModeChange={handleModeChange}
        destination={destination}
        onDestinationChange={setDestination}
        hint={hint}
        results={items.map((r) => ({
          id: r.id,
          dong: r.dong,
          fullAddress: r.fullAddress,
          liked: r.liked,
          tags: r.tags,
          score: r.score,
        }))}
        selectedId={items[0]?.id}
        resultCount={total}
        resultSubtitle={summarySubtitle}
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
      <MapPlaceholder width={907} height={900} />
    </div>
  )
}
