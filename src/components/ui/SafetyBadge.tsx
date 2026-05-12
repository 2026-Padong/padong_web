import { cn } from '@/lib/cn'

// Figma 1:1: Tile · SafetyBadge (430:868) > SafetyBadge COMPONENT
// h-[66px] w-[60px] flex flex-col items-center gap-xxs px-md py-xs rounded-md bg-surface-subtle
// 라벨: Noto Sans KR Regular 11px text-text-tertiary
// 등급: Noto Sans KR Bold 18px text-brand-primary-soft
export interface SafetyBadgeProps {
  category: string
  grade: string
  className?: string
}

export function SafetyBadge({ category, grade, className }: SafetyBadgeProps) {
  return (
    <div
      className={cn(
        'flex h-[66px] w-[60px] flex-col items-center gap-xxs rounded-md bg-surface-subtle px-md py-xs whitespace-nowrap',
        className,
      )}
    >
      <span className="text-body-s font-normal text-text-tertiary">{category}</span>
      <span className="text-h4 font-bold text-brand-primary-soft">{grade}</span>
    </div>
  )
}
