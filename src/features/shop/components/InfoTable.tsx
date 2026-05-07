import { InfoRow, type InfoRowProps } from './InfoRow'

// Figma 1:1: Tile · InfoTable (838:3105) > InfoTable COMPONENT
// 332x114 V gap-sm rounded-xl border bg-white p-md pb-sm
export interface InfoTableProps {
  rows: InfoRowProps[]
}

export function InfoTable({ rows }: InfoTableProps) {
  return (
    <div className="flex flex-col gap-sm rounded-xl border border-border-default bg-neutral-white p-md pb-sm">
      {rows.map((r, i) => (
        <InfoRow key={`${r.label}-${i}`} {...r} />
      ))}
    </div>
  )
}
