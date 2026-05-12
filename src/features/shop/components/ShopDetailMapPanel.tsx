import { KakaoMap, type MapMarker } from '@/components/map/KakaoMap'
import { MapOverlayCard } from './MapOverlayCard'
import { cn } from '@/lib/cn'
import type { ShopDetailResponse } from '@/api/contracts/shops'

// Figma 1:1: ShopDetailPage MenuGroup·InfoGroup의 Map Panel (591:10795 / 1691:6381)
// 내용: 가게 위치 마커 + 좌측 하단 MapOverlayCard
// 좌표는 ShopDetailResponse.latitude/longitude — 백엔드 적재 대기 (없으면 서울 시청 fallback)
export interface ShopDetailMapPanelProps {
  shop: ShopDetailResponse
  className?: string
  onJoin?: () => void
}

const SEOUL_CITY_HALL = { lat: 37.5665, lng: 126.978 }

export function ShopDetailMapPanel({ shop, className, onJoin }: ShopDetailMapPanelProps) {
  // 백엔드가 좌표 적재하면 자동 표시. 미적재 시 서울 시청 fallback (모든 가게 동일 위치 — 시각적 placeholder).
  const coord =
    shop.latitude != null && shop.longitude != null
      ? { lat: shop.latitude, lng: shop.longitude }
      : SEOUL_CITY_HALL
  const markers: MapMarker[] = [
    { id: 'shop', position: coord, label: shop.name, selected: true },
  ]

  return (
    <div className={cn('relative bg-surface-cool', className)}>
      <KakaoMap center={coord} level={4} markers={markers} className="h-full w-full" />

      {/* MapOverlayCard 절대 위치 — 좌측 하단, 400w 고정 (Figma 1:1) */}
      <div className="pointer-events-none absolute bottom-[30px] left-[30px]">
        <div className="pointer-events-auto">
          <MapOverlayCard
            image={shop.thumbnailUrl || undefined}
            name={shop.name}
            address={shop.address}
            topMenus={shop.menus.slice(0, 3).map((m) => m.name)}
            actionLabel="참여하기"
            onAction={onJoin}
          />
        </div>
      </div>
    </div>
  )
}
