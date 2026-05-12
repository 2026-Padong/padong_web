import { Link, useNavigate } from 'react-router'
import { NavItem, type NavItemType } from './NavItem'
import { cn } from '@/lib/cn'
import logoUrl from '@/assets/logo-sidenav.png'
import { useAuth } from '@/lib/auth'
import { useLoginGate } from '@/lib/useLoginGate'

// Figma 1:1: Tile · SideNav (432:847) > SideNav COMPONENT
// 112×900 (Figma 의도) — lg+ 표시, 그 미만은 hidden (대신 BottomNav)
// 위/아래 분리: 위쪽 = 사장 전용 (ADMIN role), 아래쪽 = 일반 사용자 메뉴
const USER_ITEMS: NavItemType[] = ['Commute', 'Custom', 'LocalShop', 'News', 'MyPage']
const ADMIN_ITEMS: NavItemType[] = ['AdminShop']

export interface SideNavProps {
  activeType?: NavItemType
  onNavigate?: (t: NavItemType) => void
  className?: string
}

export function SideNav({ activeType, onNavigate, className }: SideNavProps) {
  const { user, logout } = useAuth()
  const nav = useNavigate()
  const { requireLogin, loginDialog } = useLoginGate()
  const isAdmin = user?.role === 'ADMIN'

  const handleLogout = async () => {
    await logout()
    // 현재 페이지에 머무름 — 보호된 라우트 (마이페이지/사장님 등) 는 페이지 가드가 자동 redirect
  }

  // 비로그인 상태에서 보호 라우트 클릭 시 로그인 게이트 — 가드된 경우 true 반환
  const gateGuestNav = (type: NavItemType): (() => void) | undefined => {
    if (user) return undefined // 로그인 상태면 기본 Link 라우팅
    if (type === 'MyPage') {
      return () => {
        requireLogin({ action: '마이페이지 이용' })
      }
    }
    return undefined
  }

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
        <div className="relative mx-auto size-[48px] overflow-hidden">
          <img src={logoUrl} alt="파동" className="absolute inset-0 size-full scale-[2.2]" />
        </div>
      </Link>

      {/* 인증 영역 — 로고 바로 아래 (HeaderNav 와 동일 패턴 + 드롭다운 오른쪽) */}
      <div className="flex w-full justify-center px-xs pb-sm pt-xs">
        {user ? (
          <div className="group relative">
            {/* 트리거 — hover underline animation */}
            <button
              type="button"
              className="relative cursor-pointer pb-xxs text-body-l font-normal whitespace-nowrap text-neutral-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-white"
              aria-haspopup="menu"
              aria-label={`${user.name} 메뉴`}
            >
              {user.name} 님
              <span
                aria-hidden
                className="absolute right-0 bottom-[2px] left-0 h-[2px] origin-left scale-x-0 bg-neutral-white transition-transform duration-[var(--duration-fast)] group-hover:scale-x-100"
              />
            </button>
            {/* 드롭다운 — SideNav 오른쪽으로 펼침 (top-0 left-full + ml) */}
            <div
              role="menu"
              className="invisible absolute left-full top-0 z-10 ml-sm flex w-fit -translate-x-2 flex-col overflow-clip rounded-lg border border-border-default bg-neutral-white opacity-0 shadow-[0px_8px_24px_rgba(45,78,130,0.18)] transition-all duration-[var(--duration-fast)] group-hover:visible group-hover:translate-x-0 group-hover:opacity-100"
            >
              <button
                type="button"
                role="menuitem"
                onClick={() => nav('/mypage', { viewTransition: true })}
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
                    onClick={() => nav('/admin/shops', { viewTransition: true })}
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
                onClick={handleLogout}
                className="block cursor-pointer px-md py-sm text-center whitespace-nowrap text-body-l font-normal text-text-secondary transition-colors hover:bg-surface-subtle hover:text-status-critical"
              >
                로그아웃
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => nav('/login', { viewTransition: true })}
            className="inline-flex w-full cursor-pointer items-center justify-center rounded-full bg-neutral-white px-sm py-xs text-body-s font-bold text-brand-primary transition-colors hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-primary"
          >
            로그인
          </button>
        )}
      </div>

      {/* 사장 전용 (위) — ADMIN role 일 때만 노출 */}
      {isAdmin && (
        <>
          {ADMIN_ITEMS.map((t) => (
            <NavItem
              key={t}
              type={t}
              active={t === activeType}
              onClick={onNavigate ? () => onNavigate(t) : undefined}
            />
          ))}
          {/* 분리선 — 사장 영역 ↔ 일반 사용자 영역 */}
          <div className="mx-auto my-sm h-px w-[60%] bg-neutral-white/20" aria-hidden />
        </>
      )}

      {/* 일반 사용자 메뉴 (아래) — 항상 노출 */}
      {USER_ITEMS.map((t) => (
        <NavItem
          key={t}
          type={t}
          active={t === activeType}
          // onNavigate가 명시될 때만 button 모드 (preview), 기본은 Link 라우팅
          // 비로그인 + 보호 라우트(MyPage) 클릭 시 gateGuestNav 로 로그인 알림 우선
          onClick={onNavigate ? () => onNavigate(t) : gateGuestNav(t)}
        />
      ))}
      {loginDialog}
    </nav>
  )
}
