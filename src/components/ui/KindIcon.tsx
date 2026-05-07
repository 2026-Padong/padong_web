import KindBus from '@/assets/icons/kind-bus.svg?react'
import KindCar from '@/assets/icons/kind-car.svg?react'
import KindWalk from '@/assets/icons/kind-walk.svg?react'
import KindApart from '@/assets/icons/kind-apart.svg?react'
import KindOpistel from '@/assets/icons/kind-opistel.svg?react'
import KindYeonlip from '@/assets/icons/kind-yeonlip.svg?react'
import KindDandok from '@/assets/icons/kind-dandok.svg?react'

// Figma 1:1: Tile · Icons / Kind (430:850) > KindIcon COMPONENT_SET (7 types)
// 36×36 — currentColor 기반 SVG
export type KindIconType = 'Bus' | 'Car' | 'Walk' | 'Apart' | 'Opistel' | 'Yeonlip' | 'Dandok'

const MAP: Record<KindIconType, React.FC<React.SVGProps<SVGSVGElement>>> = {
  Bus: KindBus,
  Car: KindCar,
  Walk: KindWalk,
  Apart: KindApart,
  Opistel: KindOpistel,
  Yeonlip: KindYeonlip,
  Dandok: KindDandok,
}

export interface KindIconProps {
  type: KindIconType
  size?: number
  className?: string
}

export function KindIcon({ type, size = 36, className }: KindIconProps) {
  const Component = MAP[type]
  return <Component width={size} height={size} className={className} aria-hidden />
}
