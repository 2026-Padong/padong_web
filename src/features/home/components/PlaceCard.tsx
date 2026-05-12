import { CategoryBadge, type CategoryType } from '@/components/ui/CategoryBadge'
import { FacilityChip } from '@/components/ui/FacilityChip'
import { Icon, type IconName } from '@/components/ui/Icon'
import { SubwayLineBadge, type SubwayLine } from '@/components/ui/SubwayLineBadge'

// Figma 1:1: Tile · PlaceCard (926:3130) > PlaceCard COMPONENT (926:3122)
// w-[705px] V gap-sm items-start px-md py-md rounded-2xl border bg-white
// Hero (H gap-lg items-center w-full):
//   Photo 240x160 rounded-lg with gradient bg + 일러스트 placeholder
//   InfoColumn (flex-1 self-stretch V justify-between):
//     TopRow (justify-between): CategoryBadge + EventBadge (Sparkles + 이벤트명, brand-primary)
//     TitleBlock (V gap-[2px]): name 18px Bold + address 12px Regular text-tertiary
//     FacilitiesRow (H gap-md pt-1):
//       SubwayItem (gap-xs): FacilityChip(subway) + 역명 + SubwayLineBadge(s)
//       Divider 1px x 14px
//       BusItem: FacilityChip(bus) + "버스 정류장 N개"
//       Divider
//       BikeItem: FacilityChip(bike) + "따릉이 대여소 N개"
// DataGrid (H items-center py-2 w-full): 4 columns + dividers
//   각 column V gap-1 items-center px-md: header(IconSlot 16 + 라벨 11px) + 값 16px Bold + 보조 10px

export interface PlaceSubway {
  station: string
  lines: SubwayLine[]
}

export interface PlaceFacilities {
  subway?: PlaceSubway
  busStops?: number
  bikeStations?: number
}

export interface PlaceDataColumn {
  icon: 'population' | 'age' | 'composition' | 'road'
  label: string
  value: string
  /** 보조 텍스트 (색은 자동: '여유'/'원활' 등 긍정이면 positive 색) */
  hint?: string
  hintTone?: 'positive' | 'neutral'
}

export interface PlaceCardProps {
  image?: string
  /** 이미지 없을 때 그라디언트 색상 (Figma 기본값과 동일) */
  category: CategoryType
  /** 우측 상단 이벤트 배지 (예: "문화재 야간개장") */
  event?: string
  name: string
  address: string
  facilities: PlaceFacilities
  data: PlaceDataColumn[]
  onClick?: () => void
}

const DATA_ICON: Record<PlaceDataColumn['icon'], IconName> = {
  population: 'place-data-population',
  age: 'place-data-age',
  composition: 'place-data-composition',
  road: 'place-data-road',
}

export function PlaceCard({
  image,
  category,
  event,
  name,
  address,
  facilities,
  data,
  onClick,
}: PlaceCardProps) {
  const interactive = Boolean(onClick)
  return (
    <article
      onClick={onClick}
      tabIndex={interactive ? 0 : undefined}
      onKeyDown={
        interactive
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onClick?.()
              }
            }
          : undefined
      }
      className={
        'flex w-full flex-col items-start gap-sm rounded-md border border-border-default bg-neutral-white px-md py-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-1' +
        (interactive ? ' cursor-pointer' : '')
      }
    >
      {/* Hero */}
      <div className="flex w-full items-center gap-lg overflow-clip">
        {/* Photo */}
        <div
          className="relative h-[160px] w-[240px] shrink-0 overflow-clip rounded-lg"
          style={{
            backgroundImage: image
              ? undefined
              : 'linear-gradient(158.95deg, #f5a875 3.66%, #6675c7 76.87%)',
          }}
        >
          {image && (
            <img src={image} alt={name} className="absolute inset-0 h-full w-full object-cover" />
          )}
        </div>

        {/* InfoColumn */}
        <div className="flex h-full flex-1 flex-col items-start justify-between self-stretch overflow-clip">
          {/* TopRow */}
          <div className="flex w-full items-center justify-between">
            <div className="flex items-start">
              <CategoryBadge category={category} />
            </div>
            {event && (
              <span className="inline-flex items-center gap-xxs overflow-clip rounded-full bg-brand-primary-tint pl-xs pr-sm py-xxs">
                <Icon name="place-event-sparkles" size={11} className="text-brand-primary" aria-hidden />
                <span className="text-body-s font-bold text-brand-primary whitespace-nowrap">
                  {event}
                </span>
              </span>
            )}
          </div>

          {/* TitleBlock */}
          <div className="flex w-full flex-col items-start gap-[2px] whitespace-nowrap">
            <p className="text-h4 font-bold text-text-primary">{name}</p>
            <p className="text-caption font-normal text-text-tertiary">{address}</p>
          </div>

          {/* FacilitiesRow */}
          <div className="flex items-center gap-md overflow-clip pt-xxs">
            {facilities.subway && (
              <div className="flex items-center gap-xs">
                <FacilityChip type="subway" />
                <div className="flex items-center gap-xxs">
                  <span className="text-body-s font-medium text-text-secondary whitespace-nowrap">
                    {facilities.subway.station}
                  </span>
                  {facilities.subway.lines.map((line) => (
                    <SubwayLineBadge key={line} line={line} />
                  ))}
                </div>
              </div>
            )}
            {facilities.busStops != null && (
              <>
                <span className="h-[14px] w-px bg-border-default" />
                <div className="flex items-center gap-xs">
                  <FacilityChip type="bus" />
                  <span className="text-body-s font-medium text-text-secondary whitespace-nowrap">
                    버스 정류장 {facilities.busStops}개
                  </span>
                </div>
              </>
            )}
            {facilities.bikeStations != null && (
              <>
                <span className="h-[14px] w-px bg-border-default" />
                <div className="flex items-center gap-xs">
                  <FacilityChip type="bike" />
                  <span className="text-body-s font-medium text-text-secondary whitespace-nowrap">
                    따릉이 대여소 {facilities.bikeStations}개
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* DataGrid */}
      <div className="flex w-full items-center overflow-clip py-xs">
        {data.map((col, i) => (
          <div key={col.label} className="contents">
            {i > 0 && <span className="h-full w-px self-stretch bg-border-default" />}
            <div className="flex flex-1 flex-col items-center gap-xxs overflow-clip px-md">
              <div className="flex items-center gap-xs">
                <Icon name={DATA_ICON[col.icon]} size={16} className="text-text-secondary" aria-hidden />
                <span className="text-body-s font-medium text-text-secondary whitespace-nowrap">
                  {col.label}
                </span>
              </div>
              <p className="text-subhead font-bold text-text-primary whitespace-nowrap">
                {col.value}
              </p>
              {col.hint && (
                <p
                  className={
                    col.hintTone === 'positive'
                      ? 'text-caption font-medium text-status-positive whitespace-nowrap'
                      : 'text-caption font-medium text-text-tertiary whitespace-nowrap'
                  }
                >
                  {col.hint}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </article>
  )
}
