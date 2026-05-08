import { useState } from 'react'
import { SideNav } from '@/components/layout/SideNav'
import { BottomNav } from '@/components/layout/BottomNav'
import { LifestyleResultPanel } from '@/features/neighborhood-finder/components/LifestyleResultPanel'
import { MapPlaceholder } from '@/components/ui/MapPlaceholder'
import { ErrorState } from '@/components/ui/ErrorState'
import { EmptyState } from '@/components/ui/EmptyState'
import { Skeleton } from '@/components/ui/Skeleton'
import { useResults } from '@/api/queries/useResults'
import { LIFESTYLE_TYPES } from '@/data/mocks'

const ITEMS_PER_PAGE = 4

export function PreferenceResultPage() {
  const [page, setPage] = useState(1)
  const { data, isLoading, error, refetch } = useResults({ lifestyleId: 'efficient' })

  const lifestyle = LIFESTYLE_TYPES.find((l) => l.id === data?.lifestyleId) ?? LIFESTYLE_TYPES[0]
  const resultTitle = `${lifestyle.emoji} ${lifestyle.label}`
  const total = data?.total ?? 0
  const totalPages = Math.max(1, Math.ceil(total / ITEMS_PER_PAGE))
  const start = (page - 1) * ITEMS_PER_PAGE
  const pageItems = (data?.items ?? []).slice(start, start + ITEMS_PER_PAGE)

  return (
    <div className="flex min-h-screen w-full pb-[56px] lg:pb-0">
      <SideNav activeType="Custom" />
      {isLoading ? (
        <div className="flex w-full flex-col gap-md p-xl md:w-[420px] md:shrink-0 md:min-h-screen">
          <Skeleton className="h-[34px] w-full" />
          <Skeleton className="h-[60px] w-full" />
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-[100px] w-full" />
          ))}
        </div>
      ) : error ? (
        <div className="flex w-full items-center justify-center p-xl md:w-[420px] md:shrink-0 md:min-h-screen">
          <ErrorState title="결과를 불러올 수 없어요" onRetry={() => refetch()} />
        </div>
      ) : !data?.items.length ? (
        <div className="flex w-full items-center justify-center p-xl md:w-[420px] md:shrink-0 md:min-h-screen">
          <EmptyState title="추천 동네가 없어요" />
        </div>
      ) : (
        <LifestyleResultPanel
          title="내 취향 기반"
          resultTitle={resultTitle}
          recommendedCount={data.total}
          cards={pageItems.map((r) => ({
            id: r.id,
            dong: r.dong,
            fullAddress: r.fullAddress,
            liked: r.liked,
            tags: r.tags,
            score: r.score,
          }))}
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      )}
      <MapPlaceholder className="hidden md:block flex-1 min-w-0" />
      <BottomNav activeType="Custom" className="lg:hidden" />
    </div>
  )
}
