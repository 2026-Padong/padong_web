import { cn } from '@/lib/cn'

// Figma 1:1: Tile · DesktopLikertScale (1491:4161) > DesktopLikertScale COMPONENT_SET (Selected 1~5/None)
// w-[1112px] bg-[rgba(255,255,255,0.68)] border border-border-default rounded-3xl
// pb-5 pt-md px-12 flex flex-col items-start
// drop-shadow-[0px_10px_13px_rgba(45,78,130,0.1)]
// Scale: h-[80px] flex items-end w-full
//   - Track: absolute h-[2px] bg-border-default left-[101.6px] right-[101.6px] top-[55px] rounded-full
//   - 5 Items: flex-1 flex flex-col gap-2.5 items-center justify-end h-full
//     - Number 18px Bold (selected: brand-primary, default: text-primary)
//     - DotSlot 48x48 (selected: 1.83x scale up via inset-[-41.67%])
export interface DesktopLikertScaleProps {
  selected?: 1 | 2 | 3 | 4 | 5
  onSelect?: (v: 1 | 2 | 3 | 4 | 5) => void
}

export function DesktopLikertScale({ selected, onSelect }: DesktopLikertScaleProps) {
  return (
    <div className="flex w-full flex-col items-start rounded-3xl border border-border-default bg-white/68 px-12 pt-md pb-5 drop-shadow-[0px_10px_13px_rgba(45,78,130,0.1)]">
      <div className="relative flex h-[80px] w-full items-end">
        <div className="absolute top-[55px] right-[101.6px] left-[101.6px] h-[2px] rounded-full bg-border-default" />
        {([1, 2, 3, 4, 5] as const).map((v) => {
          const isSelected = selected === v
          return (
            <button
              key={v}
              type="button"
              onClick={() => onSelect?.(v)}
              className="relative flex h-full flex-1 flex-col items-center justify-end gap-2.5 overflow-clip"
            >
              <span
                className={cn(
                  'text-h4 font-bold text-center whitespace-nowrap',
                  isSelected ? 'text-brand-primary' : 'text-text-primary',
                )}
              >
                {v}
              </span>
              <div
                className={cn(
                  'relative size-[48px] rounded-full transition-all',
                  isSelected
                    ? 'scale-[1.83] bg-brand-primary'
                    : 'border-2 border-border-medium bg-neutral-white',
                )}
              />
            </button>
          )
        })}
      </div>
    </div>
  )
}
