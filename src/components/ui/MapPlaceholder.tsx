import { KakaoMap } from '@/components/map/KakaoMap'
import { cn } from '@/lib/cn'

// Phase 8: fluid layout (부모가 flex-1 min-w-0 등으로 크기 제어)
// JobFinder / Preference 와 동일하게 KakaoMap 사용 (이전 Leaflet → 통일)
export interface MapPlaceholderProps {
  className?: string
  center?: { lat: number; lng: number }
  level?: number
}

export function MapPlaceholder({ className, center, level }: MapPlaceholderProps) {
  return (
    <div className={cn('relative bg-surface-cool', className)}>
      <KakaoMap center={center} level={level} className="h-full w-full" />
    </div>
  )
}
