import type { ReactNode } from 'react'
import { MapContainer, TileLayer } from 'react-leaflet'
import { DEFAULT_ZOOM, OSM_ATTRIBUTION, OSM_TILE_URL, SEOUL_CENTER } from './tiles'

export interface LeafletMapProps {
  center?: [number, number]
  zoom?: number
  className?: string
  children?: ReactNode
}

export function LeafletMap({
  center = SEOUL_CENTER,
  zoom = DEFAULT_ZOOM,
  className = 'h-full w-full',
  children,
}: LeafletMapProps) {
  return (
    <MapContainer center={center} zoom={zoom} className={className}>
      <TileLayer url={OSM_TILE_URL} attribution={OSM_ATTRIBUTION} />
      {children}
    </MapContainer>
  )
}
