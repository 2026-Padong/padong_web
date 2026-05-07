// Figma 1:1: Tile · ProgressBar (1488:4161) > ProgressBar COMPONENT
// h-[8px] flex items-start overflow-clip rounded-full bg-brand-primary-tint
// Fill: h-full rounded-full bg-brand-primary (width 동적)
// 원본은 w-[1208px] 고정이지만 실용성 위해 w-full + value prop으로 제어
export interface ProgressBarProps {
  /** 0~100 */
  value: number
  className?: string
}

export function ProgressBar({ value, className }: ProgressBarProps) {
  const pct = Math.max(0, Math.min(100, value))
  return (
    <div
      className={`flex h-[8px] w-full items-start overflow-clip rounded-full bg-brand-primary-tint ${className ?? ''}`}
    >
      <div
        className="h-full rounded-full bg-brand-primary transition-[width]"
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}
