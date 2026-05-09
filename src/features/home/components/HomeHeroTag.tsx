import LocationPin from '@/assets/icons/home-hero-tag-pin.svg?react'

// Figma 1:1: Tile · HomeHeroTag (899:3120) > HomeHeroTag COMPONENT
// h-[20px] flex gap-[3px] items-center justify-center px-[5px] rounded-[24px] bg-neutral-white (content-driven width)
// Text: 10px Regular text-brand-primary "나에게 딱 맞는 동네 찾기"
// Pin: Figma imgGroup7 SVG — filled pin (#4A6CF7 = brand-primary-light) + 흰색 가운데 원, 컨테이너 12.75×12.5 / 내부 8×11.4286
export interface HomeHeroTagProps {
  /** 라벨 (기본: "나에게 딱 맞는 동네 찾기") */
  children?: string
}

export function HomeHeroTag({ children = '나에게 딱 맞는 동네 찾기' }: HomeHeroTagProps) {
  return (
    <span className="inline-flex h-[20px] items-center justify-center gap-[3px] rounded-[24px] bg-neutral-white px-[5px] whitespace-nowrap">
      <span className="text-caption font-normal text-brand-primary">{children}</span>
      <span
        className="relative inline-flex h-[12.5px] w-[12.75px] items-center justify-center overflow-clip"
        aria-hidden
      >
        <LocationPin width={8} height={11.4286} />
      </span>
    </span>
  )
}
