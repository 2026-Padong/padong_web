import { useNavigate } from 'react-router'
import { SideNav } from '@/components/layout/SideNav'
import { BottomNav } from '@/components/layout/BottomNav'
import { MapPlaceholder } from '@/components/ui/MapPlaceholder'
import { ShopListPanel } from '@/features/shop/components/ShopListPanel'
import { ErrorState } from '@/components/ui/ErrorState'
import { EmptyState } from '@/components/ui/EmptyState'
import { Skeleton } from '@/components/ui/Skeleton'
import { useShopList } from '@/api/queries/useShopList'
import type { ShopDto } from '@/api/contracts/shops'
import type { MockShop } from '@/data/mocks'

// 목록 DTO → 패널이 기대하는 MockShop 모양으로 어댑팅 (목록은 메뉴/info 비어 있음)
function toShop(dto: ShopDto): MockShop {
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

export function ShopListPage() {
  const nav = useNavigate()
  const { data, isLoading, error, refetch } = useShopList()

  return (
    <div className="flex min-h-screen w-full pb-[56px] lg:pb-0">
      <SideNav activeType="LocalShop" />
      {isLoading ? (
        <div className="flex w-full flex-col gap-md p-xl md:w-[420px] md:shrink-0 md:min-h-screen">
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
      ) : !data?.items.length ? (
        <div className="flex w-full items-center justify-center p-xl md:w-[420px] md:shrink-0 md:min-h-screen">
          <EmptyState title="가게가 없어요" />
        </div>
      ) : (
        <ShopListPanel shops={data.items.map(toShop)} onShopClick={(id) => nav(`/shops/${id}`)} />
      )}
      <MapPlaceholder className="hidden md:block flex-1 min-w-0" />
      <BottomNav activeType="LocalShop" className="lg:hidden" />
    </div>
  )
}
