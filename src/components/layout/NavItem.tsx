import { NavIcon, type NavIconType } from '@/components/ui/NavIcon'
import { cn } from '@/lib/cn'

// Figma 1:1: Tile · NavItem (477:949) > NavItem COMPONENT_SET (Type×State)
// w-[112px] flex flex-col gap-xs items-center justify-center p-xs
// Active: bg-[rgba(255,255,255,0.15)] (semi-transparent white)
// Default: bg-transparent (LocalShop default는 icon opacity-60)
// 24x24 NavIcon + 11px Medium text-neutral-white text-center w-[96px]
export type NavItemType = 'Commute' | 'Custom' | 'LocalShop' | 'News' | 'MyPage' | 'Guide'

const TYPE_TO_ICON: Record<NavItemType, NavIconType> = {
  Commute: 'Home',
  Custom: 'Store',
  LocalShop: 'ShoppingBag',
  News: 'Information',
  MyPage: 'User',
  Guide: 'Book',
}

const TYPE_TO_LABEL: Record<NavItemType, string> = {
  Commute: '출퇴근 동네 찾기',
  Custom: '맞춤 동네 찾기',
  LocalShop: '우리 동네 가게',
  News: '뉴스',
  MyPage: '마이페이지',
  Guide: '가이드',
}

export interface NavItemProps {
  type: NavItemType
  active?: boolean
  onClick?: () => void
}

export function NavItem({ type, active = false, onClick }: NavItemProps) {
  const isLocalShopDefault = type === 'LocalShop' && !active
  // NavIcon SVG가 fallback으로 brand-primary를 쓰므로, SideNav(파란 배경)에선 흰색으로 override
  const navIconStyle = {
    '--fill-0': 'white',
    '--stroke-0': 'white',
  } as React.CSSProperties
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex w-[112px] flex-col items-center justify-center gap-xs p-xs transition-colors',
        active && 'bg-white/15',
      )}
    >
      <span style={navIconStyle} className={cn(isLocalShopDefault && 'opacity-60')}>
        <NavIcon type={TYPE_TO_ICON[type]} size={24} />
      </span>
      <span className="w-[96px] text-center text-body-s font-medium text-neutral-white whitespace-nowrap">
        {TYPE_TO_LABEL[type]}
      </span>
    </button>
  )
}
