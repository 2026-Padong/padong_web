// Figma 1:1: Tile · ShopHeading (665:1968) > ShopHeading COMPONENT
// 324x50 V py-xs gap-xs, name 28px Bold text-secondary
export interface ShopHeadingProps {
  name: string
}

export function ShopHeading({ name }: ShopHeadingProps) {
  return (
    <div className="flex flex-col gap-xs py-xs">
      <h1 className="text-h2 font-bold text-text-secondary">{name}</h1>
    </div>
  )
}
