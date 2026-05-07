export interface BackButtonProps {
  onClick?: () => void
  label?: string
}

export function BackButton({ onClick, label = '← 목록' }: BackButtonProps) {
  return (
    <button type="button" onClick={onClick} className="text-body-l font-bold text-brand-primary">
      {label}
    </button>
  )
}
