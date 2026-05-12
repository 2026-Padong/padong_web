import { Heart } from '@/components/ui/Heart'
import { Icon } from '@/components/ui/Icon'
import { ShopStatusBadge, type ShopStatus } from './ShopStatusBadge'

// Figma 1:1: Tile · ShopCard (1739:4663) > ShopCard COMPONENT
// h-[131px] rounded-xl bg-white, H gap-0 items-center
// ImageArea: 155w h-full rounded-lg
// ContentArea: flex-1 h-full V gap-md px-md py-xxs items-start justify-center
//   HeaderBlock (gap-xs):
//     NameWrap (H gap-xs items-center w-full): name 16px Bold text-primary + Heart 24
//     MenuTagRow: "카페, 디저트" 11px Medium text-tertiary
//   MetaBlock (gap-2):
//     description "대화하기 좋은 베이커리 카페" 11px Medium text-secondary
//     FooterRow (justify-between):
//       CountGroup (gap-1): Users icon 14 + "1/5명" 11px Medium text-secondary
//       RecruitingBadge: bg #dbe5fc, dot + "모집중" 11px text #2457e8
export interface ShopCardProps {
  id: string
  image?: string
  name: string
  category?: string
  description?: string
  participantCurrent?: number
  participantTotal?: number
  status?: ShopStatus | null
  liked: boolean
  onClick?: () => void
  onToggleLike?: () => void
}

export function ShopCard({
  image,
  name,
  category = '카페, 디저트',
  description,
  participantCurrent,
  participantTotal,
  status = 'recruiting',
  liked,
  onClick,
  onToggleLike,
}: ShopCardProps) {
  return (
    <article
      onClick={onClick}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick?.()
        }
      }}
      className="flex h-[131px] w-full cursor-pointer items-center overflow-hidden rounded-md bg-neutral-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-1"
    >
      {/* ImageArea */}
      <div className="relative h-full w-[155px] shrink-0 rounded-lg bg-surface-subtle">
        {image && (
          <img
            src={image}
            alt={name}
            className="absolute inset-0 h-full w-full rounded-lg object-cover"
          />
        )}
      </div>

      {/* ContentArea */}
      <div className="flex h-full flex-1 flex-col items-start justify-center gap-md overflow-clip px-md py-xxs">
        {/* HeaderBlock */}
        <div className="flex w-full flex-col items-start gap-xs">
          <div className="flex w-full items-center gap-xs">
            <p className="flex-1 text-subhead font-bold text-text-primary">{name}</p>
            <Heart
              active={liked}
              onClick={(e) => {
                e.stopPropagation()
                onToggleLike?.()
              }}
            />
          </div>
          <p className="w-full text-body-s font-medium text-text-tertiary">{category}</p>
        </div>

        {/* MetaBlock */}
        <div className="flex w-full flex-col items-start justify-center gap-xs">
          {description && (
            <p className="w-full text-body-s font-medium text-text-secondary">{description}</p>
          )}
          <div className="flex w-full items-center justify-between">
            {participantCurrent != null && participantTotal != null ? (
              <div className="flex items-center gap-xxs">
                <Icon name="people" size={14} className="text-text-secondary" aria-hidden />
                <span className="text-body-s font-medium text-text-secondary">
                  {participantCurrent}/{participantTotal}명
                </span>
              </div>
            ) : (
              <span aria-hidden /> /* justify-between 유지용 spacer */
            )}
            {status && <ShopStatusBadge status={status} />}
          </div>
        </div>
      </div>
    </article>
  )
}

