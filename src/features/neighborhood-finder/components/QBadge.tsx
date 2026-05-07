// Figma 1:1: Tile · QBadge (1488:4158) > QBadge COMPONENT
// h-[30px] flex items-center justify-center px-md rounded-full bg-brand-primary-tint
// Text: Noto Sans KR Bold 16px text-brand-primary "Q1"
export interface QBadgeProps {
  number: number
}

export function QBadge({ number }: QBadgeProps) {
  return (
    <div className="inline-flex h-[30px] items-center justify-center rounded-full bg-brand-primary-tint px-md">
      <span className="text-subhead font-bold text-brand-primary whitespace-nowrap">Q{number}</span>
    </div>
  )
}
