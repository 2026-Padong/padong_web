import { useNavigate } from 'react-router'
import { HeaderNavItem, type HeaderNavItemType } from './HeaderNavItem'
import { cn } from '@/lib/cn'
import logoUrl from '@/assets/logo-headernav.png'

// Figma 1:1: Tile · HeaderNav (906:3135) > HeaderNav COMPONENT
// 외곽 풀폭 + 안 콘텐츠 mx-auto max-w-screen-2xl
// Logo container (py-sm) > Logo (h-[42px] w-[43px] IMAGE) + RightContainer
// Nav: flex gap-xl items-start justify-center, 6 HeaderNavItem (md+ 표시, 모바일 hidden)
const NAV: HeaderNavItemType[] = ['Home', 'Commute', 'Custom', 'LocalShop', 'News', 'MyPage', 'Guide']

// 라우트 매핑 — 미구현 항목(News/MyPage/Guide)은 null → 클릭해도 이동 X
const NAV_PATH: Record<HeaderNavItemType, string | null> = {
  Home: '/',
  Commute: '/finder/job',
  Custom: '/finder/preference',
  LocalShop: '/shops',
  News: null,
  MyPage: null,
  Guide: null,
}

export interface HeaderNavProps {
  activeType?: HeaderNavItemType
  /** override 시 internal routing 무시. 미지정 시 NAV_PATH 매핑으로 자동 라우팅 */
  onNavigate?: (t: HeaderNavItemType) => void
  className?: string
}

export function HeaderNav({ activeType, onNavigate, className }: HeaderNavProps) {
  const nav = useNavigate()
  const handleClick = (t: HeaderNavItemType) => {
    if (onNavigate) {
      onNavigate(t)
      return
    }
    const path = NAV_PATH[t]
    if (path) nav(path, { viewTransition: true })
  }

  return (
    <header className={cn('w-full bg-brand-primary', className)}>
      <div className="flex w-full items-center px-4 lg:px-8 xl:px-16 2xl:px-24">
        <div className="flex h-full items-center justify-center py-sm">
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
            {NAV.map((t) => {
              const hasRoute = onNavigate || NAV_PATH[t]
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => handleClick(t)}
                  disabled={!hasRoute}
                  aria-disabled={!hasRoute || undefined}
                  className="group cursor-pointer rounded-sm transition-transform duration-[var(--duration-fast)] ease-[var(--ease-out)] active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <HeaderNavItem type={t} state={t === activeType ? 'active' : 'default'} />
                </button>
              )
            })}
          </nav>
        </div>
      </div>
    </header>
  )
}
