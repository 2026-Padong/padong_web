// Figma 1:1: Tile · PageButton · Default/Active (581:1331) > PageButton COMPONENT_SET
// size-[28px] flex items-center justify-center rounded-sm
// Active: bg-brand-primary, text 14px Bold text-neutral-white
// Default: 투명 bg, text 13px Regular text-text-tertiary
export interface PageButtonProps {
  state: 'default' | 'active'
  page: number | string
  onClick?: () => void
  disabled?: boolean
  ariaLabel?: string
  ariaCurrent?: 'page'
}

export function PageButton({ state, page, onClick, disabled, ariaLabel, ariaCurrent }: PageButtonProps) {
  const isActive = state === 'active'
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-current={ariaCurrent}
      className={
        'flex size-[28px] cursor-pointer items-center justify-center rounded-sm whitespace-nowrap transition-colors duration-[var(--duration-fast)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent ' +
        (isActive
          ? 'bg-brand-primary text-body-l font-bold text-neutral-white hover:bg-brand-primary-hover'
          : 'text-body font-normal text-text-tertiary hover:bg-surface-subtle hover:text-text-primary')
      }
    >
      {page}
    </button>
  )
}
