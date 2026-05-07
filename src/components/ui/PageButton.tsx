import { cva } from 'class-variance-authority'

const variants = cva('h-7 w-7 rounded-sm text-body-s font-bold transition-colors', {
  variants: {
    state: {
      default: 'bg-transparent text-text-secondary',
      active: 'bg-brand-primary text-neutral-white',
    },
  },
})

export interface PageButtonProps {
  state: 'default' | 'active'
  page: number
  onClick?: () => void
}

export function PageButton({ state, page, onClick }: PageButtonProps) {
  return (
    <button type="button" onClick={onClick} className={variants({ state })}>
      {page}
    </button>
  )
}
