import { HeaderNavItem, type HeaderNavItemType } from './HeaderNavItem'
import logoUrl from '@/assets/logo-headernav.png'

// Figma 1:1: Tile · HeaderNav (906:3135) > HeaderNav COMPONENT
// w-[1440px] flex items-center px-[40px] bg-brand-primary
// Logo (100x40 IMAGE) + RightContainer (flex-1 justify-end overflow-clip)
//   > Nav (flex gap-[24px] items-start justify-center): 6 HeaderNavItem
const NAV: HeaderNavItemType[] = ['Commute', 'Custom', 'LocalShop', 'News', 'MyPage', 'Guide']

export interface HeaderNavProps {
  activeType?: HeaderNavItemType
  onNavigate?: (t: HeaderNavItemType) => void
}

export function HeaderNav({ activeType, onNavigate }: HeaderNavProps) {
  return (
    <header className="flex w-[1440px] items-center bg-brand-primary px-[40px]">
      <div className="flex items-center justify-center py-[20px]">
        <img src={logoUrl} alt="파동" className="h-[40px] w-[100px] object-cover" />
      </div>
      <div className="flex flex-1 items-center justify-end overflow-clip">
        <nav className="flex items-start justify-center gap-xl overflow-clip">
          {NAV.map((t) => (
            <button key={t} type="button" onClick={() => onNavigate?.(t)}>
              <HeaderNavItem type={t} state={t === activeType ? 'active' : 'default'} />
            </button>
          ))}
        </nav>
      </div>
    </header>
  )
}
