import { useState } from 'react'
import { SideNav } from '@/components/layout/SideNav'
import { BottomNav } from '@/components/layout/BottomNav'
import { LifestyleResultPanel } from '@/features/neighborhood-finder/components/LifestyleResultPanel'
import { RESULTS_PAGE_SIZE } from '@/features/neighborhood-finder/components/ResultListPanel'
import { DetailPanel } from '@/features/neighborhood-finder/components/DetailPanel'
import { KakaoMap } from '@/components/map/KakaoMap'
import { buildDetailProps } from '@/features/neighborhood-finder/utils/buildDetailProps'
import { ErrorState } from '@/components/ui/ErrorState'
import { EmptyState } from '@/components/ui/EmptyState'
import { Skeleton } from '@/components/ui/Skeleton'
import { useResults } from '@/api/queries/useResults'
import { LIFESTYLE_TYPES } from '@/data/mocks'

export function PreferenceResultPage() {
  const [page, setPage] = useState(1)
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined)
  const { data, isLoading, error, refetch } = useResults({ lifestyleId: 'efficient' })

  const lifestyle = LIFESTYLE_TYPES.find((l) => l.id === data?.lifestyleId) ?? LIFESTYLE_TYPES[0]
  const resultTitle = `${lifestyle.emoji} ${lifestyle.label}`
  const allItems = data?.items ?? []
  const total = data?.total ?? 0
  const totalPages = Math.max(1, Math.ceil(total / RESULTS_PAGE_SIZE))
  const start = (page - 1) * RESULTS_PAGE_SIZE
  const pageItems = allItems.slice(start, start + RESULTS_PAGE_SIZE)
  const selectedResult = selectedId ? allItems.find((r) => r.id === selectedId) : undefined
  const selectedRank = selectedResult
    ? allItems.findIndex((r) => r.id === selectedResult.id) + 1
    : 0

  return (
    <div className="flex min-h-screen w-full pb-14 lg:pb-0">
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
          resultDescription={lifestyle.description}
          recommendedCount={data.total}
          cards={pageItems.map((r) => ({
            id: r.id,
            dong: r.dong,
            fullAddress: r.fullAddress,
            liked: r.liked,
            tags: r.tags,
            score: r.score,
          }))}
          selectedId={selectedId}
          onSelect={setSelectedId}
          currentPage={page}
          totalPages={totalPages}
          onPageChange={(p) => {
            setPage(p)
            setSelectedId(undefined)
          }}
        />
      )}
      {selectedResult && (
        <div className="hidden md:block">
          <DetailPanel
            onBack={() => setSelectedId(undefined)}
            {...buildDetailProps(selectedResult)}
            score={selectedRank}
          />
        </div>
      )}
      <div className="hidden min-w-0 flex-1 md:block">
        <KakaoMap
          center={selectedResult?.center}
          level={selectedResult ? 6 : 7}
          dongs={pageItems
            .filter((r) => r.geometry && r.geometry.length > 0)
            .map((r) => ({ id: r.id, name: r.dong, paths: r.geometry! }))}
          markers={pageItems
            .filter((r) => r.center)
            .map((r) => ({
              id: r.id,
              position: r.center!,
              label: r.dong,
              selected: r.id === selectedId,
            }))}
          selectedId={selectedId}
          onDongClick={setSelectedId}
        />
      </div>
      <BottomNav activeType="Custom" className="lg:hidden" />
    </div>
  )
}
