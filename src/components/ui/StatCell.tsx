import { cn } from '@/lib/cn'

// Figma 1:1: Tile · StatCell (430:871) > StatCell COMPONENT
// w-[160px] flex flex-col items-start gap-xxs p-sm rounded-md bg-surface-subtle
// label: Noto Sans KR Medium 11px text-text-tertiary
// value: Noto Sans KR Bold 18px text-text-secondary
export interface StatCellProps {
  label: string
  value: string
  className?: string
}

export function StatCell({ label, value, className }: StatCellProps) {
  return (
    <div
      className={cn(
        'flex w-[160px] flex-col items-start gap-xxs rounded-md bg-surface-subtle p-sm whitespace-nowrap',
        className,
      )}
    >
      <span className="text-body-s font-medium text-text-tertiary">{label}</span>
      <span className="text-h4 font-bold text-text-secondary">{value}</span>
    </div>
  )
}
