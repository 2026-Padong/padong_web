import IconStore from '@/assets/icons/icon-store.svg?react'
import IconSearch from '@/assets/icons/icon-search.svg?react'
import IconBack from '@/assets/icons/icon-back.svg?react'
import IconHome from '@/assets/icons/icon-home.svg?react'
import IconInfo from '@/assets/icons/icon-info.svg?react'
import IconLocation from '@/assets/icons/icon-location.svg?react'
import IconStorefront from '@/assets/icons/icon-storefront.svg?react'

// Figma 1:1: Tile · Icon · UI (490:992) > Icon COMPONENT_SET (7 types)
// 24×24 — currentColor 기반 SVG, 상위에서 text-color로 색상 제어
export type IconType = 'Store' | 'Search' | 'Back' | 'Home' | 'Info' | 'Location' | 'Storefront'

const MAP: Record<IconType, React.FC<React.SVGProps<SVGSVGElement>>> = {
  Store: IconStore,
  Search: IconSearch,
  Back: IconBack,
  Home: IconHome,
  Info: IconInfo,
  Location: IconLocation,
  Storefront: IconStorefront,
}

export interface IconProps {
  type: IconType
  size?: number
  className?: string
}

export function Icon({ type, size = 24, className }: IconProps) {
  const Component = MAP[type]
  return <Component width={size} height={size} className={className} aria-hidden />
}
