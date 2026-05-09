import { Link } from 'react-router'
import { NavItem, type NavItemType } from './NavItem'
import { cn } from '@/lib/cn'
import logoUrl from '@/assets/logo-sidenav.png'

// Figma 1:1: Tile · SideNav (432:847) > SideNav COMPONENT
// 112×900 (Figma 의도) — lg+ 표시, 그 미만은 hidden (대신 BottomNav)
// Logo: w-full h-[70px] rounded-sm IMAGE
// 6 NavItem (NavIcon 6 type, 첫 번째 Active)
const ITEMS: NavItemType[] = ['Commute', 'Custom', 'LocalShop', 'News', 'MyPage', 'Guide']

export interface SideNavProps {
  activeType?: NavItemType
  onNavigate?: (t: NavItemType) => void
  className?: string
}

export function SideNav({ activeType, onNavigate, className }: SideNavProps) {
  return (
    <nav
      aria-label="주 내비게이션"
      className={cn(
        'hidden w-[112px] shrink-0 flex-col items-stretch bg-brand-primary pt-xs lg:flex lg:min-h-screen',
        className,
      )}
    >
      <Link
        to="/"
        viewTransition
        aria-label="홈으로"
        className="block w-full cursor-pointer rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-primary"
      >
        <img src={logoUrl} alt="파동" className="h-[70px] w-full rounded-sm object-cover" />
      </Link>
      {ITEMS.map((t) => (
        <NavItem
          key={t}
          type={t}
          active={t === activeType}
          // onNavigate가 명시될 때만 button 모드 (preview), 기본은 Link 라우팅
          onClick={onNavigate ? () => onNavigate(t) : undefined}
        />
      ))}
    </nav>
  )
}
