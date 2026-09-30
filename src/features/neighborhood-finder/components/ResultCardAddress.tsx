// Figma 1:1: Tile · ResultCardAddress (431:850) > ResultCardAddress COMPONENT
// flex flex-col gap-xxs items-start
// 동: Noto Sans KR Bold 16px text-text-secondary
// 주소: Noto Sans KR Regular 11px text-text-tertiary
export interface ResultCardAddressProps {
  dong: string
  fullAddress: string
}

export function ResultCardAddress({ dong, fullAddress }: ResultCardAddressProps) {
  return (
    <div className="flex flex-col items-start gap-xxs overflow-clip">
      <span className="text-subhead font-bold text-text-secondary">{dong}</span>
      <span className="text-body-s font-normal text-text-tertiary">{fullAddress}</span>
    </div>
  )
}
