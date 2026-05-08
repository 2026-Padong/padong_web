import { Marker, Tooltip } from 'react-leaflet'
import { LeafletMap } from '@/lib/map/LeafletMap'
import { MapOverlayCard } from './MapOverlayCard'
import { cn } from '@/lib/cn'
import type { MockShop } from '@/data/mocks'

// Figma 1:1: ShopDetailPage MenuGroup·InfoGroup의 Map Panel (591:10795 / 1691:6381)
// Phase 8: width/height props 제거 — fluid (`flex-1 min-w-0` 등 부모에서 제어)
// 내용: Leaflet 지도 + POI 라벨 4종 + 가게 마커 + MapOverlayCard 절대 위치
export interface ShopDetailMapPanelProps {
  shop: MockShop
  className?: string
  onJoin?: () => void
}

// 임시 mock 좌표 — 실제 위경도는 추후 데이터에 추가
const SHOP_COORD: [number, number] = [37.5685, 126.9275] // 연희동 근처
const POI: Array<{ id: string; name: string; coord: [number, number] }> = [
  { id: 'community-center', name: '주민센터', coord: [37.5697, 126.9268] },
  { id: 'yeonhui-elementary', name: '연희초등학교', coord: [37.5675, 126.9252] },
  { id: 'yeonhui-cathedral', name: '연희동성당', coord: [37.5712, 126.9301] },
  { id: 'hongje-stream', name: '홍제천', coord: [37.5728, 126.9325] },
]

export function ShopDetailMapPanel({ shop, className, onJoin }: ShopDetailMapPanelProps) {
  const address =
    shop.infoRows.find((r) => r.label === '주소')?.value ?? '서울특별시 서대문구 연희동'

  return (
    <div className={cn('relative bg-surface-cool', className)}>
      <LeafletMap center={SHOP_COORD} zoom={15} className="h-full w-full">
        {POI.map((p) => (
          <Marker key={p.id} position={p.coord}>
            <Tooltip
              permanent
              direction="top"
              offset={[0, -10]}
              className="!border-0 !bg-transparent !shadow-none"
            >
              <span className="text-body-s font-medium text-text-primary whitespace-nowrap">
                {p.name}
              </span>
            </Tooltip>
          </Marker>
        ))}
        <Marker position={SHOP_COORD}>
          <Tooltip
            permanent
            direction="bottom"
            offset={[0, 10]}
            className="!border-0 !bg-transparent !shadow-none"
          >
            <span className="rounded-md bg-brand-primary px-xs py-xxs text-body-s font-bold text-neutral-white whitespace-nowrap">
              {shop.name}
            </span>
          </Tooltip>
        </Marker>
      </LeafletMap>

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
