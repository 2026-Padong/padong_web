import { Link } from 'react-router'
import { cn } from '@/lib/cn'
import IconCommute from '@/assets/icons/navitem-commute.svg?react'
import IconCustom from '@/assets/icons/navitem-custom.svg?react'
import IconLocalShop from '@/assets/icons/navitem-localshop.svg?react'
import IconNews from '@/assets/icons/navitem-news.svg?react'
import IconMyPage from '@/assets/icons/navitem-mypage.svg?react'
import IconGuide from '@/assets/icons/navitem-guide.svg?react'
import IconAdminShop from '@/assets/icons/icon-store.svg?react'

// Figma 1:1: Tile · NavItem (477:949) > NavItem · 6×2 COMPONENT_SET
// Type 6종 × State 2종 — 각 variant별 SideNav 색상이 미리 적용된 SVG asset 사용
export type NavItemType =
  | 'Commute'
  | 'Custom'
  | 'LocalShop'
  | 'News'
  | 'MyPage'
  | 'Guide'
  | 'AdminShop'

type IconComponent = React.FC<React.SVGProps<SVGSVGElement>>
interface IconSpec {
  icon: IconComponent
  /** Figma 24×24 frame 내 아이콘 native 사이즈 + offset (1:1 fidelity) */
  width: number
  height: number
  left: number
  top: number
}

// Figma native size × 1.2 (center-aligned in 24×24 wrapper)
const TYPE_TO_ICON: Record<NavItemType, IconSpec> = {
  Commute: { icon: IconCommute, width: 19.2, height: 22.8, left: 2.4, top: 0.6 },
  Custom: { icon: IconCustom, width: 24, height: 21.6, left: 0, top: 1.2 },
  LocalShop: { icon: IconLocalShop, width: 28.8, height: 28.8, left: -2.4, top: -2.4 },
  News: { icon: IconNews, width: 21.6, height: 21.6, left: 1.2, top: 1.2 },
  MyPage: { icon: IconMyPage, width: 21.6, height: 24, left: 1.2, top: 0 },
  Guide: { icon: IconGuide, width: 21.6, height: 21.6, left: 1.2, top: 1.2 },
  AdminShop: { icon: IconAdminShop, width: 24, height: 24, left: 0, top: 0 },
}

const TYPE_TO_LABEL: Record<NavItemType, string> = {
  Commute: '출퇴근 동네 찾기',
  Custom: '맞춤 동네 찾기',
  LocalShop: '우리 동네 가게',
  News: '뉴스',
  MyPage: '마이페이지',
  Guide: '가이드',
  AdminShop: '내 가게 관리',
}

const NAV_ITEM_PATH: Record<NavItemType, string> = {
  Commute: '/finder/job',
  Custom: '/finder/preference',
  LocalShop: '/shops',
  News: '/news',
  MyPage: '/mypage',
  Guide: '/guide',
  AdminShop: '/admin/shops',
}

export interface NavItemProps {
  type: NavItemType
  active?: boolean
  /** 라우팅 대신 클릭 핸들러 우선 (preview 등) */
  onClick?: () => void
}

export function NavItem({ type, active = false, onClick }: NavItemProps) {
  const spec = TYPE_TO_ICON[type]
  const Icon = spec.icon
  const { width, height, left, top } = spec
  const className = cn(
    'flex w-full cursor-pointer flex-col items-center justify-center gap-xs px-xs py-sm transition-all duration-[var(--duration-fast)]',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-primary',
    active ? 'bg-neutral-white/15' : 'opacity-60 hover:opacity-100 hover:bg-neutral-white/10',
  )
  const inner = (
    <>
      <span
        className="relative inline-block size-[24px]"
        // icon-store.svg는 stroke 기반(--stroke-0 fallback이 brand color)이라 brand 배경에서 흐려짐 → white로 강제
        style={{ ['--stroke-0' as string]: 'white' } as React.CSSProperties}
      >
        <Icon
          width={width}
          height={height}
          aria-hidden
          className="absolute"
          style={{ left, top }}
        />
      </span>
      <span className="w-[96px] text-center text-body-s font-medium text-neutral-white whitespace-nowrap">
        {TYPE_TO_LABEL[type]}
      </span>
    </>
  )

  // onClick이 명시되면 button (preview/custom 흐름)
  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={className}>
        {inner}
      </button>
    )
  }
  // 기본: 라우팅 Link
  return (
    <Link
      to={NAV_ITEM_PATH[type]}
      className={className}
      aria-current={active ? 'page' : undefined}
      viewTransition
    >
      {inner}
    </Link>
  )
}
