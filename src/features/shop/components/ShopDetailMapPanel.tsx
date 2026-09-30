import { KakaoMap, type MapMarker } from '@/components/map/KakaoMap'
import { MapOverlayCard } from './MapOverlayCard'
import { cn } from '@/lib/cn'
import type { RecruitmentStatus } from '@/api/contracts/shops'

// Figma 1:1: ShopDetailPage MenuGroup·InfoGroup의 Map Panel (591:10795 / 1691:6381)
// 내용: 가게 위치 마커 + 하단 중앙 MapOverlayCard
//
// props 는 list summary 만으로 즉시 렌더 가능하고 detail 로드 후 enrich 되는 구조.
// (가게 카드 클릭 → 캐시된 name/thumbnail/lat/lng 로 즉시 표시 → menus 채워짐)
export interface ShopDetailMapPanelProps {
  name: string
  thumbnailUrl?: string
  address?: string
  latitude?: number | null
  longitude?: number | null
  topMenus?: string[]
  recruitmentStatus?: RecruitmentStatus
  participantCurrent?: number
  participantTotal?: number | null
  className?: string
  onJoin?: () => void
}

const SEOUL_CITY_HALL = { lat: 37.5665, lng: 126.978 }

export function ShopDetailMapPanel({
  name,
  thumbnailUrl,
  address,
  latitude,
  longitude,
  topMenus,
  recruitmentStatus,
  participantCurrent,
  participantTotal,
  className,
  onJoin,
}: ShopDetailMapPanelProps) {
  // 좌표 미적재 시 서울 시청 fallback.
  const coord =
    latitude != null && longitude != null ? { lat: latitude, lng: longitude } : SEOUL_CITY_HALL
  const markers: MapMarker[] = [{ id: 'shop', position: coord, label: name, selected: true }]

  return (
    <div className={cn('relative bg-surface-cool', className)}>
      <KakaoMap center={coord} level={4} markers={markers} className="h-full w-full" />

      {/* MapOverlayCard — map 영역 하단 중앙 (max 400w). z-10 으로 Kakao map 레이어 위. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-[30px] z-10 flex justify-center px-md">
        <div className="pointer-events-auto w-full max-w-[400px]">
          <MapOverlayCard
            image={thumbnailUrl || undefined}
            name={name}
            address={address ?? ''}
            topMenus={topMenus ?? []}
            recruitmentStatus={recruitmentStatus}
            participantCurrent={participantCurrent}
            participantTotal={participantTotal}
            actionLabel="참여하기"
            onAction={onJoin}
          />
        </div>
      </div>
    </div>
  )
}
