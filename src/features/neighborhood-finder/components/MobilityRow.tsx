import { MobilityCell, type MobilityCellProps } from './MobilityCell'

// Figma 1:1: Tile · MobilityRow (453:851) > MobilityRow COMPONENT
// w-[332px] flex gap-xs items-start
// 3개 MobilityCell — 대중교통/자가용/도보
export interface MobilityRowProps {
  cells: MobilityCellProps[]
}

export function MobilityRow({ cells }: MobilityRowProps) {
  return (
    <div className="flex w-full items-start gap-xs">
      {cells.map((c) => (
        <MobilityCell key={c.type} {...c} />
      ))}
    </div>
  )
}
