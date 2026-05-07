import { useState } from 'react'
import { Clock, MapPin, Phone, FileText, Minus, Plus } from 'lucide-react'
import type { MockShop } from '@/data/mocks'
import { ShopImageGallery } from './ShopImageGallery'

// Figma 1:1: Tile · ShopDetailPanel (659:2019) > ShopDetailPanel COMPONENT_SET (Tab=Menu/Info)
// 450w 900h V gap-[15px] pt-[25px] pb-[10px] px-[25px] items-center bg-white
// BackButton (h-[19px] w-full): "← 목록" 16px Bold brand-primary
// ShopTitle (V py-xs items-start w-full): 28px Bold
// ShopImageGallery (400x214): image flex-1 rounded-lg + "▧ 1 / 6" overlay
// MenuCardWrap (V py-[10px] w-full):
//   MenuCard (V border bg-white pb-[15px] w-full):
//     ShopTabBar [메뉴, 가게 정보]
//     if Info: InfoList (Clock/Pin/Phone/Doc rows)
//     if Menu: MenuItems (이름 16px Medium + 가격 14px + QuantityStepper rounded-2xl)
// FooterSection (gap-lg py-xxs w-full):
//   ParticipantsRow: "현재 인원 1 / 5명" + "현재 담은 금액 X원"
//   ActionButton "참여하기"
export interface ShopDetailPanelProps {
  shop: MockShop
  tab: 'Menu' | 'Info'
  onTabChange?: (t: 'Menu' | 'Info') => void
  onBack?: () => void
  onJoin?: () => void
}

export function ShopDetailPanel({ shop, tab, onTabChange, onBack, onJoin }: ShopDetailPanelProps) {
  const [quantities, setQuantities] = useState<Record<string, number>>({})
  const totalAmount = shop.menus.reduce((sum, m) => sum + (quantities[m.name] ?? 0) * m.price, 0)
  const fmtPrice = (n: number) => `${n.toLocaleString('ko-KR')}원`

  return (
    <aside className="flex h-[900px] w-[450px] flex-col items-center gap-[15px] bg-neutral-white px-[25px] pb-[10px] pt-[25px]">
      <button
        type="button"
        onClick={onBack}
        className="flex h-[19px] w-full items-start text-subhead font-bold text-brand-primary"
      >
        ← 목록
      </button>

      <div className="flex w-full flex-col items-start py-xs">
        <h1 className="text-h2 font-bold text-text-primary whitespace-nowrap">{shop.name}</h1>
      </div>

      <div className="flex h-[214px] w-[400px] items-center justify-center">
        <ShopImageGallery images={shop.images} alt={shop.name} />
      </div>

      <div className="flex w-full flex-1 flex-col items-start overflow-hidden py-[10px]">
        <div className="flex w-full flex-1 flex-col items-start overflow-hidden rounded-lg border border-border-default bg-neutral-white pb-[15px]">
          {/* ShopTabBar */}
          <div className="flex w-full items-start overflow-clip">
            <button
              type="button"
              onClick={() => onTabChange?.('Menu')}
              className={
                'flex flex-1 flex-col items-center pb-[12px] pt-[16px] text-body-l font-bold whitespace-nowrap ' +
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
                'flex flex-1 flex-col items-center pb-[12px] pt-[16px] text-body-l font-bold whitespace-nowrap ' +
                (tab === 'Info'
                  ? 'border-b-2 border-brand-primary text-brand-primary'
                  : 'border-b border-border-default text-text-tertiary')
              }
            >
              가게 정보
            </button>
          </div>

          {tab === 'Info' ? (
            <div className="flex w-full flex-col items-center gap-[5px] overflow-clip px-[15px] py-[10px]">
              <InfoLine icon={<Clock size={20} className="text-brand-primary" />}>
                <span className="text-body-l font-medium text-text-primary">영업 중</span>
                <span className="text-body-l font-medium text-text-primary">· 22:00까지</span>
              </InfoLine>
              <InfoLine icon={<MapPin size={20} className="text-brand-primary" />}>
                <div className="flex flex-1 flex-col gap-[3px]">
                  {shop.infoRows
                    .find((r) => r.label === '주소')
                    ?.value.split(/\s/)
                    .reduce<string[]>((acc, w) => {
                      if (acc.length === 0) return [w]
                      const last = acc[acc.length - 1]
                      if ((last + ' ' + w).length > 20) acc.push(w)
                      else acc[acc.length - 1] = last + ' ' + w
                      return acc
                    }, [])
                    .map((line, i) => (
                      <p key={i} className="text-body-l font-medium text-text-primary">
                        {line}
                      </p>
                    ))}
                </div>
              </InfoLine>
              <InfoLine icon={<Phone size={20} className="text-brand-primary" />}>
                <span className="flex-1 text-body-l font-medium text-text-primary">
                  {shop.infoRows.find((r) => r.label === '전화')?.value ?? '-'}
                </span>
              </InfoLine>
              <InfoLine icon={<FileText size={20} className="text-brand-primary" />} alignStart>
                <p className="flex-1 text-body-l font-medium text-text-primary">
                  {shop.description ?? ''}
                </p>
              </InfoLine>
            </div>
          ) : (
            <div className="flex w-full flex-1 flex-col items-start gap-xxs overflow-y-auto py-[10px] pl-[20px] pr-[10px]">
              {shop.menus.map((m) => {
                const qty = quantities[m.name] ?? 0
                return (
                  <div key={m.name} className="flex w-full items-center gap-[14px] py-[12px]">
                    <span className="flex-1 text-subhead font-medium text-text-primary">
                      {m.name}
                    </span>
                    <span className="text-body-l font-medium text-text-primary whitespace-nowrap">
                      {fmtPrice(m.price)}
                    </span>
                    <div className="flex items-center justify-center gap-[14px] rounded-2xl border border-border-default px-[14px] py-[8px]">
                      <button
                        type="button"
                        aria-label="감소"
                        onClick={() =>
                          setQuantities((s) => ({ ...s, [m.name]: Math.max(0, qty - 1) }))
                        }
                      >
                        <Minus
                          size={16}
                          className={qty > 0 ? 'text-text-primary' : 'text-text-tertiary'}
                        />
                      </button>
                      <span
                        className={
                          'w-4 text-center text-body-l font-medium ' +
                          (qty > 0 ? 'text-text-primary' : 'text-text-tertiary')
                        }
                      >
                        {qty}
                      </span>
                      <button
                        type="button"
                        aria-label="증가"
                        onClick={() => setQuantities((s) => ({ ...s, [m.name]: qty + 1 }))}
                      >
                        <Plus size={16} className="text-text-primary" />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      <div className="flex w-full flex-col items-center gap-lg py-xxs">
        <div className="flex h-[46px] w-full items-end justify-center overflow-clip">
          <div className="flex items-center justify-center gap-md text-subhead font-bold whitespace-nowrap">
            <p className="text-text-primary">현재 인원</p>
            <p className="text-brand-primary">
              {shop.participantCurrent ?? 1} / {shop.participantTotal ?? 5}명
            </p>
          </div>
          <div className="flex flex-1 flex-col items-end justify-center gap-1 overflow-clip">
            <p className="text-body font-normal text-text-tertiary whitespace-nowrap">
              현재 담은 금액
            </p>
            <p className="text-h3 font-bold text-brand-primary whitespace-nowrap">
              {fmtPrice(totalAmount)}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onJoin}
          className="flex w-full items-center justify-center rounded-md bg-brand-primary py-sm text-subhead font-bold text-neutral-white"
        >
          참여하기
        </button>
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
        'flex w-full gap-[15px] overflow-clip px-[5px] py-[7px] ' +
        (alignStart ? 'items-start' : 'items-center')
      }
    >
      <span className="flex shrink-0 items-center justify-center">{icon}</span>
      {children}
    </div>
  )
}
