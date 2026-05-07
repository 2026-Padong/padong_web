import type { StatCellProps } from '@/components/ui/StatCell'
import { StatCellInline } from './StatCellInline'

// Figma 1:1: Tile · StatCellBox (431:874) > StatCellBordered COMPONENT
// h-[160px] w-[332px] — 2 rows of StatCellInline (절대 위치 기반 — flex-col로 단순화)
export interface StatCellBorderedProps {
  /** 2개 row, 각 row는 2개 StatCell */
  rows: StatCellProps[][]
}

export function StatCellBordered({ rows }: StatCellBorderedProps) {
  return (
    <div className="flex h-[160px] w-[332px] flex-col items-start justify-between whitespace-nowrap">
      {rows.map((row, i) => (
        <StatCellInline key={i} cells={row} />
      ))}
    </div>
  )
}
