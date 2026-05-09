import type { ButtonHTMLAttributes, ReactNode } from 'react'

// Figma 1:1: Tile · ActionButton (659:2013) > ActionButton COMPONENT
// 324x47 fill brand-primary, radius 8, 16px Bold white, full width
export interface ActionButtonProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'children'
> {
  children: ReactNode
}

export function ActionButton({ children, className, ...rest }: ActionButtonProps) {
  return (
    <button
      type="button"
      {...rest}
      className={
        'w-full cursor-pointer rounded-md bg-brand-primary py-sm text-subhead font-bold text-neutral-white transition-all duration-[var(--duration-base)] hover:bg-brand-primary-hover active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-brand-primary disabled:active:scale-100 ' +
        (className ?? '')
      }
    >
      {children}
    </button>
  )
}
