import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import * as PortOne from '@portone/browser-sdk/v2'
import { HeaderNav } from '@/components/layout/HeaderNav'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { Img } from '@/components/ui/Img'
import { useShopDetail } from '@/api/queries/useShopDetail'
import { preparePayment, confirmPayment } from '@/api/payments'
import { loadCart, clearCart, type CartData } from '@/lib/cart'
import { saveOrder, type OrderInfo } from '@/lib/orderStorage'
import { useAuth } from '@/lib/auth'
import { saveReturnUrl } from '@/lib/loginRedirect'

type PaymentMethod = 'card' | 'transfer'

// PortOne SDK 환경 변수 — 둘 다 있어야 실 결제 위젯, 없으면 mock/test 흐름
const PORTONE_STORE_ID = import.meta.env.VITE_PORTONE_STORE_ID as string | undefined
const PORTONE_CHANNEL_KEY = import.meta.env.VITE_PORTONE_CHANNEL_KEY as string | undefined
const HAS_PORTONE = Boolean(PORTONE_STORE_ID && PORTONE_CHANNEL_KEY)

const PAY_METHOD_MAP: Record<PaymentMethod, 'CARD' | 'TRANSFER'> = {
  card: 'CARD',
  transfer: 'TRANSFER',
}

// 가게 결제 페이지 — 가게 정보 + 주문 메뉴 + 픽업 안내 + 결제 수단 + [결제하기]
// 카트는 sessionStorage 에서 로드. 빈 카트면 가게 상세로 redirect.
export function CheckoutPage() {
  const { id } = useParams<{ id: string }>()
  const nav = useNavigate()
  const { user } = useAuth()
  const { data: shop, isPending, error } = useShopDetail(id)
  const [cart, setCart] = useState<CartData | null>(null)
  const [method, setMethod] = useState<PaymentMethod>('card')
  const [submitting, setSubmitting] = useState(false)
  const [errorOpen, setErrorOpen] = useState(false)

  useEffect(() => {
    if (!id) return
    if (!user) {
      saveReturnUrl(`/shops/${id}/checkout`)
      nav('/login', { replace: true })
      return
    }
    const loaded = loadCart(Number(id))
    if (!loaded || loaded.items.length === 0) {
      nav(`/shops/${id}`, { replace: true })
      return
    }
    setCart(loaded)
  }, [id, user, nav])

  if (!user || !id) return null

  const fmtPrice = (n: number) => `${n.toLocaleString('ko-KR')}원`

  const handleSubmit = async () => {
    if (!cart || !shop) return
    if (!shop.currentGroupOrder) {
      // 모집 종료/없음 — 결제 진입 자체가 ShopDetailPanel 에서 차단되지만 안전망
      setErrorOpen(true)
      return
    }
    setSubmitting(true)
    try {
      // 1) 백엔드 prepare — orderId, paymentId(UUID), amount 받음
      const prepare = await preparePayment({
        groupOrderId: shop.currentGroupOrder.id,
        orderMenus: cart.items.map((it) => ({ menuId: it.menuId, quantity: it.quantity })),
      })

      // 2) PortOne SDK 위젯 호출 — env 키 있을 때만. 없으면 mock/test 흐름 (백엔드 isTest)
      if (HAS_PORTONE) {
        // PortOne v2 PaymentRequestUnion 은 payMethod 별 필드를 요구 (예: alipayPlus).
        // CARD/TRANSFER 두 경로만 쓰므로 SDK 입력 타입으로 단언.
        const result = await PortOne.requestPayment({
          storeId: PORTONE_STORE_ID!,
          channelKey: PORTONE_CHANNEL_KEY!,
          paymentId: prepare.paymentId,
          orderName: prepare.orderName,
          totalAmount: prepare.amount,
          currency: 'CURRENCY_KRW',
          payMethod: PAY_METHOD_MAP[method],
          customer: {
            fullName: prepare.customerName,
            ...(user.email ? { email: user.email } : {}),
          },
        } as Parameters<typeof PortOne.requestPayment>[0])
        // 사용자 취소 또는 PG 오류 (성공 시 code 는 undefined)
        if (result && result.code !== undefined) {
          console.error('[checkout] portone:', result.code, result.message)
          setErrorOpen(true)
          return
        }
      }

      // 3) 백엔드 confirm — PortOne 가 있었으면 백엔드가 PortOne API로 검증
      //    없었으면 백엔드 test 모드로 즉시 PAID
      await confirmPayment({ paymentId: prepare.paymentId })

      // 4) 카트 정리 + 완료 페이지로 (주문 정보 nav state로 전달)
      clearCart(cart.shopId)
      const orderInfo: OrderInfo = {
        orderId: prepare.orderId,
        paymentId: prepare.paymentId,
        paidAt: new Date().toISOString(),
        shop: {
          id: shop.id,
          name: shop.name,
          imageUrl: shop.thumbnailUrl,
          category: shop.categoryLabel,
          address: shop.address,
          phoneNumber: shop.phoneNumber,
          openTime: shop.openTime,
          closeTime: shop.closeTime,
        },
        items: cart.items,
        totalAmount: prepare.amount,
        paymentMethod: method,
      }
      saveOrder(orderInfo)
      nav(`/shops/${id}/checkout/complete`, {
        replace: true,
        viewTransition: true,
        state: orderInfo,
      })
    } catch (e) {
      console.error('[checkout] failed:', e)
      setErrorOpen(true)
    } finally {
      setSubmitting(false)
    }
  }

  if (isPending || !cart) {
    return (
      <div className="flex min-h-screen flex-col bg-surface-subtle/40">
        <HeaderNav user={user} onMyPage={() => nav('/mypage')} />
        <main className="mx-auto flex w-full max-w-[640px] flex-1 items-center justify-center p-lg text-body-l text-text-tertiary">
          불러오는 중...
        </main>
      </div>
    )
  }

  if (error || !shop) {
    return (
      <div className="flex min-h-screen flex-col bg-surface-subtle/40">
        <HeaderNav user={user} onMyPage={() => nav('/mypage')} />
        <main className="mx-auto flex w-full max-w-[640px] flex-1 items-center justify-center p-lg text-body-l text-status-critical">
          가게 정보를 불러올 수 없어요
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-neutral-white">
      <HeaderNav user={user} onMyPage={() => nav('/mypage')} />
      <main className="mx-auto flex w-full max-w-[640px] flex-1 flex-col px-md pt-2xl pb-[120px]">
        <header className="flex items-center gap-sm pb-lg">
          <button
            type="button"
            onClick={() => nav(`/shops/${id}`)}
            aria-label="뒤로"
            className="cursor-pointer text-h3 text-text-tertiary hover:text-text-primary"
          >
            ←
          </button>
          <h1 className="text-h2 font-bold text-text-primary">참여하기</h1>
        </header>

        {/* 가게 정보 */}
        <section className="flex items-center gap-md py-lg">
          <div className="size-[72px] shrink-0 overflow-hidden rounded-md bg-surface-subtle">
            <Img src={shop.thumbnailUrl} alt={shop.name} className="h-full w-full object-cover" />
          </div>
          <div className="flex flex-1 flex-col gap-xxs">
            <span className="text-body-l font-bold text-text-primary">{shop.name}</span>
            <span className="text-body font-normal text-text-tertiary">{shop.categoryLabel}</span>
            <span className="text-body font-normal text-text-secondary">
              {shop.address}
            </span>
          </div>
        </section>

        <Divider />

        {/* 주문 메뉴 */}
        <section className="flex flex-col gap-md py-lg">
          <h2 className="text-body-l font-bold text-text-primary">주문 메뉴</h2>
          <ul className="flex flex-col gap-sm">
            {cart.items.map((it) => (
              <li key={it.menuId} className="flex items-baseline justify-between gap-md">
                <div className="flex flex-1 flex-col gap-xxs">
                  <span className="text-body-l font-medium text-text-primary">{it.name}</span>
                  <span className="text-body font-normal text-text-tertiary">
                    {fmtPrice(it.price)} × {it.quantity}
                  </span>
                </div>
                <span className="shrink-0 text-body-l font-bold text-text-primary whitespace-nowrap">
                  {fmtPrice(it.price * it.quantity)}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <Divider />

        {/* 픽업 정보 */}
        <section className="flex flex-col gap-md py-lg">
          <h2 className="text-body-l font-bold text-text-primary">픽업 정보</h2>
          <dl className="flex flex-col gap-xs">
            <InfoRow
              label="장소"
              value={shop.address}
            />
            <InfoRow label="시간" value={`${shop.openTime} ~ ${shop.closeTime}`} />
            <InfoRow label="전화" value={shop.phoneNumber} />
          </dl>
        </section>

        <Divider />

        {/* 결제 수단 */}
        <section className="flex flex-col gap-md py-lg">
          <h2 className="text-body-l font-bold text-text-primary">결제 수단</h2>
          <div className="flex gap-sm">
            <MethodRadio
              checked={method === 'card'}
              onSelect={() => setMethod('card')}
              label="카드"
            />
            <MethodRadio
              checked={method === 'transfer'}
              onSelect={() => setMethod('transfer')}
              label="계좌이체"
            />
          </div>
          <p className="text-body font-normal text-text-tertiary">
            테스트 환경으로 실제 결제가 진행되지 않습니다.
          </p>
        </section>
      </main>

      {/* 결제 sticky footer */}
      <footer className="sticky bottom-0 z-10 border-t border-border-default bg-neutral-white px-md py-md">
        <div className="mx-auto flex w-full max-w-[640px] items-center justify-between gap-md">
          <div className="flex flex-col gap-xxs">
            <span className="text-body font-normal text-text-tertiary">총 결제 금액</span>
            <span className="text-h3 font-bold text-brand-primary">{fmtPrice(cart.totalAmount)}</span>
          </div>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="cursor-pointer rounded-md bg-brand-primary px-xl py-sm text-body-l font-bold text-neutral-white drop-shadow-[0px_4px_24px_rgba(37,88,232,0.14)] transition-colors hover:bg-brand-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? '결제 중...' : '결제하기'}
          </button>
        </div>
      </footer>

      <ConfirmDialog
        open={errorOpen}
        title="결제에 실패했어요"
        description="잠시 후 다시 시도해주세요."
        confirmLabel="확인"
        hideCancel
        onConfirm={() => setErrorOpen(false)}
      />
    </div>
  )
}

function Divider() {
  return <div className="h-px w-full bg-border-default" aria-hidden />
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline gap-sm">
      <dt className="w-[42px] shrink-0 text-body font-normal text-text-tertiary">{label}</dt>
      <dd className="flex-1 text-body-l font-normal text-text-primary">{value}</dd>
    </div>
  )
}

function MethodRadio({
  checked,
  onSelect,
  label,
}: {
  checked: boolean
  onSelect: () => void
  label: string
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={
        'flex flex-1 cursor-pointer items-center justify-center gap-xs rounded-md border py-sm text-body-l font-medium transition-colors ' +
        (checked
          ? 'border-brand-primary bg-brand-primary-tint text-brand-primary'
          : 'border-border-default bg-neutral-white text-text-secondary hover:border-text-tertiary')
      }
    >
      <span
        className={
          'inline-flex size-[16px] shrink-0 items-center justify-center rounded-full border-2 ' +
          (checked ? 'border-brand-primary' : 'border-border-default')
        }
      >
        {checked && <span className="size-[8px] rounded-full bg-brand-primary" />}
      </span>
      {label}
    </button>
  )
}
