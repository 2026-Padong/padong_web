import { cva } from 'class-variance-authority'

// Figma 1:1: Tile · CategoryBadge (1178:3790) > CategoryBadge COMPONENT_SET
// flex items-center px-[10px] py-[4px] rounded-full
// Text: Noto Sans KR Bold 11px
const variants = cva(
  'inline-flex items-center rounded-full px-[10px] py-[4px] text-body-s font-bold whitespace-nowrap',
  {
    variants: {
      category: {
        관광특구: 'bg-[#eff4ff] text-[#3875f5]',
        '고궁·문화유산': 'bg-[#fff2dd] text-[#c67f19]',
        인구밀집지역: 'bg-[#fdeded] text-[#c72e2e]',
        발달상권: 'bg-[#f1edff] text-[#8045d4]',
        공원: 'bg-[#d4f4de] text-[#1b9e5a]',
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
