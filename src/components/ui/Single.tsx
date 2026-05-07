import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/cn'

const singleVariants = cva(
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

export interface SingleProps extends VariantProps<typeof singleVariants> {
  className?: string
  onClick?: () => void
}

export function Single({ state, className, onClick }: SingleProps) {
  return (
    <button type="button" onClick={onClick} className={cn(singleVariants({ state }), className)}>
      단일
    </button>
  )
}
