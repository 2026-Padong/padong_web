import { Image as ImageIcon } from 'lucide-react'
import { Img } from '@/components/ui/Img'
import { PriceTag } from './PriceTag'

// Figma 1:1: Tile · MenuItem (1663:4668) > MenuItem COMPONENT
// 268x57 H items-center gap-md py-sm
// 좌: 이미지 48x48 rounded-md / 중: 이름 14px Bold + 설명 11px text-tertiary / 우: PriceTag
export interface MenuItemProps {
  image?: string
  name: string
  description?: string
  price: number
  originalPrice?: number
}

export function MenuItem({ image, name, description, price, originalPrice }: MenuItemProps) {
  return (
    <div className="flex items-center gap-md py-sm">
      <Img
        src={image}
        alt={name}
        className="h-12 w-12 shrink-0 rounded-md object-cover"
        fallback={
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-surface-subtle">
            <ImageIcon size={20} className="text-border-default" />
          </div>
        }
      />
      <div className="flex flex-1 flex-col gap-xxs">
        <span className="text-body-l font-bold text-text-primary">{name}</span>
        {description && <span className="text-body-s text-text-tertiary">{description}</span>}
      </div>
      <PriceTag price={price} originalPrice={originalPrice} />
    </div>
  )
}
