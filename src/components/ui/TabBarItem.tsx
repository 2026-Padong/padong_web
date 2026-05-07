// Figma 1:1: Tile · TabBarItem · Default/Active (659:2016) > TabBarItem COMPONENT_SET
// w-[162px] flex flex-col items-center justify-center py-md
// Active: 14px Bold text-brand-primary
// Default: 14px Bold text-text-tertiary
export interface TabBarItemProps {
  state: 'default' | 'active'
  label: string
  onClick?: () => void
}

export function TabBarItem({ state, label, onClick }: TabBarItemProps) {
  const isActive = state === 'active'
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        isActive
          ? 'flex w-[162px] flex-col items-center justify-center py-md text-body-l font-bold text-brand-primary whitespace-nowrap transition-colors'
          : 'flex w-[162px] flex-col items-center justify-center py-md text-body-l font-bold text-text-tertiary whitespace-nowrap transition-colors'
      }
    >
      {label}
    </button>
  )
}
