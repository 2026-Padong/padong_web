import { useNavigate, useParams, useSearchParams } from 'react-router'
import { SideNav } from '@/components/layout/SideNav'
import { ShopListPanel } from '@/features/shop/components/ShopListPanel'
import { ShopDetailPanel } from '@/features/shop/components/ShopDetailPanel'
import { ShopDetailMapPanel } from '@/features/shop/components/ShopDetailMapPanel'
import { ErrorState } from '@/components/ui/ErrorState'
import { Skeleton } from '@/components/ui/Skeleton'
import { useShopList } from '@/api/queries/useShopList'
import { useShopDetail } from '@/api/queries/useShopDetail'
import type { ShopDto, ShopDetailDto } from '@/api/contracts/shops'
import type { MockShop } from '@/data/mocks'

function dtoToShop(dto: ShopDto): MockShop {
  return {
    id: dto.id,
    image: dto.image,
    name: dto.name,
    category: dto.category,
    description: dto.description ?? undefined,
    status: dto.status,
    participantCurrent: dto.participantCurrent,
    participantTotal: dto.participantTotal,
    liked: dto.liked,
    bookmarked: false,
    images: [dto.image],
    menuCategories: [],
    menus: [],
    infoRows: [],
  }
}

function detailToShop(dto: ShopDetailDto): MockShop {
  return {
    id: dto.id,
    image: dto.image,
    name: dto.name,
    category: dto.category,
    description: dto.description ?? undefined,
    status: dto.status,
    participantCurrent: dto.participantCurrent,
    participantTotal: dto.participantTotal,
    liked: dto.liked,
    bookmarked: dto.bookmarked,
    images: dto.images,
    menuCategories: dto.menuCategories,
    menus: dto.menus.map((m) => ({
      name: m.name,
      description: m.description ?? undefined,
      price: m.price,
      originalPrice: m.originalPrice ?? undefined,
      image: m.image ?? undefined,
    })),
    infoRows: dto.infoRows,
  }
}

export function ShopDetailPage() {
  const { id } = useParams<{ id: string }>()
  const nav = useNavigate()
  const [params, setParams] = useSearchParams()
  const tab = (params.get('tab') ?? 'Menu') as 'Menu' | 'Info'

  const list = useShopList()
  const detail = useShopDetail(id)

  if (detail.isLoading || list.isLoading) {
    return (
      <div className="flex h-screen overflow-hidden">
        <SideNav activeType="LocalShop" />
        <div className="flex h-[900px] w-[420px] flex-col gap-md p-xl">
          <Skeleton className="h-[131px] w-full" />
          <Skeleton className="h-[131px] w-full" />
        </div>
        <div className="flex h-[900px] w-[450px] flex-col gap-md p-xl">
          <Skeleton className="h-[19px] w-[80px]" />
          <Skeleton className="h-[40px] w-[200px]" />
          <Skeleton className="h-[214px] w-full" />
          <Skeleton className="h-[300px] w-full" />
        </div>
      </div>
    )
  }

  if (detail.error || !detail.data) {
    return (
      <div className="flex h-screen overflow-hidden">
        <SideNav activeType="LocalShop" />
        <div className="flex flex-1 items-center justify-center">
          <ErrorState
            title="가게를 찾을 수 없어요"
            message="삭제되었거나 잠시 점검 중일 수 있어요"
            onRetry={() => detail.refetch()}
          />
        </div>
      </div>
    )
  }

  const shop = detailToShop(detail.data)
  const sidebarShops = (list.data?.items ?? []).map(dtoToShop)

  return (
    <div className="flex h-screen overflow-hidden">
      <SideNav activeType="LocalShop" />
      <ShopListPanel
        shops={sidebarShops}
        selectedId={shop.id}
        onShopClick={(sid) => nav(`/shops/${sid}`)}
      />
      <ShopDetailPanel
        shop={shop}
        tab={tab}
        onTabChange={(t) => setParams({ tab: t })}
        onBack={() => nav('/shops')}
      />
      <ShopDetailMapPanel shop={shop} width={tab === 'Menu' ? 458 : 418} />
    </div>
  )
}
