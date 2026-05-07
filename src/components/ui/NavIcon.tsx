import { BookOpen, Home, Info, ShoppingBag, Store, User, type LucideIcon } from 'lucide-react'

export type NavIconType = 'Store' | 'Home' | 'ShoppingBag' | 'Information' | 'User' | 'Book'

const MAP: Record<NavIconType, LucideIcon> = {
  Store,
  Home,
  ShoppingBag,
  Information: Info,
  User,
  Book: BookOpen,
}

export interface NavIconProps {
  type: NavIconType
  size?: number
  className?: string
}

export function NavIcon({ type, size = 24, className }: NavIconProps) {
  const Component = MAP[type]
  return <Component size={size} className={className} />
}
