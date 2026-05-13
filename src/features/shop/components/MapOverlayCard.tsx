import { Image as ImageIcon } from 'lucide-react'
import { Icon } from '@/components/ui/Icon'
import { Img } from '@/components/ui/Img'
import { RecruitmentBadge } from './RecruitmentBadge'
import type { RecruitmentStatus } from '@/api/contracts/shops'

// Figma 1:1: Tile · MapOverlayCard (660:1998) > MapOverlayCard COMPONENT
export interface MapOverlayCardProps {
  image?: string
  name: string
  address: string
  topMenus?: string[]
  /** 모집 상태 — 미지정 시 뱃지 미표시 */
  recruitmentStatus?: RecruitmentStatus
  /** 현재 참여 인원 — total 과 함께 있을 때 표시 */
  participantCurrent?: number
  participantTotal?: number | null
  actionLabel?: string
  onAction?: () => void
}

export function MapOverlayCard({
  image,
  name,
  address,
  topMenus = [],
  recruitmentStatus,
  participantCurrent,
  participantTotal,
  actionLabel = '참여하기',
  onAction,
}: MapOverlayCardProps) {
  const showParticipants =
    participantCurrent != null && participantTotal != null && participantTotal > 0
  return (
    <div className="flex w-full max-w-[400px] flex-col items-start justify-center gap-md rounded-md border border-border-default bg-neutral-white p-md">
      <div className="flex w-full items-center justify-between gap-md">
        <div className="flex h-[117px] w-[120px] shrink-0 items-center justify-center overflow-clip rounded-md border border-border-default p-xs">
          <Img
            src={image}
            alt={name}
            className="h-full w-full rounded-md object-contain"
            fallback={<ImageIcon size={32} className="text-border-default" />}
          />
        </div>
        <div className="flex h-full min-w-0 flex-1 flex-col items-start justify-center gap-sm overflow-clip">
          {/* 헤더 — 가게명 + 모집중 뱃지 */}
          <div className="flex w-full items-center justify-between gap-xs">
            <p className="text-h4 font-bold text-text-primary whitespace-nowrap">{name}</p>
            {recruitmentStatus && <RecruitmentBadge status={recruitmentStatus} />}
          </div>
          {/* 주소 */}
          <div className="flex w-full items-center gap-xxs">
            <Icon name="icon-location" size={11} className="shrink-0 text-text-secondary" aria-hidden />
            <span className="text-body-s font-medium text-text-secondary truncate">
              {address}
            </span>
          </div>
          {/* 현재 인원 */}
          {showParticipants && (
            <p className="text-body-s font-medium text-text-secondary">
              현재 인원{' '}
              <span className="font-bold text-text-primary">
                {participantCurrent} / {participantTotal}명
              </span>
            </p>
          )}
          {/* 메뉴 칩 */}
          {topMenus.length > 0 && (
            <div className="flex w-full items-start justify-start gap-xs">
              {topMenus.slice(0, 3).map((m) => (
                <div
                  key={m}
                  className="flex flex-1 items-center justify-center rounded-xl bg-surface-subtle py-xxs"
                >
                  <span className="text-caption font-normal text-text-secondary truncate px-xxs">
                    {m}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <button
        type="button"
        onClick={onAction}
        className="flex h-[47px] w-full items-center justify-center rounded-md bg-brand-primary text-subhead font-bold text-neutral-white"
      >
        {actionLabel}
      </button>
    </div>
  )
}
