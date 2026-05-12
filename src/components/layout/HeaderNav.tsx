import { useNavigate } from 'react-router'
import { HeaderNavItem, type HeaderNavItemType } from './HeaderNavItem'
import { cn } from '@/lib/cn'
import logoUrl from '@/assets/logo-headernav.png'
import type { Role } from '@/api/contracts/auth'
import { useLoginGate } from '@/lib/useLoginGate'

// Figma 1:1: Tile · HeaderNav (906:3135) > HeaderNav COMPONENT
// 외곽 풀폭 + 안 콘텐츠 mx-auto max-w-screen-2xl
// Logo container (py-sm) > Logo (h-[42px] w-[43px] IMAGE) + RightContainer
// Nav: flex gap-xl items-start justify-center, 6 HeaderNavItem (md+ 표시, 모바일 hidden)
const NAV: HeaderNavItemType[] = ['Home', 'Commute', 'Custom', 'LocalShop', 'News', 'MyPage']
const ADMIN_NAV: HeaderNavItemType[] = ['AdminShop']

// 라우트 매핑
const NAV_PATH: Record<HeaderNavItemType, string | null> = {
  Home: '/',
  Commute: '/finder/job',
  Custom: '/finder/preference',
  LocalShop: '/shops',
  News: '/news',
  MyPage: '/mypage',
  Guide: null,
  AdminShop: '/admin/shops',
  AdminOrder: '/admin/orders',
}

export interface HeaderNavProps {
  activeType?: HeaderNavItemType
  /** override 시 internal routing 무시. 미지정 시 NAV_PATH 매핑으로 자동 라우팅 */
  onNavigate?: (t: HeaderNavItemType) => void
  /** 로그인 사용자 정보 — 미지정 시 "로그인" 버튼 노출. role 있으면 사장님 메뉴 노출 */
  user?: { name: string; role?: Role }
  /** 로그인 버튼 클릭 (비로그인 상태에서만 사용) */
  onAuthClick?: () => void
  /** 마이페이지 메뉴 클릭 (로그인 상태 드롭다운) */
  onMyPage?: () => void
  /** 사장님 관리 메뉴 클릭 (ADMIN 전용). 미지정 시 internal nav('/admin/shops') */
  onAdminShops?: () => void
  /** 로그아웃 버튼 클릭 콜백 (user 있을 때만 표시) */
  onLogout?: () => void | Promise<void>
  /** 우측 로그인 영역 숨김 (/login, /signup 등에서 사용) */
  hideAuth?: boolean
  className?: string
}

export function HeaderNav({
  activeType,
  onNavigate,
  user,
  onAuthClick,
  onMyPage,
  onAdminShops,
  onLogout,
  hideAuth,
  className,
}: HeaderNavProps) {
  const nav = useNavigate()
  const { requireLogin, loginDialog } = useLoginGate()
  const isAdmin = user?.role === 'ADMIN'
  const handleAdminShops = () => {
    if (onAdminShops) onAdminShops()
    else nav('/admin/shops', { viewTransition: true })
  }
  const handleClick = (t: HeaderNavItemType) => {
    if (onNavigate) {
      onNavigate(t)
      return
    }
    // 비로그인 + 마이페이지 → 로그인 게이트
    if (t === 'MyPage' && !user) {
      requireLogin({ action: '마이페이지 이용' })
      return
    }
    const path = NAV_PATH[t]
    if (path) nav(path, { viewTransition: true })
  }

  return (
    <header className={cn('w-full bg-brand-primary', className)}>
      <div className="flex w-full items-center px-md lg:px-2xl xl:px-16 2xl:px-24">
        <div className="flex h-full items-center justify-center py-sm">
          <button
            type="button"
            onClick={() => nav('/', { viewTransition: true })}
            aria-label="홈으로"
            className="relative size-[48px] cursor-pointer overflow-hidden transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-white"
          >
            <img src={logoUrl} alt="" className="absolute inset-0 size-full scale-[2.2]" />
          </button>
        </div>
        <div className="flex flex-1 items-baseline justify-end gap-3xl">
          <nav
            aria-label="상단 내비게이션"
            className="hidden items-start justify-center gap-xl overflow-clip md:flex"
          >
            {[...NAV, ...(isAdmin ? ADMIN_NAV : [])].map((t) => {
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
          {hideAuth ? null : user ? (
            <div className="group flex shrink-0 justify-end min-w-[110px]">
              <div className="relative">
              {/* 트리거 — hover 시 underline (absolute, layout 영향 X) + dropdown 펼침 */}
              <button
                type="button"
                className="relative cursor-pointer pb-sm text-body-l font-normal whitespace-nowrap text-neutral-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-white"
                aria-haspopup="menu"
                aria-label={`${user.name} 메뉴`}
              >
                {user.name} 님
                <span
                  aria-hidden
                  className="absolute right-0 bottom-[6px] left-0 h-[2px] origin-left scale-x-0 bg-neutral-white transition-transform duration-[var(--duration-fast)] group-hover:scale-x-100"
                />
              </button>
              {/* 드롭다운 메뉴 — 마이페이지 / 로그아웃 */}
              <div
                role="menu"
                className="invisible absolute left-1/2 top-full z-10 flex w-fit -translate-x-1/2 flex-col overflow-clip rounded-lg border border-border-default bg-neutral-white opacity-0 shadow-[0px_8px_24px_rgba(45,78,130,0.18)] transition-all duration-[var(--duration-fast)] group-hover:visible group-hover:opacity-100"
              >
                <button
                  type="button"
                  role="menuitem"
                  onClick={onMyPage}
                  className="block cursor-pointer px-md py-sm text-center whitespace-nowrap text-body-l font-normal text-text-primary transition-colors hover:bg-surface-subtle"
                >
                  마이페이지
                </button>
                {isAdmin && (
                  <>
                    <div className="h-px bg-border-default" aria-hidden />
                    <button
                      type="button"
                      role="menuitem"
                      onClick={handleAdminShops}
                      className="block cursor-pointer px-md py-sm text-center whitespace-nowrap text-body-l font-normal text-text-primary transition-colors hover:bg-surface-subtle"
                    >
                      사장님 관리
                    </button>
                  </>
                )}
                <div className="h-px bg-border-default" aria-hidden />
                <button
                  type="button"
                  role="menuitem"
                  onClick={onLogout}
                  className="block cursor-pointer px-md py-sm text-center whitespace-nowrap text-body-l font-normal text-text-secondary transition-colors hover:bg-surface-subtle hover:text-status-critical"
                >
                  로그아웃
                </button>
              </div>
              </div>
            </div>
          ) : (
            <div className="flex shrink-0 min-w-[110px] justify-end">
              <button
                type="button"
                onClick={onAuthClick}
                className="inline-flex cursor-pointer items-center rounded-full bg-neutral-white px-md py-xxs text-body-l font-bold whitespace-nowrap text-brand-primary transition-colors duration-[var(--duration-fast)] hover:bg-white/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-white"
                aria-label="로그인"
              >
                로그인
              </button>
            </div>
          )}
        </div>
      </div>
      {loginDialog}
    </header>
  )
}
