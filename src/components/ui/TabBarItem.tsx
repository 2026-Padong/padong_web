import { cva } from 'class-variance-authority'

const variants = cva('flex-1 py-md text-body-l font-bold transition-colors', {
  variants: {
    state: {
      default: 'text-text-tertiary',
      active: 'text-brand-primary border-b-2 border-brand-primary',
    },
  },
})

export interface TabBarItemProps {
  state: 'default' | 'active'
  label: string
  onClick?: () => void
}

export function TabBarItem({ state, label, onClick }: TabBarItemProps) {
  return (
    <button type="button" onClick={onClick} className={variants({ state })}>
      {label}
    </button>
  )
}
