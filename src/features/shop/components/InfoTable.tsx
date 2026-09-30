import { InfoRow, type InfoRowProps } from './InfoRow'
import { cn } from '@/lib/cn'

// Figma 1:1: Tile · InfoTable (838:3105) > InfoTable COMPONENT
// 332x114 V gap-sm rounded-xl border bg-white p-md pb-sm
export interface InfoTableProps {
  rows: InfoRowProps[]
  className?: string
}

export function InfoTable({ rows, className }: InfoTableProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-sm rounded-md border border-border-default bg-neutral-white p-md pb-sm',
        className,
      )}
    >
      {rows.map((r, i) => (
        <InfoRow key={`${r.label}-${i}`} {...r} />
      ))}
    </div>
  )
}
