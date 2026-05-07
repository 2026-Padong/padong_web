import { LeafletMap } from '@/lib/map/LeafletMap'

// Figma: Tile · DataMap (950:3179) > DataMap COMPONENT
// 600x493 — Figma는 25개 서울 구의 정적 SVG shape으로 구성된 design-only 지도
// 코드는 의도된 divergence: Leaflet + OSM 타일로 실제 인터랙티브 지도 구현
// (zoom/pan 가능, 실시간 데이터 오버레이 가능 — 별도 phase에서 마커/히트맵 추가)
export interface DataMapProps {
  /** 표시할 데이터 포인트 (좌표 + 값) */
  points?: Array<{ lat: number; lng: number; value: number }>
  width?: number
  height?: number
}

export function DataMap({ points = [], width = 600, height = 493 }: DataMapProps) {
  return (
    <div className="overflow-clip rounded-xl" style={{ width, height }}>
      <LeafletMap />
      {/* TODO: points 마커/오버레이 (별도 phase) */}
      {points.length > 0 && null}
    </div>
  )
}
