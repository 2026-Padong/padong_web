import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/cn'

// Figma 1:1: Tile · Single (430:856) > Single COMPONENT_SET
// h-[27px] w-[68px] flex items-center justify-center py-xxs rounded-xl
// Default: bg-text-tertiary, Selected: bg-brand-primary
// Text: Noto Sans KR Bold 16px text-neutral-white
const singleVariants = cva(
  [
    'inline-flex h-[27px] w-[68px] items-center justify-center rounded-xl py-xxs text-body-l font-bold text-neutral-white whitespace-nowrap',
    'cursor-pointer select-none',
    'transition-[background-color,transform] duration-[var(--duration-fast)] ease-[var(--ease-out)]',
    'active:scale-[0.96]',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary',
  ].join(' '),
  {
    variants: {
      state: {
        default: 'bg-text-tertiary hover:bg-text-secondary',
        selected: 'bg-brand-primary hover:bg-brand-primary-hover',
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
