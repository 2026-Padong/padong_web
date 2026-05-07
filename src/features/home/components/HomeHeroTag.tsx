import { MapPin } from 'lucide-react'

// Figma 1:1: Tile · HomeHeroTag (899:3120) > HomeHeroTag COMPONENT
// h-[20px] w-[110px] flex gap-[3px] items-center justify-center rounded-[24px] bg-neutral-white
// Text: 10px Regular text-brand-primary "나에게 딱 맞는 동네 찾기"
// + location pin icon (12.75x12.5)
export interface HomeHeroTagProps {
  /** 라벨 (기본: "나에게 딱 맞는 동네 찾기") */
  children?: string
}

export function HomeHeroTag({ children = '나에게 딱 맞는 동네 찾기' }: HomeHeroTagProps) {
  return (
    <span className="inline-flex h-[20px] items-center justify-center gap-[3px] rounded-[24px] bg-neutral-white px-2 whitespace-nowrap">
      <span className="text-caption font-normal text-brand-primary">{children}</span>
      <MapPin size={11} className="text-brand-primary" />
    </span>
  )
}
