import { useState } from 'react'
import { SideNav } from '@/components/layout/SideNav'
import { BottomNav } from '@/components/layout/BottomNav'
import { KakaoMap, type MapMarker } from '@/components/map/KakaoMap'
import { ShopListPanel } from '@/features/shop/components/ShopListPanel'
import { ShopDetailPanel } from '@/features/shop/components/ShopDetailPanel'
import { MapOverlayCard } from '@/features/shop/components/MapOverlayCard'
import { ErrorState } from '@/components/ui/ErrorState'
import { Skeleton } from '@/components/ui/Skeleton'
import { useShopList } from '@/api/queries/useShopList'
import { useShopDetail } from '@/api/queries/useShopDetail'

const PAGE_SIZE = 4

// 단일 라우트 + 단일 KakaoMap 인스턴스 패턴.
// BE 페이징 일원화: page/filter/검색 모두 ShopListPage 가 보유 → useShopList 로 전달.
// ShopListPanel 은 dumb 컴포넌트 (props 만 받음).
export function ShopListPage() {
  const [adminDongCode, setAdminDongCode] = useState<string | undefined>(undefined)
  const [activeFilters, setActiveFilters] = useState<{
    recruiting: boolean
    cafe: boolean
    liked: boolean
  }>({ recruiting: false, cafe: false, liked: false })
  const [page, setPage] = useState(1) // 1-based UI
  const [locationLabel, setLocationLabel] = useState<string | undefined>(undefined)

  const [selectedShopId, setSelectedShopId] = useState<number | undefined>(undefined)
  const [detailTab, setDetailTab] = useState<'Menu' | 'Info'>('Menu')

  // BE 필터 매핑
  const status = activeFilters.recruiting ? 'RECRUITING' : undefined
  const category = activeFilters.cafe ? 'CAFE_DESSERT' : undefined
  const likedOnly = activeFilters.liked || undefined

  const { data, isPending, error, refetch } = useShopList({
    adminDongCode,
    status,
    category,
    likedOnly,
    page: page - 1, // BE 0-based
    size: PAGE_SIZE,
  })
  const detail = useShopDetail(selectedShopId != null ? String(selectedShopId) : undefined)

  const shops = data?.content ?? []
  const totalPages = Math.max(1, data?.totalPages ?? 1)
  const totalElements = data?.totalElements ?? 0

  // 필터/검색/동 변경 시 page=1 리셋
  const resetPage = () => setPage(1)
  const handleDongChange = (code: string | undefined, label?: string) => {
    setAdminDongCode(code)
    setLocationLabel(label)
    resetPage()
  }
  const handleFilterToggle = (id: 'recruiting' | 'cafe' | 'liked') => {
    setActiveFilters((p) => ({ ...p, [id]: !p[id] }))
    resetPage()
  }

  const handleSelect = (id: number) => {
    setSelectedShopId(id)
    setDetailTab('Menu')
  }
  const handleDeselect = () => setSelectedShopId(undefined)

  const showDetail = selectedShopId != null
  // selected 가게는 현재 페이지에 있을 수도, 없을 수도 — find 가능하면 즉시 표시
  const selectedSummary =
    selectedShopId != null ? shops.find((s) => s.id === selectedShopId) : undefined

  const mapCenter =
    selectedSummary && selectedSummary.latitude != null && selectedSummary.longitude != null
      ? { lat: selectedSummary.latitude, lng: selectedSummary.longitude }
      : undefined
  const mapMarkers: MapMarker[] = selectedSummary
    ? [
        {
          id: 'shop',
          position: mapCenter ?? { lat: 37.5665, lng: 126.978 },
          label: selectedSummary.name,
          selected: true,
        },
      ]
    : []

  return (
    <div className="flex min-h-screen w-full pb-[56px] lg:pb-0">
      <SideNav activeType="LocalShop" />
      {isPending ? (
        <div
          className="flex w-full flex-col gap-md p-xl md:w-[420px] md:shrink-0 md:min-h-screen"
          aria-busy="true"
          aria-live="polite"
          aria-label="가게 목록 불러오는 중"
        >
          <Skeleton className="h-[40px] w-full" />
          <Skeleton className="h-[34px] w-full" />
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-[131px] w-full" />
          ))}
        </div>
      ) : error ? (
        <div className="flex w-full items-center justify-center p-xl md:w-[420px] md:shrink-0 md:min-h-screen">
          <ErrorState title="가게를 불러올 수 없어요" onRetry={() => refetch()} />
        </div>
      ) : (
        <ShopListPanel
          shops={shops}
          currentPage={page}
          totalPages={totalPages}
          totalElements={totalElements}
          onPageChange={setPage}
          activeFilters={activeFilters}
          onFilterToggle={handleFilterToggle}
          locationLabel={locationLabel}
          onShopClick={handleSelect}
          onAdminDongChange={(item) => handleDongChange(item.adminDongCode, item.name)}
          className={showDetail ? 'hidden xl:flex' : undefined}
        />
      )}
      {showDetail &&
        (detail.data ? (
          <ShopDetailPanel
            shop={detail.data}
            tab={detailTab}
            onTabChange={setDetailTab}
            onBack={handleDeselect}
          />
        ) : (
          <aside className="flex w-full flex-col items-center gap-md bg-neutral-white px-xl pb-sm pt-xl md:w-[450px] md:shrink-0">
            <Skeleton className="h-[19px] w-full" />
            <Skeleton className="h-[28px] w-[180px]" />
            <Skeleton className="h-[214px] w-full" />
            <Skeleton className="h-[300px] w-full" />
          </aside>
        ))}
      <div className="relative hidden flex-1 min-w-0 bg-surface-cool md:block">
        <KakaoMap center={mapCenter} level={4} markers={mapMarkers} className="h-full w-full" />
        {showDetail && selectedSummary && (
          <div className="pointer-events-none absolute inset-x-0 bottom-[30px] z-10 flex justify-center px-md">
            <div className="pointer-events-auto w-full max-w-[400px]">
              <MapOverlayCard
                image={selectedSummary.thumbnailUrl || undefined}
                name={selectedSummary.name}
                address={detail.data?.address ?? ''}
                topMenus={detail.data?.menus.slice(0, 3).map((m) => m.name) ?? []}
                recruitmentStatus={selectedSummary.recruitmentStatus}
                participantCurrent={selectedSummary.participantCurrent}
                participantTotal={selectedSummary.participantTotal}
                actionLabel="참여하기"
              />
            </div>
          </div>
        )}
      </div>
      <BottomNav activeType="LocalShop" className="lg:hidden" />
    </div>
  )
}
