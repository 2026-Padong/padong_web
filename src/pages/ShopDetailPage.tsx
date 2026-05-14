import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router'
import { SideNav } from '@/components/layout/SideNav'
import { BottomNav } from '@/components/layout/BottomNav'
import { ShopDetailPanel } from '@/features/shop/components/ShopDetailPanel'
import { ShopDetailMapPanel } from '@/features/shop/components/ShopDetailMapPanel'
import { ErrorState } from '@/components/ui/ErrorState'
import { Skeleton } from '@/components/ui/Skeleton'
import { useShopDetail } from '@/api/queries/useShopDetail'

// 직접 진입 (deeplink, 공유 링크) 전용. /shops 에서 카드 클릭은 ShopListPage 가 state 토글로 처리.
export function ShopDetailPage() {
  const { id } = useParams<{ id: string }>()
  const nav = useNavigate()
  const location = useLocation()
  const [params, setParams] = useSearchParams()
  const handleBack = () =>
    location.key !== 'default' ? nav(-1) : nav('/shops', { viewTransition: true })
  const tab = (params.get('tab') ?? 'Menu') as 'Menu' | 'Info'

  const detail = useShopDetail(id)

  if (detail.isLoading) {
    return (
      <div
        className="flex min-h-screen w-full pb-[56px] lg:pb-0"
        aria-busy="true"
        aria-live="polite"
        aria-label="가게 상세 불러오는 중"
      >
        <SideNav activeType="LocalShop" />
        <div className="flex w-full flex-col gap-md p-xl md:w-[450px] md:shrink-0 md:min-h-screen">
          <Skeleton className="h-[19px] w-[80px]" />
          <Skeleton className="h-[40px] w-[200px]" />
          <Skeleton className="h-[214px] w-full" />
          <Skeleton className="h-[300px] w-full" />
        </div>
        <BottomNav activeType="LocalShop" className="lg:hidden" />
      </div>
    )
  }

  if (detail.error || !detail.data) {
    return (
      <div className="flex min-h-screen w-full pb-[56px] lg:pb-0">
        <SideNav activeType="LocalShop" />
        <div className="flex flex-1 items-center justify-center">
          <ErrorState
            title="가게를 찾을 수 없어요"
            message="삭제되었거나 잠시 점검 중일 수 있어요"
            onRetry={() => detail.refetch()}
          />
        </div>
        <BottomNav activeType="LocalShop" className="lg:hidden" />
      </div>
    )
  }

  const shop = detail.data

  return (
    <div className="flex min-h-screen w-full pb-[56px] lg:pb-0">
      <SideNav activeType="LocalShop" />
      <ShopDetailPanel
        shop={shop}
        tab={tab}
        onTabChange={(t) => setParams({ tab: t })}
        onBack={handleBack}
      />
      <ShopDetailMapPanel
        name={shop.name}
        thumbnailUrl={shop.thumbnailUrl}
        address={shop.address}
        latitude={shop.latitude}
        longitude={shop.longitude}
        topMenus={shop.menus.slice(0, 3).map((m) => m.name)}
        recruitmentStatus={shop.recruitmentStatus}
        participantCurrent={shop.participantCurrent}
        participantTotal={shop.participantTotal}
        className="hidden md:block flex-1 min-w-0"
      />
      <BottomNav activeType="LocalShop" className="lg:hidden" />
    </div>
  )
}
