import { Link } from 'react-router'
import { NavIcon, type NavIconType } from '@/components/ui/NavIcon'
import { cn } from '@/lib/cn'

// 모바일/태블릿(< lg) 전용 하단 내비게이션
// 56h fixed bottom-0, 5 NavItem 균등 분할
// SideNav의 6개 메뉴 중 Guide만 모바일에서 숨김
export type BottomNavType = 'Commute' | 'Custom' | 'LocalShop' | 'News' | 'MyPage'

const ITEMS: Array<{ type: BottomNavType; icon: NavIconType; label: string; to: string }> = [
  { type: 'Commute', icon: 'Home', label: '출퇴근', to: '/finder/job' },
  { type: 'Custom', icon: 'Store', label: '취향', to: '/finder/preference' },
  { type: 'LocalShop', icon: 'ShoppingBag', label: '가게', to: '/shops' },
  { type: 'News', icon: 'Information', label: '뉴스', to: '/news' },
  { type: 'MyPage', icon: 'User', label: '마이', to: '/my' },
]

export interface BottomNavProps {
  activeType?: BottomNavType
  className?: string
}

export function BottomNav({ activeType, className }: BottomNavProps) {
  return (
    <nav
      className={cn(
        'fixed bottom-0 left-0 right-0 z-40 flex h-[56px] w-full items-stretch border-t border-border-default bg-neutral-white',
        className,
      )}
      aria-label="하단 내비게이션"
    >
      {ITEMS.map((item) => {
        const isActive = item.type === activeType
        return (
          <Link
            key={item.type}
            to={item.to}
            className={cn(
              'flex flex-1 cursor-pointer flex-col items-center justify-center gap-1',
              isActive ? 'text-brand-primary' : 'text-text-tertiary',
            )}
            aria-current={isActive ? 'page' : undefined}
            viewTransition
          >
            <NavIcon type={item.icon} size={24} />
            <span className="text-caption font-medium whitespace-nowrap">{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
