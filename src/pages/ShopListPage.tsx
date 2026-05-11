import { useState } from 'react'
import { useNavigate } from 'react-router'
import { SideNav } from '@/components/layout/SideNav'
import { BottomNav } from '@/components/layout/BottomNav'
import { MapPlaceholder } from '@/components/ui/MapPlaceholder'
import { ShopListPanel } from '@/features/shop/components/ShopListPanel'
import { ErrorState } from '@/components/ui/ErrorState'
import { Skeleton } from '@/components/ui/Skeleton'
import { useShopList } from '@/api/queries/useShopList'
import type { ShopSummaryResponse } from '@/api/contracts/shops'
import type { MockShop, ShopStatus } from '@/data/mocks'

// ShopSummaryResponse → 패널이 기대하는 MockShop 형태 (목록은 메뉴/info 비어 있음)
function toShop(dto: ShopSummaryResponse): MockShop {
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

export function ShopListPage() {
  const nav = useNavigate()
  // 자동완성에서 동 선택 시 adminDongCode 저장 → useShopList 파라미터로 → React Query 자동 refetch
  const [adminDongCode, setAdminDongCode] = useState<string | undefined>(undefined)
  // isPending = 최초 로딩만 (refetch 시엔 keepPreviousData 로 이전 데이터 유지 → panel unmount 방지)
  const { data, isPending, error, refetch } = useShopList({ adminDongCode })

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
        // 빈 결과도 패널은 항상 렌더 — 검색/필터/위치칩 유지, 카드 영역에서만 "가게가 없어요"
        <ShopListPanel
          shops={(data?.content ?? []).map(toShop)}
          onShopClick={(id) => nav(`/shops/${id}`, { viewTransition: true })}
          onAdminDongChange={(item) => setAdminDongCode(item.adminDongCode)}
        />
      )}
      <MapPlaceholder className="hidden md:block flex-1 min-w-0" />
      <BottomNav activeType="LocalShop" className="lg:hidden" />
    </div>
  )
}
