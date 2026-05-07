import { HeaderNavItem, type HeaderNavItemType } from './HeaderNavItem'

const NAV: HeaderNavItemType[] = ['Commute', 'Custom', 'LocalShop', 'News', 'MyPage', 'Guide']

export interface HeaderNavProps {
  activeType?: HeaderNavItemType
  onNavigate?: (t: HeaderNavItemType) => void
}

// TODO: src/assets/logo-horizontal.png 추가 시 <img>로 교체
export function HeaderNav({ activeType, onNavigate }: HeaderNavProps) {
  return (
    <header className="flex h-20 items-center bg-brand-primary px-10">
      <span className="text-h2 font-black text-neutral-white">파동</span>
      <nav className="ml-auto flex items-center gap-2xl">
        {NAV.map((t) => (
          <button key={t} type="button" onClick={() => onNavigate?.(t)}>
            <HeaderNavItem type={t} state={t === activeType ? 'active' : 'default'} />
          </button>
        ))}
      </nav>
    </header>
  )
}
