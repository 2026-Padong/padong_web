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
// V auto-layout, gap 35, 좌우 패딩 0 (페이지/컬럼 컨테이너가 horizontal 여백 책임)
// Title group (V auto-layout, gap 33): TitleStack (V, gap 11) [Find your 동네 + 파동 32px Bold] + subtitle 16px text-tertiary
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
    <div className="flex items-center justify-center gap-xxs">
      <span className="inline-block h-[14px] w-[15px]">
        <Icon width={15} height={14} aria-hidden />
      </span>
      <p className="text-body-s font-normal whitespace-nowrap text-text-primary">{label}</p>
    </div>
  )
}

export function HomeHero({ onPrimaryCta, onSecondaryCta }: HomeHeroProps) {
  return (
    <section className="flex w-full flex-col items-start gap-2xl">
      {/* Title group — Figma auto-layout: 외곽 V gap-33, 내부 TitleStack V gap-11 */}
      {/* leading은 Figma 박스 높이(32→38, 16→19)를 픽셀로 고정 — Pretendard 렌더 결과를 Figma 레이아웃과 정렬 */}
      <div className="flex flex-col gap-2xl">
        <div className="flex flex-col gap-sm">
          <p className="text-h1 leading-[38px] font-bold text-text-primary whitespace-nowrap">
            Find your 동네
          </p>
          <p className="text-h1 leading-[38px] font-bold text-brand-primary whitespace-nowrap">
            파동
          </p>
        </div>
        <p className="text-subhead leading-[19px] font-normal text-text-tertiary whitespace-nowrap">
          서울에서 오래 머물고 싶은 동네를 찾아드릴게요
        </p>
      </div>

      {/* Banner — Figma 495:237 종횡비, 컬럼 풀폭 채움 (Figma 인스턴스 FILL 동작과 매칭) */}
      <div className="relative flex aspect-[495/237] w-full items-center justify-between overflow-hidden rounded-[10px]">
        {/* Background banner image (Figma: h-[109.7%] top-[-4.22%]) */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[10px]">
          <img
            src={bannerUrl}
            alt=""
            className="absolute left-0 max-w-none"
            style={{ height: '109.7%', top: '-4.22%', width: '100%' }}
          />
        </div>

        {/* Inner content (Figma 356×237) — Title block과 Feature/CTA block 사이 gap 확장 */}
        <div className="relative flex h-full w-[356px] flex-col items-start justify-center gap-2xl px-xl">
          {/* Tag + Title + decorative underline — Tag 아래 여백 확대 (gap-xxs→gap-sm) */}
          <div className="flex w-fit flex-col items-start justify-center gap-sm">
            <HomeHeroTag />
            <p className="text-h2 font-bold text-text-primary leading-tight">
              나에게 맞는 동네,
              <br />
              그리고 출퇴근에{' '}
              <span className="relative inline-block text-brand-primary">
                맞는 동네
                <UnderlineIcon
                  aria-hidden
                  className="absolute -bottom-1 left-0 w-full"
                  preserveAspectRatio="none"
                  height={3}
                />
              </span>
            </p>
          </div>

          {/* Feature row + CTAs */}
          <div className="flex w-full flex-col items-start justify-center gap-md">
            <div className="flex h-[20px] items-center justify-center gap-sm overflow-clip py-md">
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

        {/* Badge (Figma 139×192 + 65×65 image at left-[57px] top-[34.5px]) */}
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
