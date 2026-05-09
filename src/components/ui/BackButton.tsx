// Figma 1:1: Tile · BackButton (581:1334) > BackButton COMPONENT
// flex gap-0 items-start
// Text: Noto Sans KR Bold 14px text-brand-primary "← 목록"
export interface BackButtonProps {
  onClick?: () => void
  label?: string
}

export function BackButton({ onClick, label = '← 목록' }: BackButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex cursor-pointer items-start rounded-sm text-body-l font-bold text-brand-primary whitespace-nowrap transition-colors duration-[var(--duration-fast)] hover:text-brand-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-1"
    >
      {label}
    </button>
  )
}
