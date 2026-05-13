import { useEffect, useRef, useState } from 'react'
import { CustomOverlayMap, Map, Polygon, useKakaoLoader } from 'react-kakao-maps-sdk'
import { cn } from '@/lib/cn'

// Seoul 시청 좌표 (지도 기본 중심)
const SEOUL_CENTER = { lat: 37.5665, lng: 126.978 }

export interface DongGeoFeature {
  /** 행정동 식별자 (코드 또는 이름) */
  id: string
  name: string
  /** 0~100 — 추천 점수, fill 채도 결정 */
  score?: number
  /** [lng, lat][] — Polygon 외곽선 좌표 (또는 MultiPolygon이면 첫 번째 ring) */
  paths: Array<{ lat: number; lng: number }>
}

export interface MapMarker {
  id: string
  position: { lat: number; lng: number }
  label?: string
  selected?: boolean
}

export interface KakaoMapProps {
  /** 행정동 GeoJSON 폴리곤 — 미제공 시 베이스맵만 표시 */
  dongs?: DongGeoFeature[]
  /** 추천 동네 마커 */
  markers?: MapMarker[]
  /** 선택된 dong/marker id — fill 강조 */
  selectedId?: string
  /** 폴리곤 클릭 콜백 */
  onDongClick?: (id: string) => void
  /** 초기 중심 좌표 — 미지정 시 서울 시청 */
  center?: { lat: number; lng: number }
  /** 초기 줌 레벨 — 카카오맵 기준 작을수록 더 확대 (기본 7) */
  level?: number
  /** 변경 시 강제로 fitBounds 재실행 (검색 트리거 용) */
  fitBoundsKey?: string | number
  className?: string
}

export function KakaoMap({
  dongs = [],
  markers = [],
  selectedId,
  onDongClick,
  center = SEOUL_CENTER,
  level = 7,
  fitBoundsKey,
  className,
}: KakaoMapProps) {
  const apiKey = import.meta.env.VITE_KAKAO_MAP_KEY as string | undefined
  const [loading, error] = useKakaoLoader({ appkey: apiKey ?? '' })
  const [hoveredId, setHoveredId] = useState<string | undefined>(undefined)
  // imperative map ref — selectedId 변할 때마다 setLevel + panTo 강제 재설정
  // (level prop이 truthy 동일하면 React가 prop 변경 감지 안 해서 재실행 X)
  const mapRef = useRef<kakao.maps.Map | null>(null)
  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const controlsAddedRef = useRef(false)
  useEffect(() => {
    if (!mapRef.current || !selectedId) return
    const map = mapRef.current
    // DetailPanel 이 막 마운트되어 맵 너비가 줄어드는 중 — relayout 후 다음 프레임에 카메라 조정
    // (안 그러면 옛 너비 기준으로 setBounds 호출해서 폴리곤이 우측 치우침)
    const raf = requestAnimationFrame(() => {
      map.relayout()
      requestAnimationFrame(() => {
        const sel = dongs.find((d) => d.id === selectedId)
        if (sel && sel.paths.length > 0) {
          const bounds = new window.kakao.maps.LatLngBounds()
          for (const p of sel.paths) bounds.extend(new window.kakao.maps.LatLng(p.lat, p.lng))
          map.setBounds(bounds, 24, 24, 24, 24)
          // 폴리곤이 작으면 줌이 과도하게 들어가서 주변 컨텍스트 사라짐 → 최소 level 6 보장
          map.setLevel(Math.max(map.getLevel(), 6))
          return
        }
        // 폴리곤 없을 때만 panTo + 고정 level
        map.setLevel(level)
        if (center) {
          map.panTo(new window.kakao.maps.LatLng(center.lat, center.lng))
        }
      })
    })
    return () => cancelAnimationFrame(raf)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId, center, level])

  // 결과 폴리곤 묶음 변경 또는 부모가 fitBoundsKey bump 시 전체 fit
  // (단, 사용자가 특정 동을 선택한 상태면 위 panTo 가 우선)
  const dongIdsKey = dongs.map((d) => d.id).join(',')
  useEffect(() => {
    if (!mapRef.current || selectedId) return
    if (dongs.length === 0) return
    const bounds = new window.kakao.maps.LatLngBounds()
    let hasPoint = false
    for (const d of dongs) {
      for (const p of d.paths) {
        bounds.extend(new window.kakao.maps.LatLng(p.lat, p.lng))
        hasPoint = true
      }
    }
    if (hasPoint) mapRef.current.setBounds(bounds, 16, 16, 16, 16)
    // padding 16px 각 면 — 폴리곤 잘림 방지
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dongIdsKey, selectedId, fitBoundsKey])

  // 컨테이너 크기 변경 (DetailPanel 토글 등) 시 Kakao map 내부 좌표 재계산
  useEffect(() => {
    const wrap = wrapperRef.current
    if (!wrap) return
    const ro = new ResizeObserver(() => {
      mapRef.current?.relayout()
    })
    ro.observe(wrap)
    return () => ro.disconnect()
  }, [])

  // 마커 사용 케이스 (dongs 없음, selectedId 없음) — center prop 변경 시 panTo.
  // Kakao Map 은 center prop 을 생성 시점에만 적용하므로 imperative panTo 필요.
  useEffect(() => {
    if (!mapRef.current || !center) return
    if (dongs.length > 0 || selectedId) return // 폴리곤/선택 흐름은 위 effect 가 처리
    mapRef.current.panTo(new window.kakao.maps.LatLng(center.lat, center.lng))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [center?.lat, center?.lng])

  // API 키 미설정 — placeholder 안내
  if (!apiKey) {
    return (
      <div
        className={cn(
          'flex h-full w-full items-center justify-center bg-surface-cool p-md text-center text-body text-text-secondary',
          className,
        )}
      >
        <p>
          VITE_KAKAO_MAP_KEY 환경변수 미설정
          <br />
          <span className="text-body-s text-text-tertiary">
            .env.example 참고 → .env.local 생성
          </span>
        </p>
      </div>
    )
  }

  if (error) {
    return (
      <div
        className={cn(
          'flex h-full w-full items-center justify-center bg-surface-cool p-md text-body text-status-critical',
          className,
        )}
      >
        지도 로드 실패
      </div>
    )
  }

  if (loading) {
    return (
      <div
        className={cn(
          'flex h-full w-full animate-pulse items-center justify-center bg-surface-cool',
          className,
        )}
      />
    )
  }

  return (
    <div ref={wrapperRef} className="h-full w-full">
    <Map
      center={center}
      level={level}
      onCreate={(map) => {
        mapRef.current = map
        // ZoomControl/MapTypeControl 을 컴포넌트로 두면 selectedId 변경 시
        // 부모 re-render → SDK 가 control 을 detach/re-attach 하다 사라지는 버그가 있음.
        // 한 번만 imperative 하게 붙임 (StrictMode 더블 마운트로 onCreate 가 2번 발화 → 중복 방지).
        if (controlsAddedRef.current) return
        controlsAddedRef.current = true
        map.addControl(
          new window.kakao.maps.ZoomControl(),
          window.kakao.maps.ControlPosition.RIGHT,
        )
        map.addControl(
          new window.kakao.maps.MapTypeControl(),
          window.kakao.maps.ControlPosition.TOPRIGHT,
        )
      }}
      className={cn('kakao-map-wrap h-full w-full', className)}
      style={{ width: '100%', height: '100%' }}
    >
      {dongs.map((d) => {
        const isSelected = d.id === selectedId
        const isHover = d.id === hoveredId
        const fillOpacity = isSelected ? 0.55 : isHover ? 0.35 : 0.2
        return (
          <Polygon
            key={d.id}
            path={d.paths}
            strokeWeight={isSelected ? 2 : 1}
            strokeColor="#2e58e4"
            strokeOpacity={isSelected ? 0.9 : 0.5}
            fillColor="#2e58e4"
            fillOpacity={fillOpacity}
            onMouseover={() => setHoveredId(d.id)}
            onMouseout={() => setHoveredId(undefined)}
            onClick={() => onDongClick?.(d.id)}
          />
        )
      })}
      {markers.map((m) => (
        <CustomOverlayMap key={m.id} position={m.position} yAnchor={1}>
          <span
            className={cn(
              'block rounded-full px-sm py-xxs text-body-s font-bold shadow-md whitespace-nowrap',
              m.selected
                ? 'bg-brand-primary text-neutral-white'
                : 'bg-neutral-white text-text-primary',
            )}
          >
            {m.label ?? m.id}
          </span>
        </CustomOverlayMap>
      ))}
    </Map>
    </div>
  )
}
