import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/cn'

const multiVariants = cva(
  'inline-flex items-center justify-center gap-xs rounded-full px-xs py-xxs text-subhead font-bold text-neutral-white transition-colors',
  {
    variants: {
      state: {
        default: 'bg-text-tertiary',
        selected: 'bg-brand-primary',
      },
    },
    defaultVariants: { state: 'default' },
  },
)

export interface MultiProps extends VariantProps<typeof multiVariants> {
  className?: string
  onClick?: () => void
}

export function Multi({ state, className, onClick }: MultiProps) {
  return (
    <button type="button" onClick={onClick} className={cn(multiVariants({ state }), className)}>
      다중
    </button>
  )
}
