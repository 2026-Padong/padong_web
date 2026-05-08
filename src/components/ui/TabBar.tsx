import { TabBarItem } from './TabBarItem'

// Figma 1:1: Tile · TabBar (838:3127) > TabBar COMPONENT
// border border-border-default flex items-start overflow-clip w-[332px]
// 2 TabBarItems (active 표시는 텍스트 색상 차이만)
export interface TabBarProps {
  active: string
  tabs: { id: string; label: string }[]
  onChange?: (id: string) => void
  className?: string
}

export function TabBar({ active, tabs, onChange, className }: TabBarProps) {
  return (
    <div
      className={`flex w-full items-start overflow-clip border border-border-default ${className ?? ''}`}
    >
      {tabs.map((t) => (
        <TabBarItem
          key={t.id}
          label={t.label}
          state={t.id === active ? 'active' : 'default'}
          onClick={() => onChange?.(t.id)}
        />
      ))}
    </div>
  )
}
