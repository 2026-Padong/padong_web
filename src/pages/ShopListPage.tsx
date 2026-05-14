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

// 단일 라우트 + 단일 KakaoMap 인스턴스 패턴 (JobFinder 와 동일).
// 카드 클릭 시 route 변경 없이 detail 패널만 토글. KakaoMap 은 항상 같은 컴포넌트로
// 마운트 유지 → 선택 시 marker/overlay 만 추가됨 → 깜빡임 없음.
// /shops/:id 직접 진입은 ShopDetailPage 가 별도 처리 (deeplink 호환).
export function ShopListPage() {
  const [adminDongCode, setAdminDongCode] = useState<string | undefined>(undefined)
  const [selectedShopId, setSelectedShopId] = useState<number | undefined>(undefined)
  const [detailTab, setDetailTab] = useState<'Menu' | 'Info'>('Menu')

  // size=200 — 클라이언트에서 4개씩 페이징하므로 한 번에 충분히 받아옴.
  const { data, isPending, error, refetch } = useShopList({ adminDongCode, size: 200 })
  const detail = useShopDetail(selectedShopId != null ? String(selectedShopId) : undefined)

  const handleSelect = (id: number) => {
    setSelectedShopId(id)
    setDetailTab('Menu')
  }
  const handleDeselect = () => setSelectedShopId(undefined)

  const showDetail = selectedShopId != null
  // 리스트 캐시에서 selected 가게 summary 즉시 추출 — name/thumbnail/coord 등은
  // detail 로딩 끝나기 전부터 표시 가능.
  const selectedSummary =
    selectedShopId != null ? data?.content.find((s) => s.id === selectedShopId) : undefined

  const mapCenter =
    selectedSummary && selectedSummary.latitude != null && selectedSummary.longitude != null
      ? { lat: selectedSummary.latitude, lng: selectedSummary.longitude }
      : undefined
  const mapMarkers: MapMarker[] = selectedSummary
    ? [{ id: 'shop', position: mapCenter ?? { lat: 37.5665, lng: 126.978 }, label: selectedSummary.name, selected: true }]
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
          shops={data?.content ?? []}
          onShopClick={handleSelect}
          onAdminDongChange={(item) => setAdminDongCode(item.adminDongCode)}
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
      {/* 지도 영역 — 항상 같은 컴포넌트로 유지. selection 시 marker + overlay 만 추가. */}
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
