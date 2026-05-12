import { Icon } from '@/components/ui/Icon'
import { ShopImageGallery } from '@/features/shop/components/ShopImageGallery'
import type { MockShop } from '@/data/mocks'
import { formatWeekdaysParen, maskToWeekdays } from '@/features/admin/utils/weekdays'
import { cn } from '@/lib/cn'

// "HH:mm:ss" 또는 "HH:mm" → "HH:mm"
const trimSeconds = (t?: string) => (t ? t.slice(0, 5) : '')

function formatHours(open?: string, close?: string, mask?: number) {
  const oc = open && close ? `${trimSeconds(open)} ~ ${trimSeconds(close)}` : ''
  const wk = mask != null ? formatWeekdaysParen(maskToWeekdays(mask)) : ''
  return [oc, wk].filter(Boolean).join(' · ')
}

// 사장 전용 가게 디테일 패널 — ShopDetailPanel (고객용) 과 동일한 시각적 구조를
// 공유하지만 고객 액션(좋아요/수량/참여)을 제거하고 운영 정보(상태 배지)만 노출
export interface AdminShopDetailPanelProps {
  shop: MockShop
  tab: 'Menu' | 'Info'
  onTabChange?: (t: 'Menu' | 'Info') => void
  className?: string
}

export function AdminShopDetailPanel({
  shop,
  tab,
  onTabChange,
  className,
}: AdminShopDetailPanelProps) {
  const fmtPrice = (n: number) => `${n.toLocaleString('ko-KR')}원`

  return (
    <aside
      className={cn(
        'flex w-full flex-col items-center gap-xs bg-neutral-white px-xl md:w-[450px] md:shrink-0',
        // 데스크탑: grid 셀 높이로 캡 (= 우측 컬럼 자연 높이). 메뉴 ul만 내부 스크롤
        'lg:h-full lg:min-h-0 lg:overflow-hidden',
        className,
      )}
    >
      <div className="flex w-full flex-col items-start gap-xxs">
        <h1 className="text-h2 font-bold text-text-primary whitespace-nowrap">{shop.name}</h1>
        <p className="text-body font-normal text-text-tertiary">{shop.category}</p>
      </div>

      <div className="flex w-full max-w-[400px] items-center justify-center">
        <ShopImageGallery images={shop.images} alt={shop.name} />
      </div>

      <div className="flex w-full min-h-0 flex-1 flex-col items-start pt-sm">
        <div className="flex w-full min-h-0 flex-1 flex-col items-start overflow-hidden rounded-md border border-border-default bg-neutral-white pb-md">
          <div className="flex w-full items-start overflow-clip">
            <button
              type="button"
              onClick={() => onTabChange?.('Menu')}
              className={
                'flex flex-1 flex-col items-center pb-sm pt-md text-body-l font-bold whitespace-nowrap ' +
                (tab === 'Menu'
                  ? 'border-b-2 border-brand-primary text-brand-primary'
                  : 'border-b border-border-default text-text-tertiary')
              }
            >
              메뉴
            </button>
            <button
              type="button"
              onClick={() => onTabChange?.('Info')}
              className={
                'flex flex-1 flex-col items-center pb-sm pt-md text-body-l font-bold whitespace-nowrap ' +
                (tab === 'Info'
                  ? 'border-b-2 border-brand-primary text-brand-primary'
                  : 'border-b border-border-default text-text-tertiary')
              }
            >
              가게 정보
            </button>
          </div>

          {tab === 'Info' ? (
            <div className="flex w-full flex-col items-center gap-xxs overflow-clip px-md py-sm">
              <InfoLine icon={<Icon name="shop-detail-clock" size={20} className="text-text-secondary" aria-hidden />}>
                <span className="text-body-l font-medium text-text-primary">영업 중</span>
                {formatHours(shop.openTime, shop.closeTime, shop.weekdayMask) && (
                  <span className="text-body-l font-medium text-text-primary">
                    · {formatHours(shop.openTime, shop.closeTime, shop.weekdayMask)}
                  </span>
                )}
              </InfoLine>
              <InfoLine
                icon={<Icon name="icon-location-square" size={20} aria-hidden />}
              >
                <p className="flex-1 break-keep text-body-l font-medium text-text-primary">
                  {shop.infoRows.find((r) => r.label === '주소')?.value ?? '-'}
                </p>
              </InfoLine>
              <InfoLine icon={<Icon name="shop-detail-phone" size={20} className="text-text-secondary" aria-hidden />}>
                <span className="flex-1 text-body-l font-medium text-text-primary">
                  {shop.infoRows.find((r) => r.label === '전화')?.value ?? '-'}
                </span>
              </InfoLine>
              <InfoLine
                icon={<Icon name="shop-detail-doc" size={20} className="text-text-secondary" aria-hidden />}
                alignStart
              >
                <p className="flex-1 text-body-l font-medium text-text-primary">
                  {shop.description ?? ''}
                </p>
              </InfoLine>
            </div>
          ) : (
            <ul className="flex w-full min-h-0 flex-1 flex-col items-start gap-xxs overflow-y-auto py-sm pl-lg pr-sm">
              {shop.menus.map((m) => (
                <li
                  key={m.name}
                  className="flex w-full items-center gap-md py-xs"
                >
                  <span className="flex-1 text-subhead font-medium text-text-primary">
                    {m.name}
                  </span>
                  <span className="text-body-l font-medium text-text-primary whitespace-nowrap">
                    {fmtPrice(m.price)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </aside>
  )
}

function InfoLine({
  icon,
  children,
  alignStart,
}: {
  icon: React.ReactNode
  children: React.ReactNode
  alignStart?: boolean
}) {
  return (
    <div
      className={
        'flex w-full gap-md overflow-clip px-xxs py-xs ' +
        (alignStart ? 'items-start' : 'items-center')
      }
    >
      <span className="flex shrink-0 items-center justify-center">{icon}</span>
      {children}
    </div>
  )
}
