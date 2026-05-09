import { HomeHeroCTA } from './HomeHeroCTA'
import { HomeHeroTag } from './HomeHeroTag'
import bannerUrl from '@/assets/home-hero-banner.png'
import badgeUrl from '@/assets/home-hero-badge.png'
import UnderlineIcon from '@/assets/icons/home-hero-underline.svg?react'
import FeatureBag from '@/assets/icons/home-hero-feature-bag.svg?react'
import FeatureHouse from '@/assets/icons/home-hero-feature-house.svg?react'
import FeatureBook from '@/assets/icons/home-hero-feature-book.svg?react'
import SeparatorIcon from '@/assets/icons/home-hero-separator.svg?react'

// Figma 1:1: Tile · HomeHero (899:3130) > HomeHero COMPONENT
// flex flex-col gap-[35px] items-start px-[47px]
// Top: Title group (Find your 동네 + 파동 32px Bold + subtitle 16px text-tertiary)
// Banner (520x237 rounded-[10px]): bg image (cropped) + content (Tag + 22px title with underline + 3-feature row + 2 CTAs + 65px badge)
export interface HomeHeroProps {
  /** Primary CTA 클릭 — 직장으로 추천 받기 */
  onPrimaryCta?: () => void
  /** Secondary CTA 클릭 — 내 취향으로 찾기 */
  onSecondaryCta?: () => void
}

interface FeatureItemProps {
  Icon: React.FC<React.SVGProps<SVGSVGElement>>
  label: string
}

function FeatureItem({ Icon, label }: FeatureItemProps) {
  return (
    <div className="flex items-center justify-center gap-[5px]">
      <span className="inline-block h-[14px] w-[15px]">
        <Icon width={15} height={14} aria-hidden />
      </span>
      <p className="text-[10px] font-normal whitespace-nowrap text-[#273142]">{label}</p>
    </div>
  )
}

export function HomeHero({ onPrimaryCta, onSecondaryCta }: HomeHeroProps) {
  return (
    <section className="flex flex-col items-start gap-[35px] px-[47px]">
      {/* Title group */}
      <div className="grid grid-cols-1 grid-rows-1">
        <p className="col-start-1 row-start-1 text-h1 font-bold text-text-primary whitespace-nowrap">
          Find your 동네
        </p>
        <p className="col-start-1 row-start-1 mt-[49px] text-h1 font-bold text-brand-primary whitespace-nowrap">
          파동
        </p>
        <p className="col-start-1 row-start-1 mt-[120px] text-subhead font-normal text-text-tertiary whitespace-nowrap">
          서울에서 오래 머물고 싶은 동네를 찾아드릴게요
        </p>
      </div>

      {/* Banner */}
      <div className="relative flex h-[237px] w-[520px] items-center justify-center gap-[25px] overflow-hidden rounded-[10px]">
        {/* Background banner image (Figma: h-[109.7%] top-[-4.22%]) */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[10px]">
          <img
            src={bannerUrl}
            alt=""
            className="absolute left-0 max-w-none"
            style={{ height: '109.7%', top: '-4.22%', width: '100%' }}
          />
        </div>

        {/* Inner content (356×237) */}
        <div className="relative flex h-full w-[356px] flex-col items-start justify-center gap-lg px-[25px]">
          {/* Tag + Title + decorative underline */}
          <div className="flex h-[101px] w-[268px] flex-col items-start justify-center gap-[5px]">
            <HomeHeroTag />
            <div className="relative h-[76.531px] w-[267.875px]">
              <p className="text-[22px] font-bold text-text-primary leading-tight">
                나에게 맞는 동네,
                <br />
                그리고 출퇴근에 <span className="text-brand-primary">맞는 동네</span>
              </p>
              {/* Decorative underline under "맞는 동네" — Figma ml-[169.94px] mt-[64.74px] w-[90px] h-[3px] */}
              <span
                aria-hidden
                className="absolute h-[3px] w-[90px]"
                style={{ left: '169.94px', top: '64.74px' }}
              >
                <UnderlineIcon width={90} height={3} />
              </span>
            </div>
          </div>

          {/* Feature row + CTAs */}
          <div className="flex w-full flex-col items-start justify-center gap-[15px]">
            <div className="flex h-[20px] items-center justify-center gap-[10px] overflow-clip py-[14px]">
              <FeatureItem Icon={FeatureBag} label="직장 위치 기반 추천" />
              <span className="inline-block h-[36px] w-px">
                <SeparatorIcon width={1} height={36} aria-hidden />
              </span>
              <FeatureItem Icon={FeatureHouse} label="내 취향 맞춤 필터" />
              <span className="inline-block h-[36px] w-px">
                <SeparatorIcon width={1} height={36} aria-hidden />
              </span>
              <FeatureItem Icon={FeatureBook} label="출퇴근 시간 분석" />
            </div>
            <div className="flex w-[325px] items-center justify-between">
              <HomeHeroCTA type="Primary" onClick={onPrimaryCta} />
              <HomeHeroCTA type="Secondary" onClick={onSecondaryCta} />
            </div>
          </div>
        </div>

        {/* Badge image (139×192 box, 65×65 image at left-[57px] top-[34.5px]) */}
        <div className="relative h-[192px] w-[139px] overflow-clip">
          <img
            src={badgeUrl}
            alt=""
            className="absolute left-[57px] top-[34.5px] size-[65px] object-cover"
          />
        </div>
      </div>
    </section>
  )
}
