import { NavIcon, type NavIconType } from '@/components/ui/NavIcon'
import { cn } from '@/lib/cn'

export type NavItemType = 'Commute' | 'LocalShop' | 'News' | 'MyPage' | 'Guide' | 'Custom'

const TYPE_TO_ICON: Record<NavItemType, NavIconType> = {
  Commute: 'Home',
  LocalShop: 'ShoppingBag',
  News: 'Information',
  MyPage: 'User',
  Guide: 'Book',
  Custom: 'Store',
}

const TYPE_TO_LABEL: Record<NavItemType, string> = {
  Commute: '출퇴근',
  LocalShop: '동네가게',
  News: '뉴스',
  MyPage: '마이',
  Guide: '가이드',
  Custom: '맞춤',
}

export interface NavItemProps {
  type: NavItemType
  active?: boolean
  onClick?: () => void
}

export function NavItem({ type, active = false, onClick }: NavItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex w-28 flex-col items-center gap-xs px-xs py-xs',
        active ? 'bg-neutral-white' : 'bg-transparent',
      )}
    >
      <NavIcon
        type={TYPE_TO_ICON[type]}
        size={24}
        className={active ? 'text-brand-primary' : 'text-neutral-white'}
      />
      <span
        className={cn(
          'text-caption font-bold',
          active ? 'text-brand-primary' : 'text-neutral-white',
        )}
      >
        {TYPE_TO_LABEL[type]}
      </span>
    </button>
  )
}
