import { StatCell, type StatCellProps } from '@/components/ui/StatCell'

// Figma 1:1: Tile · StatCellRaw (431:871) > StatCellInline COMPONENT
// w-[332px] flex gap-xs items-start overflow-clip
// 2 StatCell instances (각 w-[160px])
export interface StatCellInlineProps {
  cells: StatCellProps[]
}

export function StatCellInline({ cells }: StatCellInlineProps) {
  return (
    <div className="flex items-start gap-xs overflow-clip whitespace-nowrap">
      {cells.map((c, i) => (
        <StatCell key={i} {...c} />
      ))}
    </div>
  )
}
