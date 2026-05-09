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
      role="tab"
      aria-selected={isActive}
      className={
        'flex w-[162px] cursor-pointer flex-col items-center justify-center py-md text-body-l font-bold whitespace-nowrap transition-colors duration-[var(--duration-fast)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary ' +
        (isActive ? 'text-brand-primary' : 'text-text-tertiary hover:text-text-secondary')
      }
    >
      {label}
    </button>
  )
}
