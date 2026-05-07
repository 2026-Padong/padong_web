import { cn } from '@/lib/cn'

export interface ScoreBarProps {
  /** 0~100 */
  value: number
  className?: string
}

export function ScoreBar({ value, className }: ScoreBarProps) {
  const pct = Math.max(0, Math.min(100, value))
  return (
    <div className={cn('relative h-0.5 w-full rounded-sm bg-border-default', className)}>
      <div
        className="absolute top-0 left-0 h-full rounded-sm bg-brand-primary transition-[width]"
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}
