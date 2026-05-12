import { InfoRow, type InfoRowProps } from './InfoRow'
import { PriceRow, type PriceRowProps } from './PriceRow'

// Figma 1:1: Tile · DetailInfoTable (838:3138) > DetailInfoTable COMPONENT
// 332x200 V py-md pl-2xl, mixed InfoRow + PriceRow
export type DetailInfoTableRow =
  | (InfoRowProps & { type?: 'info' })
  | (PriceRowProps & { type: 'price' })

export interface DetailInfoTableProps {
  rows: DetailInfoTableRow[]
}

export function DetailInfoTable({ rows }: DetailInfoTableProps) {
  return (
    <div className="flex flex-col gap-xs py-md pl-2xl">
      {rows.map((r, i) =>
        r.type === 'price' ? (
          <PriceRow key={i} label={r.label} price={r.price} originalPrice={r.originalPrice} />
        ) : (
          <InfoRow key={i} label={r.label} value={r.value} icon={r.icon} />
        ),
      )}
    </div>
  )
}
