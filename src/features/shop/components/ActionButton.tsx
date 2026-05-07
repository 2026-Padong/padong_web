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
        'w-full rounded-md bg-brand-primary py-sm text-subhead font-bold text-neutral-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 ' +
        (className ?? '')
      }
    >
      {children}
    </button>
  )
}
