import {
  Building,
  Building2,
  Bus,
  Car,
  Footprints,
  House,
  Warehouse,
  type LucideIcon,
} from 'lucide-react'

export type KindIconType = 'Bus' | 'Car' | 'Walk' | 'Apart' | 'Opistel' | 'Yeonlip' | 'Dandok'

// 한국 주거 형태(Apart/Opistel/Yeonlip/Dandok)는 lucide에 정확한 매핑 없음.
// 임시 매핑이며, 디자이너 확정 후 SVG 교체 예정.
const MAP: Record<KindIconType, LucideIcon> = {
  Bus,
  Car,
  Walk: Footprints,
  Apart: Building2,
  Opistel: Building,
  Yeonlip: Warehouse,
  Dandok: House,
}

export interface KindIconProps {
  type: KindIconType
  size?: number
  className?: string
}

export function KindIcon({ type, size = 36, className }: KindIconProps) {
  const Component = MAP[type]
  return <Component size={size} className={className} />
}
