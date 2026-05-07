import { cn } from '@/lib/cn'

export interface StatCellProps {
  label: string
  value: string
  className?: string
}

export function StatCell({ label, value, className }: StatCellProps) {
  return (
    <div className={cn('flex flex-col gap-xxs rounded-md bg-surface-subtle p-sm', className)}>
      <span className="text-body-s font-medium text-text-tertiary">{label}</span>
      <span className="text-h4 font-bold text-text-secondary">{value}</span>
    </div>
  )
}
