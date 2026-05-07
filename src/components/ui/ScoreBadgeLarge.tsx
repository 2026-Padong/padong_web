import { cn } from '@/lib/cn'

export interface ScoreBadgeLargeProps {
  value: number
  className?: string
}

export function ScoreBadgeLarge({ value, className }: ScoreBadgeLargeProps) {
  return (
    <div
      className={cn(
        'flex h-14 w-14 items-center justify-center rounded-lg bg-brand-primary',
        className,
      )}
    >
      <span className="text-h3 font-bold text-neutral-white">{value}</span>
    </div>
  )
}
