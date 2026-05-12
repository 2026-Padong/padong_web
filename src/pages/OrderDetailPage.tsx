import { useLocation, useNavigate, useParams } from 'react-router'
import { HeaderNav } from '@/components/layout/HeaderNav'
import { useAuth } from '@/lib/auth'
import { useOrderDetail } from '@/api/queries/useMyOrders'
import type { OrderInfo } from '@/lib/orderStorage'

// 주문 상세 페이지 — 결제 완료 후 "주문 상세 보기" 또는 마이페이지 내 주문 진입
// nav state > useOrderDetail hook (localStorage + mock fallback)
export function OrderDetailPage() {
  const nav = useNavigate()
  const { user } = useAuth()
  const { orderId: orderIdParam } = useParams<{ orderId: string }>()
  const location = useLocation()

  const orderId = Number(orderIdParam ?? '')
  const stateInfo = (location.state as OrderInfo | null) ?? null
  const { data: hookInfo } = useOrderDetail(stateInfo ? undefined : orderId)
  const info: OrderInfo | null = stateInfo ?? hookInfo ?? null

  if (!user) {
    nav('/login', { replace: true })
    return null
  }

  if (!info) {
    return (
      <div className="flex min-h-screen flex-col bg-neutral-white">
        <HeaderNav user={user} onMyPage={() => nav('/mypage')} />
        <main className="mx-auto flex w-full max-w-[480px] flex-1 flex-col items-center justify-center gap-md px-md py-2xl text-center">
          <h1 className="text-h2 font-bold text-text-primary">주문 정보를 불러올 수 없어요</h1>
          <p className="text-body-l font-normal text-text-secondary">
            나중에 마이페이지 &gt; 내 주문 에서 확인하실 수 있어요.
          </p>
          <button
            type="button"
            onClick={() => nav('/shops')}
            className="cursor-pointer rounded-md bg-brand-primary px-md py-sm text-body-l font-bold text-neutral-white hover:bg-brand-primary-hover"
          >
            홈으로
          </button>
        </main>
      </div>
    )
  }

  const fmtPrice = (n: number) => `${n.toLocaleString('ko-KR')}원`
  const fmtDate = (iso: string) => {
    const d = new Date(iso)
    const yyyy = d.getFullYear()
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    const dd = String(d.getDate()).padStart(2, '0')
    const hh = String(d.getHours()).padStart(2, '0')
    const mi = String(d.getMinutes()).padStart(2, '0')
    return `${yyyy}.${mm}.${dd} ${hh}:${mi}`
  }
  // 유저 노출용 주문번호: 결제일 기반 + PK 패딩
  const displayOrderNumber = `${info.paidAt.slice(0, 10).replace(/-/g, '')}-${String(info.orderId).padStart(5, '0')}`

  return (
    <div className="flex min-h-screen flex-col bg-neutral-white">
      <HeaderNav user={user} onMyPage={() => nav('/mypage')} />
      <main className="mx-auto flex w-full max-w-[480px] flex-1 flex-col px-md pt-2xl pb-2xl">
        {/* 헤더 */}
        <header className="flex items-center gap-sm pb-lg">
          <button
            type="button"
            onClick={() => nav(-1)}
            aria-label="뒤로"
            className="cursor-pointer text-h3 text-text-tertiary hover:text-text-primary"
          >
            ←
          </button>
          <h1 className="text-h2 font-bold text-text-primary">주문 상세</h1>
        </header>

        {/* 상태 뱃지 (현재는 결제 완료 후 진입 → 준비중 가정) */}
        <section className="flex flex-col items-start gap-xs py-md">
          <span className="inline-flex items-center gap-xxs rounded-full bg-status-recruiting-bg px-sm py-xxs">
            <span className="size-[6px] rounded-full bg-status-recruiting" />
            <span className="text-body-s font-medium text-status-recruiting">준비중</span>
          </span>
          <p className="text-body font-normal text-text-tertiary">
            가게가 메뉴를 준비하고 있어요. 픽업 가능 시점에 알림으로 알려드릴게요.
          </p>
        </section>

        <Divider />

        {/* 가게 정보 */}
        <section className="flex items-center gap-md py-lg">
          <div className="size-[56px] shrink-0 overflow-hidden rounded-md bg-surface-subtle">
            {info.shop.imageUrl && (
              <img src={info.shop.imageUrl} alt={info.shop.name} className="h-full w-full object-cover" />
            )}
          </div>
          <div className="flex flex-1 flex-col gap-xxs">
            <span className="text-body-l font-bold text-text-primary">{info.shop.name}</span>
            <span className="text-body font-normal text-text-tertiary">{info.shop.category}</span>
          </div>
          <button
            type="button"
            onClick={() => nav(`/shops/${info.shop.id}`, { viewTransition: true })}
            className="shrink-0 cursor-pointer text-body font-medium text-brand-primary hover:underline"
          >
            가게 보기 →
          </button>
        </section>

        <Divider />

        {/* 주문 메뉴 */}
        <section className="flex flex-col gap-sm py-lg">
          <h2 className="text-body-l font-bold text-text-primary">주문 메뉴</h2>
          <ul className="flex flex-col gap-sm">
            {info.items.map((it) => (
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
        <section className="flex flex-col gap-sm py-lg">
          <h2 className="text-body-l font-bold text-text-primary">픽업 정보</h2>
          <dl className="flex flex-col gap-xs">
            <InfoRow label="장소" value={info.shop.address} />
            <InfoRow label="시간" value={`${info.shop.openTime} ~ ${info.shop.closeTime}`} />
            <InfoRow label="전화" value={info.shop.phoneNumber} />
          </dl>
        </section>

        <Divider />

        {/* 결제 정보 */}
        <section className="flex flex-col gap-sm py-lg">
          <h2 className="text-body-l font-bold text-text-primary">결제 정보</h2>
          <dl className="flex flex-col gap-xs">
            <InfoRow label="총 금액" value={fmtPrice(info.totalAmount)} valueClass="text-brand-primary font-bold" />
            <InfoRow label="결제수단" value={info.paymentMethod === 'card' ? '카드' : '계좌이체'} />
            <InfoRow label="결제일시" value={fmtDate(info.paidAt)} />
            <InfoRow label="주문번호" value={displayOrderNumber} valueClass="text-text-tertiary font-normal text-body" />
          </dl>
        </section>

        {/* 액션 — 홈/가게 둘러보기 */}
        <section className="flex flex-col gap-xs pt-xl">
          <button
            type="button"
            onClick={() => nav('/', { viewTransition: true })}
            className="w-full cursor-pointer rounded-md bg-brand-primary py-sm text-body-l font-bold text-neutral-white drop-shadow-[0px_4px_24px_rgba(37,88,232,0.14)] transition-colors hover:bg-brand-primary-hover"
          >
            홈으로 가기
          </button>
          <button
            type="button"
            onClick={() => nav('/shops', { viewTransition: true })}
            className="w-full cursor-pointer rounded-md py-sm text-body-l font-normal text-text-secondary transition-colors hover:bg-surface-subtle"
          >
            다른 가게 둘러보기
          </button>
        </section>
      </main>
    </div>
  )
}

function Divider() {
  return <div className="h-px w-full bg-border-default" aria-hidden />
}

function InfoRow({
  label,
  value,
  valueClass,
}: {
  label: string
  value: string
  valueClass?: string
}) {
  return (
    <div className="flex items-baseline gap-sm">
      <dt className="w-[56px] shrink-0 text-body font-normal text-text-tertiary">{label}</dt>
      <dd className={`flex-1 text-body-l font-normal text-text-primary ${valueClass ?? ''}`}>{value}</dd>
    </div>
  )
}
