import { cva } from 'class-variance-authority'

const variants = cva('inline-flex flex-col items-start text-body-l', {
  variants: {
    state: {
      default: 'font-normal text-neutral-white/50',
      active: 'font-bold text-neutral-white',
    },
  },
})

export type HeaderNavItemType = 'Commute' | 'Custom' | 'LocalShop' | 'News' | 'MyPage' | 'Guide'

const LABEL: Record<HeaderNavItemType, string> = {
  Commute: '출퇴근 동네 찾기',
  Custom: '맞춤 동네 찾기',
  LocalShop: '우리 동네 가게',
  News: '뉴스',
  MyPage: '마이페이지',
  Guide: '가이드',
}

export interface HeaderNavItemProps {
  type: HeaderNavItemType
  state?: 'default' | 'active'
}

export function HeaderNavItem({ type, state = 'default' }: HeaderNavItemProps) {
  return (
    <span className="inline-flex flex-col items-start gap-1.5">
      <span className={variants({ state })}>{LABEL[type]}</span>
      {state === 'active' && <span className="h-0.5 w-full bg-neutral-white" />}
    </span>
  )
}
