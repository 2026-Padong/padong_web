import { cva } from 'class-variance-authority'

// Figma 1:1: Tile · CategoryBadge (1178:3790) > CategoryBadge COMPONENT_SET
// flex items-center px-sm py-xxs rounded-full
// Text: Noto Sans KR Bold 11px
const variants = cva(
  'inline-flex items-center rounded-full px-sm py-xxs text-body-s font-bold whitespace-nowrap',
  {
    variants: {
      category: {
        관광특구: 'bg-category-tourism-bg text-category-tourism',
        // 고궁·문화유산 = status/warning 재사용 (보존/주의 의미 결합)
        '고궁·문화유산': 'bg-status-warning-bg text-status-warning',
        // 인구밀집 = status/critical 재사용 (위험 신호 의미 결합)
        인구밀집지역: 'bg-status-critical-bg text-status-critical',
        발달상권: 'bg-category-commercial-bg text-category-commercial',
        // 공원 = status/positive 재사용 (긍정 의미 결합)
        공원: 'bg-status-positive-bg text-status-positive',
      },
    },
  },
)

export type CategoryType = '관광특구' | '고궁·문화유산' | '인구밀집지역' | '발달상권' | '공원'

export interface CategoryBadgeProps {
  category: CategoryType
}

export function CategoryBadge({ category }: CategoryBadgeProps) {
  return <span className={variants({ category })}>{category}</span>
}
