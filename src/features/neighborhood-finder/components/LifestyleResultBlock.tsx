// Figma 1:1: Tile · LifestyleResult (566:1458) > LifestyleResultBlock COMPONENT
// 결과 identity 카드 — emoji + label을 brand tint 배경으로 묶어 위계 강조
// + description (라이프스타일 의미 한 줄) → 사용자가 자기 타입 즉시 이해
// + subtitle (추천 동네 개수)
export interface LifestyleResultBlockProps {
  title: string
  /** 라이프스타일 설명 — 예: "출퇴근 시간 짧고, 일상 편의가 가까운 동네를 선호" */
  description?: string
  recommendedCount?: number
  subtitle?: string
}

export function LifestyleResultBlock({
  title,
  description,
  recommendedCount,
  subtitle,
}: LifestyleResultBlockProps) {
  const subtitleText =
    subtitle ?? (recommendedCount != null ? `추천 동네 ${recommendedCount}개` : '')
  return (
    <div className="flex w-full flex-col items-start gap-xxs">
      <p className="w-full text-h4 font-bold text-text-primary">{title}</p>
      {description && (
        <p className="w-full text-body font-normal text-text-secondary">{description}</p>
      )}
      {subtitleText && (
        <p className="mt-xs w-full text-body font-normal text-text-tertiary">{subtitleText}</p>
      )}
    </div>
  )
}
