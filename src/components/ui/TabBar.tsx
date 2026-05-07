import { TabBarItem } from './TabBarItem'

export interface TabBarProps {
  active: string
  tabs: { id: string; label: string }[]
  onChange?: (id: string) => void
}

export function TabBar({ active, tabs, onChange }: TabBarProps) {
  return (
    <div className="flex border-b border-border-default">
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
