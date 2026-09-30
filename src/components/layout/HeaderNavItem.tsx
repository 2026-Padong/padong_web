// Figma 1:1: Tile · HeaderNavItem (918:3134) > HeaderNavItem COMPONENT_SET (Type×State, 12 variants)
// flex flex-col items-center
// Active: gap-xs, underline 2px text-neutral-white (width per type)
// Default: no gap/underline, text rgba(255,255,255,0.5) Regular 14px → group-hover로 밝아짐
// Active text: 14px Bold text-neutral-white
export type HeaderNavItemType =
  | 'Home'
  | 'Commute'
  | 'Custom'
  | 'LocalShop'
  | 'News'
  | 'MyPage'
  | 'Guide'
  | 'AdminShop'
  | 'AdminOrder'

const LABEL: Record<HeaderNavItemType, string> = {
  Home: '홈',
  Commute: '출퇴근 동네 찾기',
  Custom: '맞춤 동네 찾기',
  LocalShop: '우리 동네 가게',
  News: '동네 뉴스',
  MyPage: '마이페이지',
  Guide: '가이드',
  AdminShop: '매장 관리',
  AdminOrder: '주문 관리',
}

// Underline width per type (Figma 명시값 + Home은 한 글자 14px Bold 기준)
const UNDERLINE_W: Record<HeaderNavItemType, string> = {
  Home: 'w-[16px]',
  Commute: 'w-[97px]',
  Custom: 'w-[84px]',
  LocalShop: 'w-[84px]',
  News: 'w-[26px]',
  MyPage: 'w-[65px]',
  Guide: 'w-[39px]',
  AdminShop: 'w-[65px]',
  AdminOrder: 'w-[65px]',
}

export interface HeaderNavItemProps {
  type: HeaderNavItemType
  state?: 'default' | 'active'
}

export function HeaderNavItem({ type, state = 'default' }: HeaderNavItemProps) {
  const isActive = state === 'active'
  return (
    <span
      className={isActive ? 'flex flex-col items-center gap-xs' : 'flex flex-col items-center'}
    >
      <span
        className={
          isActive
            ? 'text-body-l font-bold text-neutral-white whitespace-nowrap'
            : 'text-body-l font-normal text-white/50 whitespace-nowrap transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out)] group-hover:text-white/90'
        }
      >
        {LABEL[type]}
      </span>
      {isActive && <span className={`h-[2px] bg-neutral-white ${UNDERLINE_W[type]}`} />}
    </span>
  )
}
