import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useQueryClient } from '@tanstack/react-query'
import { Heart } from '@/components/ui/Heart'
import { Icon } from '@/components/ui/Icon'
import { useLoginGate } from '@/lib/useLoginGate'
import { toggleStoreLike } from '@/api/stores'
import { saveCart } from '@/lib/cart'
import type { MockShop } from '@/data/mocks'
import { ShopImageGallery } from './ShopImageGallery'
import { ShopStatusBadge } from './ShopStatusBadge'
import { formatWeekdaysParen, maskToWeekdays } from '@/features/admin/utils/weekdays'
import { cn } from '@/lib/cn'

const trimSeconds = (t?: string) => (t ? t.slice(0, 5) : '')
function formatHours(open?: string, close?: string, mask?: number) {
  const oc = open && close ? `${trimSeconds(open)} ~ ${trimSeconds(close)}` : ''
  const wk = mask != null ? formatWeekdaysParen(maskToWeekdays(mask)) : ''
  return [oc, wk].filter(Boolean).join(' · ')
}

// Figma 1:1: Tile · ShopDetailPanel (659:2019) > ShopDetailPanel COMPONENT_SET (Tab=Menu/Info)
// 450w 900h V gap-md pt-xl pb-sm px-xl items-center bg-white
// BackButton (h-[19px] w-full): "← 목록" 16px Bold brand-primary
// ShopTitle (V py-xs items-start w-full): 28px Bold
// ShopImageGallery (400x214): image flex-1 rounded-lg + "▧ 1 / 6" overlay
// MenuCardWrap (V py-sm w-full):
//   MenuCard (V border bg-white pb-md w-full):
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
  className?: string
}

export function ShopDetailPanel({
  shop,
  tab,
  onTabChange,
  onBack,
  onJoin,
  className,
}: ShopDetailPanelProps) {
  const [quantities, setQuantities] = useState<Record<string, number>>({})
  const totalAmount = shop.menus.reduce((sum, m) => sum + (quantities[m.name] ?? 0) * m.price, 0)
  const fmtPrice = (n: number) => `${n.toLocaleString('ko-KR')}원`
  const isMenuTab = tab === 'Menu'
  const [liked, setLiked] = useState(shop.liked)
  const nav = useNavigate()
  const { requireLogin, loginDialog } = useLoginGate()
  const qc = useQueryClient()

  const handleToggleLike = async () => {
    if (!requireLogin({ action: '좋아요' })) return
    const prev = liked
    setLiked(!prev) // 낙관적 업데이트
    try {
      const result = await toggleStoreLike(Number(shop.id))
      setLiked(result.liked)
      // 가게 좋아요 관련 쿼리 (목록/내가찜한가게) 갱신 — MyLikedStores 패턴과 통일
      qc.invalidateQueries({ queryKey: ['stores'] })
      qc.invalidateQueries({ queryKey: ['likes', 'stores'] })
    } catch (e) {
      console.error('[store:like-toggle] failed:', e)
      setLiked(prev) // 실패 시 롤백
    }
  }

  // 참여하기 — 카트 sessionStorage 저장 + checkout 페이지로 이동
  const handleJoin = () => {
    if (!requireLogin({ action: '참여' })) return
    const items = shop.menus
      .map((m) => ({
        menuId: m.id ?? 0,
        name: m.name,
        price: m.price,
        quantity: quantities[m.name] ?? 0,
      }))
      .filter((it) => it.quantity > 0)
    if (items.length === 0) return // 빈 카트는 진행 X
    saveCart(Number(shop.id), {
      shopId: Number(shop.id),
      shopName: shop.name,
      items,
      totalAmount,
    })
    onJoin?.()
    nav(`/shops/${shop.id}/checkout`, { viewTransition: true })
  }

  return (
    <aside
      className={cn(
        'flex w-full flex-col items-center gap-md bg-neutral-white px-xl pb-sm pt-xl md:w-[450px] md:shrink-0',
        // Menu 탭: 100vh 고정 + 내부 스크롤
        // Info 탭: self-start로 부모 flex의 cross-axis stretch 옵트아웃 → 컨텐츠 hug
        isMenuTab ? 'md:h-screen md:min-h-0 md:overflow-hidden' : 'md:self-start',
        className,
      )}
    >
      <button
        type="button"
        onClick={onBack}
        className="flex w-full items-start text-subhead font-bold text-brand-primary"
      >
        ← 목록
      </button>

      <div className="flex w-full flex-col items-start gap-xxs py-xs">
        <h1 className="text-h2 font-bold text-text-primary whitespace-nowrap">{shop.name}</h1>
        <div className="flex w-full items-center justify-between gap-xs">
          <p className="text-body font-normal text-text-tertiary">{shop.category}</p>
          <Heart active={liked} onClick={handleToggleLike} />
        </div>
      </div>

      <div className="flex w-full max-w-[400px] items-center justify-center">
        <ShopImageGallery images={shop.images} alt={shop.name} />
      </div>

      <div className="flex w-full flex-1 flex-col items-start overflow-hidden py-sm">
        <div className="flex w-full flex-1 flex-col items-start overflow-hidden rounded-lg border border-border-default bg-neutral-white pb-md">
          {/* ShopTabBar */}
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
                icon={
                  <Icon
                    name="icon-location-square"
                    size={20}
                    aria-hidden
                  />
                }
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
              <InfoLine icon={<Icon name="shop-detail-doc" size={20} className="text-text-secondary" aria-hidden />} alignStart>
                <p className="flex-1 text-body-l font-medium text-text-primary">
                  {shop.description ?? ''}
                </p>
              </InfoLine>
            </div>
          ) : (
            <div className="flex w-full flex-1 flex-col items-start gap-xxs overflow-y-auto py-sm pl-lg pr-sm">
              {shop.menus.map((m) => {
                const qty = quantities[m.name] ?? 0
                return (
                  <div key={m.name} className="flex w-full items-center gap-md py-xs">
                    <span className="flex-1 text-subhead font-medium text-text-primary">
                      {m.name}
                    </span>
                    <span className="text-body-l font-medium text-text-primary whitespace-nowrap">
                      {fmtPrice(m.price)}
                    </span>
                    <div className="flex items-center justify-center gap-md rounded-2xl border border-border-default px-md py-xs">
                      <button
                        type="button"
                        aria-label="감소"
                        onClick={() =>
                          setQuantities((s) => ({ ...s, [m.name]: Math.max(0, qty - 1) }))
                        }
                      >
                        <Icon
                          name="stepper-minus"
                          size={16}
                          className={qty > 0 ? 'text-text-primary' : 'text-text-tertiary'}
                          aria-hidden
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
                        <Icon name="stepper-plus" size={16} className="text-text-primary" aria-hidden />
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
        <div className="flex w-full items-end justify-center">
          <div className="flex flex-col items-start gap-xxs">
            {shop.status && <ShopStatusBadge status={shop.status} />}
            <div className="flex items-center gap-md text-subhead font-bold whitespace-nowrap">
              <p className="text-text-primary">현재 인원</p>
              <p className="text-brand-primary">
                {shop.participantCurrent ?? 1} / {shop.participantTotal ?? 5}명
              </p>
            </div>
          </div>
          <div className="flex flex-1 flex-col items-end justify-center gap-xxs overflow-clip">
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
          onClick={handleJoin}
          disabled={totalAmount === 0 || shop.currentGroupOrderId == null}
          className="flex w-full items-center justify-center rounded-md bg-brand-primary py-sm text-subhead font-bold text-neutral-white transition-colors hover:bg-brand-primary-hover disabled:cursor-not-allowed disabled:opacity-40"
        >
          {shop.currentGroupOrderId == null ? '모집 마감' : '참여하기'}
        </button>
      </div>

      {loginDialog}
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
