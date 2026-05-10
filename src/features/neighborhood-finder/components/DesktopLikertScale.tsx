import { cn } from '@/lib/cn'

// Figma 1:1: Tile · DesktopLikertScale (1491:4161) > DesktopLikertScale COMPONENT_SET (Selected 1~5/None)
// w-[1112px] bg-[rgba(255,255,255,0.68)] border border-border-default rounded-3xl
// pb-5 pt-md px-12 flex flex-col items-start
// drop-shadow-[0px_4px_24px_rgba(45,78,130,0.04)] (모던 soft shadow)
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
    <div className="flex w-full flex-col items-start rounded-2xl border border-border-default bg-white/68 px-12 pt-sm pb-md drop-shadow-[0px_4px_24px_rgba(45,78,130,0.04)]">
      <div className="relative flex h-16 w-full items-end">
        {/* 트랙 — 5개 item flex-1 분할 시 각 item 중심이 10/30/50/70/90% 위치 → 1번~5번 dot 중심 잇기: left/right 10%
            top: dot 중심(64-26/2=51) - track 두께 절반(1) = 50 */}
        <div className="absolute top-[50px] right-[10%] left-[10%] h-0.5 rounded-full bg-border-default" />
        {([1, 2, 3, 4, 5] as const).map((v) => {
          const isSelected = selected === v
          return (
            <button
              key={v}
              type="button"
              onClick={() => onSelect?.(v)}
              className="group relative flex h-full flex-1 cursor-pointer flex-col items-center justify-end gap-xs rounded-md outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
            >
              <span
                className={cn(
                  'text-subhead leading-none font-bold text-center whitespace-nowrap',
                  isSelected ? 'text-brand-primary' : 'text-text-primary',
                )}
              >
                {v}
              </span>
              <div
                className={cn(
                  'relative size-[26px] shrink-0 rounded-full transition-all',
                  isSelected
                    ? 'bg-brand-primary ring-[5px] ring-brand-primary/20'
                    : 'border-2 border-border-medium bg-neutral-white group-hover:border-brand-primary group-hover:ring-4 group-hover:ring-brand-primary/10',
                )}
              />
            </button>
          )
        })}
      </div>
    </div>
  )
}
