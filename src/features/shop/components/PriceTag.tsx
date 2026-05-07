// Figma 1:1: Tile · PriceTag (598:1641) > PriceTag COMPONENT
// H gap-xs items-center, 현재가 16px Bold + 원가 13px line-through text-tertiary
export interface PriceTagProps {
  price: number
  originalPrice?: number
}

const fmt = (n: number) => `${n.toLocaleString('ko-KR')}원`

export function PriceTag({ price, originalPrice }: PriceTagProps) {
  return (
    <div className="flex items-center gap-xs">
      <span className="text-subhead font-bold text-text-primary">{fmt(price)}</span>
      {originalPrice != null && (
        <span className="text-body font-normal text-text-tertiary line-through">
          {fmt(originalPrice)}
        </span>
      )}
    </div>
  )
}
