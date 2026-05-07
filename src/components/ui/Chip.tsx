import { forwardRef, type HTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/cn'

const chipVariants = cva(
  'inline-flex items-center rounded-full px-xs py-xxs text-body-s font-medium',
  {
    variants: {
      state: {
        default: 'bg-surface-subtle text-text-secondary',
        active: 'bg-brand-primary text-neutral-white',
      },
    },
    defaultVariants: { state: 'default' },
  },
)

export interface ChipProps
  extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof chipVariants> {}

export const Chip = forwardRef<HTMLSpanElement, ChipProps>(
  ({ className, state, children, ...props }, ref) => (
    <span ref={ref} className={cn(chipVariants({ state }), className)} {...props}>
      {children}
    </span>
  ),
)
Chip.displayName = 'Chip'
