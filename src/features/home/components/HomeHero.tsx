import { HomeHeroCTA } from './HomeHeroCTA'
import { HomeHeroTag } from './HomeHeroTag'
import bannerUrl from '@/assets/home-hero-banner.png'
import badgeUrl from '@/assets/home-hero-badge.png'

// Figma 1:1: Tile · HomeHero (899:3130) > HomeHero COMPONENT
// flex flex-col gap-[35px] items-start px-[47px]
// Top: Title group (Find your 동네 + 파동 32px Bold + subtitle 16px text-tertiary)
// Banner (520x237 rounded-[10px]): bg image + content (HomeHeroTag + 22px Bold mixed text + features + 2 CTAs + 65px badge image)
export interface HomeHeroProps {
  /** Primary CTA 클릭 — 직장으로 추천 받기 */
  onPrimaryCta?: () => void
  /** Secondary CTA 클릭 — 내 취향으로 찾기 */
  onSecondaryCta?: () => void
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
        <img src={bannerUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="relative flex h-full w-[356px] flex-col items-start justify-center gap-lg px-[25px]">
          <div className="flex h-[101px] w-[268px] flex-col items-start justify-center gap-[5px]">
            <HomeHeroTag />
            <p className="text-h3 font-bold text-text-primary leading-tight">
              나에게 맞는 동네,
              <br />
              그리고 출퇴근에 <span className="text-brand-primary">맞는 동네</span>
            </p>
          </div>
          <div className="flex w-[325px] items-center justify-between">
            <HomeHeroCTA type="Primary" onClick={onPrimaryCta} />
            <HomeHeroCTA type="Secondary" onClick={onSecondaryCta} />
          </div>
        </div>
        <div className="relative h-[192px] w-[139px] overflow-clip">
          <img
            src={badgeUrl}
            alt=""
            className="absolute left-[57px] top-[34px] size-[65px] object-cover"
          />
        </div>
      </div>
    </section>
  )
}
