import {
  ArrowLeft,
  Home,
  Info,
  MapPin,
  Search,
  ShoppingBag,
  Store,
  type LucideIcon,
} from 'lucide-react'

export type IconType = 'Store' | 'Search' | 'Back' | 'Home' | 'Info' | 'Location' | 'Storefront'

const MAP: Record<IconType, LucideIcon> = {
  Store,
  Search,
  Back: ArrowLeft,
  Home,
  Info,
  Location: MapPin,
  Storefront: ShoppingBag,
}

export interface IconProps {
  type: IconType
  size?: number
  className?: string
}

export function Icon({ type, size = 24, className }: IconProps) {
  const Component = MAP[type]
  return <Component size={size} className={className} />
}
