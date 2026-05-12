import type { ReactNode } from 'react'
import { TabBar } from '@/components/ui/TabBar'

// Figma 1:1: Tile · TabSection (838:3116) > TabSection COMPONENT
// V rounded-xl border bg-white, TabBar + body wrapper
export interface TabSectionProps {
  active: string
  tabs: { id: string; label: string }[]
  onChange?: (id: string) => void
  children?: ReactNode
}

export function TabSection({ active, tabs, onChange, children }: TabSectionProps) {
  return (
    <div className="flex flex-col rounded-md border border-border-default bg-neutral-white">
      <TabBar active={active} tabs={tabs} onChange={onChange} />
      <div>{children}</div>
    </div>
  )
}
