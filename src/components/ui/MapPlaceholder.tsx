import { LeafletMap, type LeafletMapProps } from '@/lib/map/LeafletMap'

export interface MapPlaceholderProps extends LeafletMapProps {
  width?: number
  height?: number
}

export function MapPlaceholder({ width = 850, height = 900, ...mapProps }: MapPlaceholderProps) {
  return (
    <div className="relative bg-surface-cool" style={{ width, height }}>
      <LeafletMap {...mapProps} className="h-full w-full" />
    </div>
  )
}
