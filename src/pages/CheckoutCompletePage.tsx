import { useLocation, useNavigate } from 'react-router'
import { HeaderNav } from '@/components/layout/HeaderNav'
import { Img } from '@/components/ui/Img'
import { useAuth } from '@/lib/auth'
import { loadOrder, type OrderInfo } from '@/lib/orderStorage'

// 결제 완료 페이지 — 배민 스타일
// 1) 큰 체크 + "주문이 접수됐어요"
// 2) 가게 정보 카드
// 3) 주문 메뉴 요약
// 4) 픽업 정보
// 5) 총 결제 금액 + [주문 상세 보기] / [다른 가게 보기]
export function CheckoutCompletePage() {
  const nav = useNavigate()
  const { user } = useAuth()
  const location = useLocation()

  // nav state 가 primary, sessionStorage fallback (새로고침 시)
  const stateInfo = (location.state as OrderInfo | null) ?? null
  const orderId = stateInfo?.orderId
  const info: OrderInfo | null = stateInfo ?? (orderId ? loadOrder(orderId) : null)

  if (!user || !info) {
    return (
      <div className="flex min-h-screen flex-col bg-neutral-white">
        <HeaderNav user={user ?? undefined} onMyPage={() => nav('/mypage')} />
        <main className="mx-auto flex w-full max-w-[480px] flex-1 flex-col items-center justify-center gap-md px-md py-2xl text-center">
          <h1 className="text-h2 font-bold text-text-primary">주문 정보를 불러올 수 없어요</h1>
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

  return (
    <div className="flex min-h-screen flex-col bg-neutral-white">
      <HeaderNav user={user} onMyPage={() => nav('/mypage')} />
      <main className="mx-auto flex w-full max-w-[480px] flex-1 flex-col px-md pt-2xl pb-[120px]">
        {/* 상단 — 큰 체크 + 안내 */}
        <section className="flex flex-col items-center gap-md py-xl text-center">
          <div className="flex size-[64px] items-center justify-center rounded-full bg-brand-primary-tint">
            <svg width="32" height="32" viewBox="0 0 40 40" fill="none" aria-hidden>
              <path
                d="M11 20 L18 27 L29 14"
                stroke="var(--color-brand-primary)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="flex flex-col items-center gap-xxs">
            <h1 className="text-h2 font-bold text-text-primary">주문이 접수됐어요</h1>
            <p className="text-body-l font-normal text-text-secondary">
              가게가 메뉴를 준비하면 알림으로 알려드릴게요
            </p>
          </div>
        </section>

        <Divider />

        {/* 가게 정보 */}
        <section className="flex items-center gap-md py-lg">
          <div className="size-[56px] shrink-0 overflow-hidden rounded-md bg-surface-subtle">
            <Img src={info.shop.imageUrl} alt={info.shop.name} className="h-full w-full object-cover" />
          </div>
          <div className="flex flex-1 flex-col gap-xxs">
            <span className="text-body-l font-bold text-text-primary">{info.shop.name}</span>
            <span className="text-body font-normal text-text-tertiary">{info.shop.category}</span>
          </div>
        </section>

        <Divider />

        {/* 주문 메뉴 요약 */}
        <section className="flex flex-col gap-sm py-lg">
          <h2 className="text-body-l font-bold text-text-primary">주문 메뉴</h2>
          <ul className="flex flex-col gap-xs">
            {info.items.map((it) => (
              <li key={it.menuId} className="flex items-baseline justify-between gap-md">
                <span className="text-body-l font-medium text-text-primary">
                  {it.name} × {it.quantity}
                </span>
                <span className="shrink-0 text-body-l font-normal text-text-secondary whitespace-nowrap">
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
          </dl>
        </section>

        <Divider />

        {/* 총 결제 금액 */}
        <section className="flex items-baseline justify-between py-lg">
          <span className="text-body-l font-bold text-text-primary">총 결제 금액</span>
          <span className="text-h3 font-bold text-brand-primary">{fmtPrice(info.totalAmount)}</span>
        </section>
      </main>

      {/* sticky footer */}
      <footer className="sticky bottom-0 z-10 border-t border-border-default bg-neutral-white px-md py-md">
        <div className="mx-auto flex w-full max-w-[480px] flex-col gap-xs">
          <button
            type="button"
            onClick={() => nav(`/orders/${info.orderId}`, { state: info, viewTransition: true })}
            className="w-full cursor-pointer rounded-md bg-brand-primary py-sm text-body-l font-bold text-neutral-white drop-shadow-[0px_4px_24px_rgba(37,88,232,0.14)] transition-colors hover:bg-brand-primary-hover"
          >
            주문 상세 보기
          </button>
          <button
            type="button"
            onClick={() => nav('/shops', { viewTransition: true })}
            className="w-full cursor-pointer rounded-md py-sm text-body-l font-normal text-text-secondary transition-colors hover:bg-surface-subtle"
          >
            다른 가게 보기
          </button>
        </div>
      </footer>
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
