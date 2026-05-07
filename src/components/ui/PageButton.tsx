// Figma 1:1: Tile · PageButton · Default/Active (581:1331) > PageButton COMPONENT_SET
// size-[28px] flex items-center justify-center rounded-sm
// Active: bg-brand-primary, text 14px Bold text-neutral-white
// Default: 투명 bg, text 13px Regular text-text-tertiary
export interface PageButtonProps {
  state: 'default' | 'active'
  page: number | string
  onClick?: () => void
}

export function PageButton({ state, page, onClick }: PageButtonProps) {
  const isActive = state === 'active'
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        isActive
          ? 'flex size-[28px] items-center justify-center rounded-sm bg-brand-primary text-body-l font-bold text-neutral-white whitespace-nowrap transition-colors'
          : 'flex size-[28px] items-center justify-center rounded-sm text-body font-normal text-text-tertiary whitespace-nowrap transition-colors'
      }
    >
      {page}
    </button>
  )
}
