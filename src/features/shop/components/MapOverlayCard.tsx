import { MapPin, Image as ImageIcon } from 'lucide-react'

// Figma 1:1: Tile · MapOverlayCard (660:1998) > MapOverlayCard COMPONENT
// w-[400px] V gap-lg items-start justify-center p-md rounded-xl border bg-white
// 상단 H gap-md h-[137px] py-xs justify-between:
//   - 이미지 박스 120x117 rounded-md border p-xs
//   - 우측 V gap-lg flex-1 pl-md pt-md:
//     - 헤더 V h-[38px] justify-between:
//       - 가게명 18px Bold text-primary
//       - 주소: location pin + 11px Medium text-secondary
//     - 메뉴 칩 H gap-xs justify-center: 각 칩 flex-1 bg-surface-subtle px-0 py-xxs rounded-xl, 10px Regular text-secondary
// 하단 CTA: bg-brand-primary h-[47px] rounded-md, "참여하기" 16px Bold white
export interface MapOverlayCardProps {
  image?: string
  name: string
  address: string
  topMenus?: string[]
  actionLabel?: string
  onAction?: () => void
}

export function MapOverlayCard({
  image,
  name,
  address,
  topMenus = [],
  actionLabel = '참여하기',
  onAction,
}: MapOverlayCardProps) {
  return (
    <div className="flex w-full max-w-[400px] flex-col items-start justify-center gap-lg rounded-xl border border-border-default bg-neutral-white p-md">
      <div className="flex h-[137px] w-full items-center justify-between gap-md py-xs">
        <div className="flex h-[117px] w-[120px] shrink-0 items-center justify-center overflow-clip rounded-md border border-border-default p-xs">
          {image ? (
            <img src={image} alt={name} className="h-full w-full rounded-md object-contain" />
          ) : (
            <ImageIcon size={32} className="text-border-default" />
          )}
        </div>
        <div className="flex h-full flex-1 flex-col items-start justify-center gap-lg overflow-clip pl-md pt-md">
          <div className="flex h-[38px] w-full flex-col items-start justify-between">
            <p className="text-h4 font-bold text-text-primary whitespace-nowrap">{name}</p>
            <div className="flex w-full items-center gap-xxs">
              <MapPin size={11} className="shrink-0 text-text-secondary" />
              <span className="text-body-s font-medium text-text-secondary whitespace-nowrap">
                {address}
              </span>
            </div>
          </div>
          {topMenus.length > 0 && (
            <div className="flex w-full items-start justify-center gap-xs">
              {topMenus.slice(0, 3).map((m) => (
                <div
                  key={m}
                  className="flex flex-1 items-center justify-center rounded-xl bg-surface-subtle py-xxs"
                >
                  <span className="text-caption font-normal text-text-secondary whitespace-nowrap">
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
