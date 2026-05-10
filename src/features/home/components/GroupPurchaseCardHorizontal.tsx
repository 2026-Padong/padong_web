import { Image as ImageIcon } from 'lucide-react'

// Figma 1:1: HomePage instance (1697:7386) > GroupPurchaseCardHorizontal
// border-light rounded-lg p-md, H gap-lg items-center
// Thumbnail 180x90 rounded-md
// Right (flex-1 self-stretch): TopRow + BottomRow (V justify-between):
//   TopRow: 가게명 16px Bold + "모집인원" 11px Regular
//   BottomRow: 카테고리 11px Medium text-tertiary + 가격 14px Bold
export interface GroupPurchaseCardHorizontalProps {
  thumbnail?: string
  shopName: string
  category: string
  /** 가격 (원). e.g., 7000 */
  price: number
  participantCurrent?: number
  participantTotal?: number
  onClick?: () => void
}

const fmt = (n: number) => `${n.toLocaleString('ko-KR')}원`

export function GroupPurchaseCardHorizontal({
  thumbnail,
  shopName,
  category,
  price,
  participantCurrent,
  participantTotal,
  onClick,
}: GroupPurchaseCardHorizontalProps) {
  const showParticipants = participantCurrent != null && participantTotal != null
  return (
    <article
      onClick={onClick}
      className="flex w-full cursor-pointer items-center gap-lg rounded-lg border border-border-default p-md"
    >
      <div className="flex h-[110px] w-[180px] shrink-0 items-center justify-center overflow-clip rounded-md bg-[#f0e8e8]">
        {thumbnail ? (
          <img src={thumbnail} alt={shopName} className="h-full w-full object-cover" />
        ) : (
          <ImageIcon size={32} className="text-border-default" />
        )}
      </div>
      <div className="flex h-full flex-1 flex-col items-start justify-between self-stretch">
        <div className="flex w-full items-center justify-between">
          <p className="flex-1 text-subhead font-bold text-text-primary whitespace-nowrap">
            {shopName}
          </p>
          {showParticipants && (
            <p className="flex-1 text-body-s font-normal text-text-primary whitespace-nowrap text-right">
              모집 {participantCurrent}/{participantTotal}
            </p>
          )}
        </div>
        <div className="flex w-full items-start justify-between">
          <p className="flex-1 text-body-s font-medium text-text-tertiary whitespace-nowrap">
            {category}
          </p>
          <p className="flex-1 text-body-l font-bold text-text-primary whitespace-nowrap text-right">
            {fmt(price)}
          </p>
        </div>
      </div>
    </article>
  )
}
