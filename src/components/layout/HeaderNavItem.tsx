// Figma 1:1: Tile · HeaderNavItem (918:3134) > HeaderNavItem COMPONENT_SET (Type×State, 12 variants)
// flex flex-col items-center
// Active: gap-[7px], underline 2px text-neutral-white (width per type)
// Default: no gap/underline, text rgba(255,255,255,0.5) Regular 14px
// Active text: 14px Bold text-neutral-white
export type HeaderNavItemType = 'Commute' | 'Custom' | 'LocalShop' | 'News' | 'MyPage' | 'Guide'

const LABEL: Record<HeaderNavItemType, string> = {
  Commute: '출퇴근 동네 찾기',
  Custom: '맞춤 동네 찾기',
  LocalShop: '우리 동네 가게',
  News: '뉴스',
  MyPage: '마이페이지',
  Guide: '가이드',
}

// Underline width per type (Figma 명시값)
const UNDERLINE_W: Record<HeaderNavItemType, string> = {
  Commute: 'w-[97px]',
  Custom: 'w-[84px]',
  LocalShop: 'w-[84px]',
  News: 'w-[26px]',
  MyPage: 'w-[65px]',
  Guide: 'w-[39px]',
}

export interface HeaderNavItemProps {
  type: HeaderNavItemType
  state?: 'default' | 'active'
}

export function HeaderNavItem({ type, state = 'default' }: HeaderNavItemProps) {
  const isActive = state === 'active'
  return (
    <span
      className={isActive ? 'flex flex-col items-center gap-[7px]' : 'flex flex-col items-center'}
    >
      <span
        className={
          isActive
            ? 'text-body-l font-bold text-neutral-white whitespace-nowrap'
            : 'text-body-l font-normal text-white/50 whitespace-nowrap'
        }
      >
        {LABEL[type]}
      </span>
      {isActive && <span className={`h-[2px] bg-neutral-white ${UNDERLINE_W[type]}`} />}
    </span>
  )
}
