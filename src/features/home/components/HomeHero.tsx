import { HomeHeroCTA } from './HomeHeroCTA'
import { HomeHeroTag } from './HomeHeroTag'

export interface HomeHeroProps {
  title: string
  subtitle?: string
  ctaLabel: string
  onCta?: () => void
  tags?: string[]
  /** 우측 배너 이미지 (Figma: 520x237) */
  bannerImage?: string
}

/**
 * HomePage MainBanner 영역.
 * Figma: 614x411, V pad:0/47/0/47 gap:35
 * 좌측: 텍스트 그룹 (title + subtitle + tags + CTA), 우측 또는 하단: 배너 이미지
 */
export function HomeHero({ title, subtitle, ctaLabel, onCta, tags, bannerImage }: HomeHeroProps) {
  return (
    <section className="flex flex-col gap-2xl px-12">
      <div className="flex flex-col gap-md">
        <h1 className="text-display font-bold text-text-primary">{title}</h1>
        {subtitle && <p className="text-h4 text-text-secondary">{subtitle}</p>}
      </div>
      {tags && tags.length > 0 && (
        <div className="flex gap-xs">
          {tags.map((t) => (
            <HomeHeroTag key={t}>{t}</HomeHeroTag>
          ))}
        </div>
      )}
      <div className="flex items-center justify-between gap-xl">
        <HomeHeroCTA onClick={onCta}>{ctaLabel}</HomeHeroCTA>
        {bannerImage && (
          <img
            src={bannerImage}
            alt=""
            className="h-[237px] w-[520px] flex-shrink-0 rounded-lg object-cover"
          />
        )}
      </div>
    </section>
  )
}
