import { Link } from 'react-router'
import { NavIcon, type NavIconType } from '@/components/ui/NavIcon'
import { cn } from '@/lib/cn'
import { useAuth } from '@/lib/auth'
import { useLoginGate } from '@/lib/useLoginGate'

// 모바일/태블릿(< lg) 전용 하단 내비게이션
// 56h fixed bottom-0, 5 NavItem 균등 분할
// SideNav의 6개 메뉴 중 Guide만 모바일에서 숨김
export type BottomNavType = 'Commute' | 'Custom' | 'LocalShop' | 'News' | 'MyPage'

const ITEMS: Array<{ type: BottomNavType; icon: NavIconType; label: string; to: string }> = [
  { type: 'Commute', icon: 'Home', label: '출퇴근', to: '/finder/job' },
  { type: 'Custom', icon: 'Store', label: '취향', to: '/finder/preference' },
  { type: 'LocalShop', icon: 'ShoppingBag', label: '가게', to: '/shops' },
  { type: 'News', icon: 'Information', label: '뉴스', to: '/news' },
  { type: 'MyPage', icon: 'User', label: '마이', to: '/mypage' },
]

export interface BottomNavProps {
  activeType?: BottomNavType
  className?: string
}

export function BottomNav({ activeType, className }: BottomNavProps) {
  const { user } = useAuth()
  const { requireLogin, loginDialog } = useLoginGate()

  return (
    <>
      <nav
        className={cn(
          'fixed bottom-0 left-0 right-0 z-40 flex h-[56px] w-full items-stretch border-t border-border-default bg-neutral-white',
          className,
        )}
        aria-label="하단 내비게이션"
      >
        {ITEMS.map((item) => {
          const isActive = item.type === activeType
          const className = cn(
            'flex flex-1 cursor-pointer flex-col items-center justify-center gap-xxs',
            isActive ? 'text-brand-primary' : 'text-text-tertiary',
          )
          const inner = (
            <>
              <NavIcon type={item.icon} size={24} />
              <span className="text-caption font-medium whitespace-nowrap">{item.label}</span>
            </>
          )
          // 비로그인 + 마이페이지 클릭 → 로그인 알림 (라우팅 차단)
          if (!user && item.type === 'MyPage') {
            return (
              <button
                key={item.type}
                type="button"
                onClick={() => requireLogin({ action: '마이페이지 이용' })}
                className={className}
              >
                {inner}
              </button>
            )
          }
          return (
            <Link
              key={item.type}
              to={item.to}
              className={className}
              aria-current={isActive ? 'page' : undefined}
              viewTransition
            >
              {inner}
            </Link>
          )
        })}
      </nav>
      {loginDialog}
    </>
  )
}
