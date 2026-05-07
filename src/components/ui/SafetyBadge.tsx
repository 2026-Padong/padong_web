import { cn } from '@/lib/cn'

export interface SafetyBadgeProps {
  /** 분야명, 예: "생활" */
  category: string
  /** 등급, 예: "A" */
  grade: string
  className?: string
}

export function SafetyBadge({ category, grade, className }: SafetyBadgeProps) {
  return (
    <div
      className={cn(
        'inline-flex flex-col items-center gap-xxs rounded-md bg-surface-subtle px-md py-xs',
        className,
      )}
    >
      <span className="text-body-s font-normal text-text-tertiary">{category}</span>
      <span className="text-h4 font-bold text-brand-primary-soft">{grade}</span>
    </div>
  )
}
