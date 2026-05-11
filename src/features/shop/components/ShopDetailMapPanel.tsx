import { KakaoMap, type MapMarker } from '@/components/map/KakaoMap'
import { MapOverlayCard } from './MapOverlayCard'
import { cn } from '@/lib/cn'
import type { MockShop } from '@/data/mocks'

// Figma 1:1: ShopDetailPage MenuGroup·InfoGroup의 Map Panel (591:10795 / 1691:6381)
// JobFinder / Preference 와 동일하게 KakaoMap 사용 (이전 Leaflet → 통일)
// 내용: 가게 위치 마커 + 주변 POI 마커 + 좌측 하단 MapOverlayCard
export interface ShopDetailMapPanelProps {
  shop: MockShop
  className?: string
  onJoin?: () => void
}

// 임시 mock 좌표 — 실제 위경도는 추후 데이터에 추가
const SHOP_COORD = { lat: 37.5685, lng: 126.9275 } // 연희동 근처
const POI: Array<{ id: string; name: string; coord: { lat: number; lng: number } }> = [
  { id: 'community-center', name: '주민센터', coord: { lat: 37.5697, lng: 126.9268 } },
  { id: 'yeonhui-elementary', name: '연희초등학교', coord: { lat: 37.5675, lng: 126.9252 } },
  { id: 'yeonhui-cathedral', name: '연희동성당', coord: { lat: 37.5712, lng: 126.9301 } },
  { id: 'hongje-stream', name: '홍제천', coord: { lat: 37.5728, lng: 126.9325 } },
]

export function ShopDetailMapPanel({ shop, className, onJoin }: ShopDetailMapPanelProps) {
  const address =
    shop.infoRows.find((r) => r.label === '주소')?.value ?? '서울특별시 서대문구 연희동'

  const markers: MapMarker[] = [
    { id: 'shop', position: SHOP_COORD, label: shop.name, selected: true },
    ...POI.map((p) => ({ id: p.id, position: p.coord, label: p.name })),
  ]

  return (
    <div className={cn('relative bg-surface-cool', className)}>
      <KakaoMap center={SHOP_COORD} level={4} markers={markers} className="h-full w-full" />

      {/* MapOverlayCard 절대 위치 — 좌측 하단, 400w 고정 (Figma 1:1) */}
      <div className="pointer-events-none absolute bottom-[30px] left-[30px]">
        <div className="pointer-events-auto">
          <MapOverlayCard
            image={shop.image || undefined}
            name={shop.name}
            address={address}
            topMenus={shop.menuCategories.slice(0, 3)}
            actionLabel="참여하기"
            onAction={onJoin}
          />
        </div>
      </div>
    </div>
  )
}
