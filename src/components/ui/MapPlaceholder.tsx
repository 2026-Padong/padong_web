import { LeafletMap, type LeafletMapProps } from '@/lib/map/LeafletMap'
import { cn } from '@/lib/cn'

// Phase 8: width/height props 제거 — fluid layout (`flex-1 min-w-0` 등으로 부모에서 제어)
export interface MapPlaceholderProps extends LeafletMapProps {
  className?: string
}

export function MapPlaceholder({ className, ...mapProps }: MapPlaceholderProps) {
  return (
    <div className={cn('relative bg-surface-cool', className)}>
      <LeafletMap {...mapProps} className="h-full w-full" />
    </div>
  )
}
