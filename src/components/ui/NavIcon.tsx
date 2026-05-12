import NavStore from '@/assets/icons/navicon-store.svg?react'
import NavHome from '@/assets/icons/navicon-home.svg?react'
import NavShoppingBag from '@/assets/icons/navicon-shopping-bag.svg?react'
import NavInformation from '@/assets/icons/navicon-information.svg?react'
import NavUser from '@/assets/icons/navicon-user.svg?react'
import NavBook from '@/assets/icons/navicon-book.svg?react'

// Figma 1:1: Tile · NavIcon · 메뉴 (490:997) > NavIcon COMPONENT_SET (6 types)
// 24×24 — currentColor 기반 SVG (SideNav에서 text-white 등으로 제어)
export type NavIconType = 'Store' | 'Home' | 'ShoppingBag' | 'Information' | 'User' | 'Book'

const MAP: Record<NavIconType, React.FC<React.SVGProps<SVGSVGElement>>> = {
  Store: NavStore,
  Home: NavHome,
  ShoppingBag: NavShoppingBag,
  Information: NavInformation,
  User: NavUser,
  Book: NavBook,
}

export interface NavIconProps {
  type: NavIconType
  size?: number
  className?: string
}

export function NavIcon({ type, size = 24, className }: NavIconProps) {
  const Component = MAP[type]
  return <Component width={size} height={size} className={className} aria-hidden />
}
