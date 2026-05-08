import { HeaderNavItem, type HeaderNavItemType } from './HeaderNavItem'
import { cn } from '@/lib/cn'
import logoUrl from '@/assets/logo-headernav.png'

// Figma 1:1: Tile · HeaderNav (906:3135) > HeaderNav COMPONENT
// 외곽 풀폭 + 안 콘텐츠 mx-auto max-w-screen-2xl
// Logo (100x40 IMAGE) + RightContainer (flex-1 justify-end overflow-clip)
//   > Nav (flex gap-xl items-start justify-center): 6 HeaderNavItem (모바일에선 hidden — Phase 후속에서 햄버거)
const NAV: HeaderNavItemType[] = ['Commute', 'Custom', 'LocalShop', 'News', 'MyPage', 'Guide']

export interface HeaderNavProps {
  activeType?: HeaderNavItemType
  onNavigate?: (t: HeaderNavItemType) => void
  className?: string
}

export function HeaderNav({ activeType, onNavigate, className }: HeaderNavProps) {
  return (
    <header className={cn('w-full bg-brand-primary', className)}>
      <div className="mx-auto flex w-full max-w-screen-2xl items-center px-[40px]">
        <div className="flex items-center justify-center py-[20px]">
          <img src={logoUrl} alt="파동" className="h-[40px] w-[100px] object-cover" />
        </div>
        <div className="flex flex-1 items-center justify-end overflow-clip">
          <nav className="hidden items-start justify-center gap-xl overflow-clip md:flex">
            {NAV.map((t) => (
              <button key={t} type="button" onClick={() => onNavigate?.(t)}>
                <HeaderNavItem type={t} state={t === activeType ? 'active' : 'default'} />
              </button>
            ))}
          </nav>
        </div>
      </div>
    </header>
  )
}
