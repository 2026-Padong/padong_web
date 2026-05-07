import { cn } from '@/lib/cn'

// Figma 1:1: Tile · RadioOption (538:999) > RadioOption COMPONENT_SET (Default/Selected)
// bg-brand-primary-tint flex flex-col gap-xs items-center px-md py-xs rounded-md
// Number: Noto Sans KR Bold 22px text-text-secondary
// RadioCircle: 25x25 (Figma raster — CSS circle로 대체)
export interface RadioOptionProps {
  state?: 'default' | 'selected'
  number: number
  onClick?: () => void
}

export function RadioOption({ state = 'default', number, onClick }: RadioOptionProps) {
  const isSelected = state === 'selected'
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-col items-center gap-xs rounded-md bg-brand-primary-tint px-md py-xs"
    >
      <span className="text-h3 font-bold text-text-secondary text-center whitespace-nowrap">
        {number}
      </span>
      <span
        className={cn(
          'flex size-[25px] items-center justify-center rounded-full border-2 transition-colors',
          isSelected
            ? 'border-brand-primary bg-brand-primary'
            : 'border-border-medium bg-neutral-white',
        )}
      >
        {isSelected && <span className="size-[11px] rounded-full bg-neutral-white" />}
      </span>
    </button>
  )
}
