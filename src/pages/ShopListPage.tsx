import { useState } from 'react'
import { SideNav } from '@/components/layout/SideNav'
import { BottomNav } from '@/components/layout/BottomNav'
import { MapPlaceholder } from '@/components/ui/MapPlaceholder'
import { ShopListPanel } from '@/features/shop/components/ShopListPanel'
import { ShopDetailPanel } from '@/features/shop/components/ShopDetailPanel'
import { ShopDetailMapPanel } from '@/features/shop/components/ShopDetailMapPanel'
import { ErrorState } from '@/components/ui/ErrorState'
import { Skeleton } from '@/components/ui/Skeleton'
import { useShopList } from '@/api/queries/useShopList'
import { useShopDetail } from '@/api/queries/useShopDetail'

// 단일 라우트 패턴 — JobFinder 와 동일.
// 카드 클릭 시 route 변경 없이 detail 패널만 토글 → list 상태(page/검색/필터) 자연 보존.
// /shops/:id 직접 진입은 ShopDetailPage 가 별도 처리 (deeplink 호환).
export function ShopListPage() {
  const [adminDongCode, setAdminDongCode] = useState<string | undefined>(undefined)
  const [selectedShopId, setSelectedShopId] = useState<number | undefined>(undefined)
  const [detailTab, setDetailTab] = useState<'Menu' | 'Info'>('Menu')

  const { data, isPending, error, refetch } = useShopList({ adminDongCode })
  const detail = useShopDetail(selectedShopId != null ? String(selectedShopId) : undefined)

  const handleSelect = (id: number) => {
    setSelectedShopId(id)
    setDetailTab('Menu')
  }
  const handleDeselect = () => setSelectedShopId(undefined)

  const showDetail = selectedShopId != null
  // 리스트 캐시에서 selected 가게 summary 즉시 추출 — name/thumbnail/coord 등은
  // detail 로딩 끝나기 전부터 표시 가능. 클릭 즉시 해당 가게 overlay 가 뜸.
  const selectedSummary =
    selectedShopId != null ? data?.content.find((s) => s.id === selectedShopId) : undefined

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
          className={showDetail ? 'hidden md:flex' : undefined}
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
          // detail 로딩 중 — 패널 자리 유지하여 가게 전환 시 깜빡임 방지.
          <aside className="flex w-full flex-col items-center gap-md bg-neutral-white px-xl pb-sm pt-xl md:w-[450px] md:shrink-0">
            <Skeleton className="h-[19px] w-full" />
            <Skeleton className="h-[28px] w-[180px]" />
            <Skeleton className="h-[214px] w-full" />
            <Skeleton className="h-[300px] w-full" />
          </aside>
        ))}
      {showDetail && selectedSummary ? (
        <ShopDetailMapPanel
          name={selectedSummary.name}
          thumbnailUrl={selectedSummary.thumbnailUrl}
          address={detail.data?.address}
          latitude={selectedSummary.latitude}
          longitude={selectedSummary.longitude}
          topMenus={detail.data?.menus.slice(0, 3).map((m) => m.name)}
          className="hidden md:block flex-1 min-w-0"
        />
      ) : (
        <MapPlaceholder className="hidden md:block flex-1 min-w-0" />
      )}
      <BottomNav activeType="LocalShop" className="lg:hidden" />
    </div>
  )
}
