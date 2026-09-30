import { TabBar } from '@/components/ui/TabBar'

// Figma 1:1: Tile · ShopTabBar (1663:4672) > ShopTabBar COMPONENT_SET (Active=Menu/Info)
// 400x154 — TabBar with [메뉴, 정보]
export type ShopTab = 'Menu' | 'Info'

export interface ShopTabBarProps {
  active: ShopTab
  onChange?: (tab: ShopTab) => void
}

export function ShopTabBar({ active, onChange }: ShopTabBarProps) {
  return (
    <TabBar
      active={active}
      tabs={[
        { id: 'Menu', label: '메뉴' },
        { id: 'Info', label: '정보' },
      ]}
      onChange={(id) => onChange?.(id as ShopTab)}
    />
  )
}
