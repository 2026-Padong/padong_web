import { NavItem, type NavItemType } from './NavItem'

const ITEMS: NavItemType[] = ['Commute', 'Custom', 'LocalShop', 'News', 'MyPage', 'Guide']

export interface SideNavProps {
  activeType?: NavItemType
  onNavigate?: (t: NavItemType) => void
}

// TODO: src/assets/logo.png 추가 시 <img>로 교체
export function SideNav({ activeType, onNavigate }: SideNavProps) {
  return (
    <nav className="flex h-full w-28 flex-col gap-xs bg-brand-primary pt-xs">
      <div className="flex h-[70px] w-28 items-center justify-center rounded-sm">
        <span className="text-h4 font-black text-neutral-white">파동</span>
      </div>
      {ITEMS.map((t) => (
        <NavItem key={t} type={t} active={t === activeType} onClick={() => onNavigate?.(t)} />
      ))}
    </nav>
  )
}
