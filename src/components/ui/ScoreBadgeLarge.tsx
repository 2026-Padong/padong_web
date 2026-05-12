import { cn } from '@/lib/cn'

// Figma 1:1: Tile · ScoreBadgeLarge (430:865) > ScoreBadgeLarge COMPONENT
// size-9 (36px) flex items-center justify-center rounded-md bg-brand-primary
// Text: Noto Sans KR Bold 16px text-neutral-white (1~2자리 rank 표시 기준)
export interface ScoreBadgeLargeProps {
  value: number
  className?: string
}

export function ScoreBadgeLarge({ value, className }: ScoreBadgeLargeProps) {
  return (
    <div
      className={cn(
        'inline-flex size-9 items-center justify-center rounded-md bg-brand-primary',
        className,
      )}
    >
      <span className="text-subhead font-bold text-neutral-white whitespace-nowrap">{value}</span>
    </div>
  )
}
