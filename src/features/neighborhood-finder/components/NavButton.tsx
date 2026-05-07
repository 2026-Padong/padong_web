// Figma 1:1: Tile · NavButton · Prev/Next (538:1005) > NavButton COMPONENT_SET
// flex gap-xs items-center justify-center px-xl py-3 rounded-lg
// Prev: bg-surface-cool text-text-secondary
// Next: bg-brand-primary text-neutral-white + drop-shadow-[0px_8px_9px_rgba(37,88,232,0.32)]
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
        isNext
          ? 'inline-flex items-center justify-center gap-xs rounded-lg bg-brand-primary px-xl py-3 text-neutral-white drop-shadow-[0px_8px_9px_rgba(37,88,232,0.32)] disabled:opacity-50'
          : 'inline-flex items-center justify-center gap-xs rounded-lg bg-surface-cool px-xl py-3 text-text-secondary disabled:opacity-50'
      }
    >
      {!isNext && <span className="text-[20px]">←</span>}
      <span className="text-h4">{label ?? (isNext ? '다음' : '이전')}</span>
      {isNext && <span className="text-[20px]">→</span>}
    </button>
  )
}
