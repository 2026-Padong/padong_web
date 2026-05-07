import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/cn'

// Figma 1:1: Tile · Single (430:856) > Single COMPONENT_SET
// h-[27px] w-[68px] flex items-center justify-center py-xxs rounded-xl
// Default: bg-text-tertiary, Selected: bg-brand-primary
// Text: Noto Sans KR Bold 16px text-neutral-white
const singleVariants = cva(
  'inline-flex h-[27px] w-[68px] items-center justify-center rounded-xl py-xxs text-subhead font-bold text-neutral-white whitespace-nowrap transition-colors',
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
