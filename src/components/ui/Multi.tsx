import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/cn'

// Figma 1:1: Tile · Multi (430:859) > Multi COMPONENT_SET
// h-[27px] w-[68px] — Single과 동일 구조, 라벨만 "다중"
const multiVariants = cva(
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
