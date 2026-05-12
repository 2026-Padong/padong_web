import { useState } from 'react'
import { HeaderNav } from '@/components/layout/HeaderNav'
import { NavItem, type NavItemType } from '@/components/layout/NavItem'
import { SideNav } from '@/components/layout/SideNav'

export function LayoutPreview() {
  const [sideActive, setSideActive] = useState<NavItemType>('Commute')
  const [headerActive, setHeaderActive] = useState('Commute')

  return (
    <div className="space-y-2xl p-2xl">
      <header>
        <h1 className="text-h1 font-bold text-text-primary">Layout — Phase 2B</h1>
        <p className="mt-xs text-body text-text-tertiary">
          SideNav, NavItem, HeaderNav, HeaderNavItem — 페이지 레이아웃 영역
        </p>
      </header>

      <section>
        <h2 className="mb-md text-h2 font-bold text-text-primary">SideNav (112 × 900)</h2>
        <p className="mb-sm text-body text-text-tertiary">
          하단 NavItem 클릭 → activeType 변경 (현재: <strong>{sideActive}</strong>)
        </p>
        <div className="flex h-[900px] gap-md">
          <SideNav activeType={sideActive} onNavigate={setSideActive} />
          <div className="flex-1 rounded-md bg-surface-subtle p-md">
            <span className="text-body text-text-tertiary">메인 컨텐츠 영역 (placeholder)</span>
          </div>
        </div>
      </section>

      <section>
        <h2 className="mb-md text-h2 font-bold text-text-primary">NavItem — 상태별</h2>
        <div className="flex h-[180px] gap-md bg-brand-primary p-xs">
          <NavItem type="Commute" />
          <NavItem type="Commute" active />
          <NavItem type="LocalShop" />
          <NavItem type="LocalShop" active />
        </div>
      </section>

      <section>
        <h2 className="mb-md text-h2 font-bold text-text-primary">HeaderNav (1440 × 80)</h2>
        <p className="mb-sm text-body text-text-tertiary">
          현재 active: <strong>{headerActive}</strong>
        </p>
        <div className="overflow-x-auto">
          <div className="w-[1440px]">
            <HeaderNav activeType={headerActive as never} onNavigate={(t) => setHeaderActive(t)} />
          </div>
        </div>
      </section>
    </div>
  )
}
