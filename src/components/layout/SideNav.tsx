import { NavItem, type NavItemType } from './NavItem'
import logoUrl from '@/assets/logo-sidenav.png'

// Figma 1:1: Tile · SideNav (432:847) > SideNav COMPONENT
// h-[900px] w-[112px] flex flex-col gap-xs items-center pt-xs bg-brand-primary
// Logo: w-full h-[70px] rounded-sm IMAGE
// 6 NavItem (NavIcon 6 type, 첫 번째 Active)
const ITEMS: NavItemType[] = ['Commute', 'Custom', 'LocalShop', 'News', 'MyPage', 'Guide']

export interface SideNavProps {
  activeType?: NavItemType
  onNavigate?: (t: NavItemType) => void
}

export function SideNav({ activeType, onNavigate }: SideNavProps) {
  return (
    <nav className="flex h-[900px] w-[112px] flex-col items-center gap-xs bg-brand-primary pt-xs">
      <img src={logoUrl} alt="파동" className="h-[70px] w-full rounded-sm object-cover" />
      {ITEMS.map((t) => (
        <NavItem key={t} type={t} active={t === activeType} onClick={() => onNavigate?.(t)} />
      ))}
    </nav>
  )
}
