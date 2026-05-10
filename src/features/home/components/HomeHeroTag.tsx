import LocationPin from '@/assets/icons/home-hero-tag-pin.svg?react'

// Figma 1:1: Tile · HomeHeroTag (899:3120) > HomeHeroTag COMPONENT
// 살짝 bump: h-[24px] gap-xs px-xs + body-s 11px
// Pin: Figma imgGroup7 SVG — filled pin (#4A6CF7 = brand-primary-light) + 흰색 가운데 원
export interface HomeHeroTagProps {
  /** 라벨 (기본: "나에게 딱 맞는 동네 찾기") */
  children?: string
}

export function HomeHeroTag({ children = '나에게 딱 맞는 동네 찾기' }: HomeHeroTagProps) {
  return (
    <span className="inline-flex h-[24px] items-center justify-center gap-xs rounded-[24px] bg-neutral-white px-xs whitespace-nowrap">
      <span className="text-body-s font-normal text-brand-primary">{children}</span>
      <span
        className="relative inline-flex h-[14px] w-[14px] items-center justify-center overflow-clip"
        aria-hidden
      >
        <LocationPin width={9} height={12.5} />
      </span>
    </span>
  )
}
