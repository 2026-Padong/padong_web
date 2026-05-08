import { cn } from '@/lib/cn'

// Figma 1:1: Tile · ScoreBar (430:862) > ScoreBar COMPONENT
// h-[2px] w-[345px] bg-border-default rounded-sm overflow-clip
// Figma 자체는 빈 컨테이너지만, 사용처에서 fill을 위한 value prop 추가
export interface ScoreBarProps {
  /** 0~100 (없으면 빈 바 — Figma 원본은 빈 베이스만) */
  value?: number
  className?: string
}

export function ScoreBar({ value, className }: ScoreBarProps) {
  const pct = value === undefined ? 0 : Math.max(0, Math.min(100, value))
  return (
    <div
      className={cn(
        'relative h-[2px] w-full overflow-clip rounded-sm bg-border-default',
        className,
      )}
    >
      {value !== undefined && (
        <div
          className="absolute top-0 left-0 h-full rounded-sm bg-brand-primary transition-[width]"
          style={{ width: `${pct}%` }}
        />
      )}
    </div>
  )
}
