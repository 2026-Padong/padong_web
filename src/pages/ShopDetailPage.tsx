import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router'
import { SideNav } from '@/components/layout/SideNav'
import { BottomNav } from '@/components/layout/BottomNav'
import { ShopListPanel } from '@/features/shop/components/ShopListPanel'
import { ShopDetailPanel } from '@/features/shop/components/ShopDetailPanel'
import { ShopDetailMapPanel } from '@/features/shop/components/ShopDetailMapPanel'
import { ErrorState } from '@/components/ui/ErrorState'
import { Skeleton } from '@/components/ui/Skeleton'
import { useShopList } from '@/api/queries/useShopList'
import { useShopDetail } from '@/api/queries/useShopDetail'

export function ShopDetailPage() {
  const { id } = useParams<{ id: string }>()
  const nav = useNavigate()
  const location = useLocation()
  const [params, setParams] = useSearchParams()
  // 직접 진입 (공유 링크 등) 이면 history 가 비어있어 nav(-1) 이 안전하지 않음.
  // react-router 가 SPA 라우팅으로 진입한 경우엔 location.key 가 default 가 아님.
  const handleBack = () =>
    location.key !== 'default' ? nav(-1) : nav('/shops', { viewTransition: true })
  const tab = (params.get('tab') ?? 'Menu') as 'Menu' | 'Info'

  const list = useShopList()
  const detail = useShopDetail(id)

  // detail 만으로 렌더 결정 — list는 사이드바 보조 데이터라 실패해도 페이지는 떠야 함
  if (detail.isLoading) {
    return (
      <div
        className="flex min-h-screen w-full pb-[56px] lg:pb-0"
        aria-busy="true"
        aria-live="polite"
        aria-label="가게 상세 불러오는 중"
      >
        <SideNav activeType="LocalShop" />
        <div className="hidden flex-col gap-md p-xl xl:flex xl:w-[420px] xl:shrink-0 xl:min-h-screen">
          <Skeleton className="h-[131px] w-full" />
          <Skeleton className="h-[131px] w-full" />
        </div>
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
  const sidebarShops = list.data?.content ?? []

  return (
    <div className="flex min-h-screen w-full pb-[56px] lg:pb-0">
      <SideNav activeType="LocalShop" />
      {/* 사이드바 — list 데이터 있을 때만 표시 (없어도 detail은 정상 렌더) */}
      {sidebarShops.length > 0 && (
        <ShopListPanel
          shops={sidebarShops}
          onShopClick={(sid) => nav(`/shops/${sid}`, { viewTransition: true })}
          className="hidden xl:flex"
        />
      )}
      <ShopDetailPanel
        shop={shop}
        tab={tab}
        onTabChange={(t) => setParams({ tab: t })}
        onBack={handleBack}
      />
      <ShopDetailMapPanel shop={shop} className="hidden md:block flex-1 min-w-0" />
      <BottomNav activeType="LocalShop" className="lg:hidden" />
    </div>
  )
}
