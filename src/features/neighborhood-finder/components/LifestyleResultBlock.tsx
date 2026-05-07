// Figma 1:1: Tile · LifestyleResult (566:1458) > LifestyleResultBlock COMPONENT
// w-[370px] flex flex-col gap-xs items-start
// Title: Noto Sans KR Bold 18px text-text-secondary "🚀 효율 생활형"
// Subtitle: Noto Sans KR Regular 13px text-text-tertiary "추천 동네 12개"
export interface LifestyleResultBlockProps {
  title: string
  recommendedCount?: number
  subtitle?: string
}

export function LifestyleResultBlock({
  title,
  recommendedCount,
  subtitle,
}: LifestyleResultBlockProps) {
  const subtitleText =
    subtitle ?? (recommendedCount != null ? `추천 동네 ${recommendedCount}개` : '')
  return (
    <div className="flex w-full flex-col items-start gap-xs">
      <p className="w-full text-h4 font-bold text-text-secondary">{title}</p>
      {subtitleText && (
        <p className="w-full text-body font-normal text-text-tertiary">{subtitleText}</p>
      )}
    </div>
  )
}
