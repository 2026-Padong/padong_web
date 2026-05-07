// Figma 1:1: extracted from ShopScoreHeader (431:856)
// flex flex-col gap-xxs items-start overflow-clip
// 동: Noto Sans KR Bold 22px text-text-secondary
// 주소: Noto Sans KR Regular 12px text-text-tertiary
export interface DetailAddressProps {
  dong: string
  fullAddress: string
}

export function DetailAddress({ dong, fullAddress }: DetailAddressProps) {
  return (
    <div className="flex flex-col items-start gap-xxs overflow-clip whitespace-nowrap">
      <span className="text-h3 font-bold text-text-secondary">{dong}</span>
      <span className="text-[12px] font-normal text-text-tertiary">{fullAddress}</span>
    </div>
  )
}
