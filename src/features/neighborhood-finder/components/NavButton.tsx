// Figma 1:1: Tile · NavButton · Prev/Next (538:1005) > NavButton COMPONENT_SET
// flex gap-xs items-center justify-center px-xl py-3 rounded-lg
// Prev: bg-surface-cool text-text-secondary
// Next: bg-brand-primary text-neutral-white + drop-shadow-[0px_4px_24px_rgba(37,88,232,0.14)] (모던 shadow)
// Arrow ←/→ 20px + label 18px
export interface NavButtonProps {
  type: 'prev' | 'next'
  label?: string
  onClick?: () => void
  disabled?: boolean
}

export function NavButton({ type, label, onClick, disabled }: NavButtonProps) {
  const isNext = type === 'next'
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={
        'inline-flex cursor-pointer items-center justify-center gap-xs rounded-lg px-lg py-2.5 font-bold leading-none whitespace-nowrap transition-all duration-[var(--duration-base)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 active:scale-[0.97] disabled:scale-100 disabled:opacity-50 disabled:cursor-not-allowed ' +
        (isNext
          ? 'bg-brand-primary text-neutral-white drop-shadow-[0px_4px_24px_rgba(37,88,232,0.14)] hover:bg-brand-primary-hover'
          : 'bg-surface-cool text-text-secondary hover:bg-border-default')
      }
    >
      {!isNext && <span className="text-lg">←</span>}
      <span className="text-subhead">{label ?? (isNext ? '다음' : '이전')}</span>
      {isNext && <span className="text-lg">→</span>}
    </button>
  )
}
