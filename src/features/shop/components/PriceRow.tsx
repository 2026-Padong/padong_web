import { PriceTag } from './PriceTag'

// Figma 1:1: Tile · PriceRow (838:3149) > PriceRow COMPONENT
// H justify-between items-center, label + PriceTag
export interface PriceRowProps {
  label: string
  price: number
  originalPrice?: number
}

export function PriceRow({ label, price, originalPrice }: PriceRowProps) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-body-s font-medium text-text-secondary">{label}</span>
      <PriceTag price={price} originalPrice={originalPrice} />
    </div>
  )
}
