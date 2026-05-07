import { LeafletMap } from '@/lib/map/LeafletMap'

export interface DataMapProps {
  /** 표시할 데이터 포인트 (좌표 + 값) */
  points?: Array<{ lat: number; lng: number; value: number }>
  width?: number
  height?: number
}

/**
 * HomePage 우측 컬럼의 데이터 시각화 지도.
 * Figma: 600x493 (HomePage CityDataSection 안에서는 705x493로 확장)
 * Phase 3에서는 Leaflet 빈 지도. 마커/오버레이는 별도 phase.
 */
export function DataMap({ points = [], width = 600, height = 493 }: DataMapProps) {
  return (
    <div className="overflow-hidden rounded-xl" style={{ width, height }}>
      <LeafletMap />
      {/* TODO: points 마커/오버레이 (별도 phase) */}
      {points.length > 0 && null}
    </div>
  )
}
