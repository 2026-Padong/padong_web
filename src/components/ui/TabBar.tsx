import { TabBarItem } from './TabBarItem'

// Figma 1:1: Tile · TabBar (838:3127) > TabBar COMPONENT
// border border-border-default flex items-start overflow-clip w-[332px]
// Phase 9 G3: active 변경 시 underline indicator가 좌→우로 slide (transform translateX)
export interface TabBarProps {
  active: string
  tabs: { id: string; label: string }[]
  onChange?: (id: string) => void
  className?: string
}

export function TabBar({ active, tabs, onChange, className }: TabBarProps) {
  const activeIndex = Math.max(
    0,
    tabs.findIndex((t) => t.id === active),
  )
  const tabCount = tabs.length || 1
  const widthPct = 100 / tabCount

  return (
    <div
      className={`relative flex w-full items-start overflow-clip border border-border-default ${className ?? ''}`}
      role="tablist"
    >
      {tabs.map((t) => (
        <TabBarItem
          key={t.id}
          label={t.label}
          state={t.id === active ? 'active' : 'default'}
          onClick={() => onChange?.(t.id)}
        />
      ))}
      {/* Active underline indicator — slide on active 변경 */}
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-0 h-0.5 bg-brand-primary transition-transform duration-[var(--duration-base)]"
        style={{
          width: `${widthPct}%`,
          transform: `translateX(${activeIndex * 100}%)`,
        }}
      />
    </div>
  )
}
