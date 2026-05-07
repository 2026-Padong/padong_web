import { cn } from '@/lib/cn'

// Figma 1:1: Tile · ScoreBadgeLarge (430:865) > ScoreBadgeLarge COMPONENT
// size-[56px] flex items-center justify-center rounded-lg bg-brand-primary
// Text: Noto Sans KR Bold 22px text-neutral-white
export interface ScoreBadgeLargeProps {
  value: number
  className?: string
}

export function ScoreBadgeLarge({ value, className }: ScoreBadgeLargeProps) {
  return (
    <div
      className={cn(
        'inline-flex size-[56px] items-center justify-center rounded-lg bg-brand-primary',
        className,
      )}
    >
      <span className="text-h3 font-bold text-neutral-white whitespace-nowrap">{value}</span>
    </div>
  )
}
