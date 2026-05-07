export interface ProgressBarProps {
  /** 0~100 */
  value: number
  className?: string
}

export function ProgressBar({ value, className }: ProgressBarProps) {
  const pct = Math.max(0, Math.min(100, value))
  return (
    <div className={`relative h-2 w-full rounded-full bg-brand-primary-tint ${className ?? ''}`}>
      <div
        className="absolute top-0 left-0 h-full rounded-full bg-brand-primary transition-[width]"
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}
