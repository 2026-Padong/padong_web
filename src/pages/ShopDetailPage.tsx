import { useNavigate, useParams, useSearchParams } from 'react-router'
import { SideNav } from '@/components/layout/SideNav'
import { BottomNav } from '@/components/layout/BottomNav'
import { ShopListPanel } from '@/features/shop/components/ShopListPanel'
import { ShopDetailPanel } from '@/features/shop/components/ShopDetailPanel'
import { ShopDetailMapPanel } from '@/features/shop/components/ShopDetailMapPanel'
import { ErrorState } from '@/components/ui/ErrorState'
import { Skeleton } from '@/components/ui/Skeleton'
import { useShopList } from '@/api/queries/useShopList'
import { useShopDetail } from '@/api/queries/useShopDetail'
import type { ShopSummaryResponse, ShopDetailResponse } from '@/api/contracts/shops'
import type { MockShop, ShopStatus } from '@/data/mocks'

function dtoToShop(dto: ShopSummaryResponse): MockShop {
  return {
    id: String(dto.id),
    image: dto.imageUrl,
    name: dto.name,
    category: dto.category,
    description: dto.description || undefined,
    status: dto.status.toLowerCase() as ShopStatus,
    participantCurrent: dto.participantCurrent,
    participantTotal: dto.participantTotal,
    liked: dto.likedByCurrentUser,
    bookmarked: false,
    images: [dto.imageUrl],
    menuCategories: [],
    menus: [],
    infoRows: [],
  }
}

// 백엔드 ShopDetailResponse (GET /stores/{id}) → 내부 MockShop 형태로 매핑
// 추후 ShopDetailPanel 이 ShopDetailResponse 직접 받게 리팩토링 시 제거 가능
function detailToShop(dto: ShopDetailResponse): MockShop {
  return {
    id: String(dto.id),
    image: dto.imageUrl,
    name: dto.name,
    category: dto.category,
    description: dto.description || undefined,
    status: dto.status.toLowerCase() as ShopStatus,
    participantCurrent: dto.participantCurrent,
    participantTotal: dto.participantTotal,
    liked: dto.likedByCurrentUser,
    bookmarked: false,
    images: dto.images,
    menuCategories: dto.menuCategories,
    menus: dto.menus.map((m) => ({
      name: m.name,
      price: m.price,
    })),
    infoRows: [
      { label: '주소', value: dto.address },
      { label: '전화', value: dto.phoneNumber },
    ],
  }
}

export function ShopDetailPage() {
  const { id } = useParams<{ id: string }>()
  const nav = useNavigate()
  const [params, setParams] = useSearchParams()
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

  const shop = detailToShop(detail.data)
  const sidebarShops = (list.data?.content ?? []).map(dtoToShop)

  return (
    <div className="flex min-h-screen w-full pb-[56px] lg:pb-0">
      <SideNav activeType="LocalShop" />
      {/* 사이드바 — list 데이터 있을 때만 표시 (없어도 detail은 정상 렌더) */}
      {sidebarShops.length > 0 && (
        <ShopListPanel
          shops={sidebarShops}
          selectedId={shop.id}
          onShopClick={(sid) => nav(`/shops/${sid}`, { viewTransition: true })}
          className="hidden xl:flex"
        />
      )}
      <ShopDetailPanel
        shop={shop}
        tab={tab}
        onTabChange={(t) => setParams({ tab: t })}
        onBack={() => nav('/shops', { viewTransition: true })}
      />
      <ShopDetailMapPanel shop={shop} className="hidden md:block flex-1 min-w-0" />
      <BottomNav activeType="LocalShop" className="lg:hidden" />
    </div>
  )
}
