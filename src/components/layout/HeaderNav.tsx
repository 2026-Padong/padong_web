import { HeaderNavItem, type HeaderNavItemType } from './HeaderNavItem'
import { cn } from '@/lib/cn'
import logoUrl from '@/assets/logo-headernav.png'

// Figma 1:1: Tile · HeaderNav (906:3135) > HeaderNav COMPONENT
// 외곽 풀폭 + 안 콘텐츠 mx-auto max-w-screen-2xl
// Logo container (py-[10px]) > Logo (h-[42px] w-[43px] IMAGE) + RightContainer
// Nav: flex gap-xl items-start justify-center, 6 HeaderNavItem (md+ 표시, 모바일 hidden)
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
        <div className="flex h-full items-center justify-center py-[10px]">
          <div
            className="relative h-[42px] w-[43px] overflow-hidden"
            role="img"
            aria-label="파동"
          >
            <img
              src={logoUrl}
              alt=""
              className="absolute h-[238.1%] w-[232.56%] max-w-none"
              style={{ top: '-73.35%', left: '-58.79%' }}
            />
          </div>
        </div>
        <div className="flex flex-1 items-center justify-end overflow-clip">
          <nav
            aria-label="상단 내비게이션"
            className="hidden items-start justify-center gap-xl overflow-clip md:flex"
          >
            {NAV.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => onNavigate?.(t)}
                className="cursor-pointer"
              >
                <HeaderNavItem type={t} state={t === activeType ? 'active' : 'default'} />
              </button>
            ))}
          </nav>
        </div>
      </div>
    </header>
  )
}
