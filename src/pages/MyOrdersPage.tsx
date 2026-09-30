import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import { HeaderNav } from '@/components/layout/HeaderNav'
import { SearchInput } from '@/components/ui/SearchInput'
import { useAuth } from '@/lib/auth'
import { useIntersection } from '@/lib/useIntersection'
import { useInfiniteMyOrders } from '@/api/queries/useMyOrders'
import { toOrderInfo } from '@/api/orders'

// 마이페이지 > 주문 내역 — 백엔드 GET /orders/me 커서 페이징
// 검색은 client-side (서버사이드 검색 미지원). 페이지가 적으니 충분.
export function MyOrdersPage() {
  const nav = useNavigate()
  const { user } = useAuth()
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (!user) nav('/login', { replace: true })
  }, [user, nav])

  const {
    data,
    isError,
    isPending,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteMyOrders()

  const orders = useMemo(
    () => data?.pages.flatMap((p) => p?.items ?? []).map(toOrderInfo) ?? [],
    [data],
  )

  const q = search.trim().toLowerCase()
  // 가게 이름만 매칭 — placeholder 와 일치
  const filtered = q
    ? orders.filter((o) => o.shop.name.toLowerCase().includes(q))
    : orders

  const sentinelRef = useIntersection(
    () => {
      if (hasNextPage && !isFetchingNextPage) void fetchNextPage()
    },
    { enabled: hasNextPage && !isFetchingNextPage },
  )

  if (!user) return null

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

  // 결제 상태(payment status) 우선 분기 → 정상 결제면 flowStatus 6종 매핑
  const statusLabel = (paymentStatus?: string, flowStatus?: string) => {
    if (paymentStatus === 'FAILED') return '결제 실패'
    if (paymentStatus === 'CANCELED') return '취소됨'
    switch (flowStatus) {
      case 'PENDING': return '모집 중'
      case 'WAITING_APPROVAL': return '승인 대기'
      case 'APPROVED': return '준비 중'
      case 'READY': return '픽업 가능'
      case 'COMPLETED': return '완료'
      case 'REJECTED': return '거절됨'
      default: return '준비 중'
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-surface-subtle/40">
      <HeaderNav user={user} onMyPage={() => nav('/mypage')} />
      <main className="mx-auto flex w-full max-w-[640px] flex-1 flex-col gap-md px-md py-2xl">
        <header className="flex items-center gap-sm">
          <button
            type="button"
            onClick={() => nav('/mypage')}
            aria-label="뒤로"
            className="cursor-pointer text-h3 text-text-tertiary hover:text-text-primary"
          >
            ←
          </button>
          <h1 className="text-h2 font-bold text-text-primary">주문 내역</h1>
        </header>

        {orders.length > 0 && (
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="가게 이름을 검색해보세요"
            className="w-full"
          />
        )}

        {isError ? (
          <p className="rounded-md bg-neutral-white p-lg text-body-l text-status-critical ring-1 ring-border-default">
            주문 내역을 불러올 수 없어요
          </p>
        ) : isPending ? (
          <p className="rounded-md bg-neutral-white p-lg text-body-l text-text-tertiary ring-1 ring-border-default">
            불러오는 중...
          </p>
        ) : orders.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-xs py-2xl text-center">
            <p className="text-body-l font-bold text-text-primary">아직 주문이 없어요</p>
            <p className="text-body font-normal text-text-tertiary">
              가게에서 메뉴를 골라 첫 주문을 해보세요
            </p>
            <button
              type="button"
              onClick={() => nav('/shops', { viewTransition: true })}
              className="mt-sm cursor-pointer rounded-md bg-brand-primary px-md py-sm text-body-l font-bold text-neutral-white drop-shadow-[0px_4px_24px_rgba(37,88,232,0.14)] hover:bg-brand-primary-hover"
            >
              가게 둘러보기
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <p className="rounded-md bg-neutral-white p-lg text-body font-normal text-text-tertiary ring-1 ring-border-default">
            검색 결과가 없어요
          </p>
        ) : (
          <>
            <ul className="flex flex-col gap-md">
              {filtered.map((o) => (
                <li key={o.orderId}>
                  <button
                    type="button"
                    onClick={() => nav(`/orders/${o.orderId}`, { state: o, viewTransition: true })}
                    className="flex w-full cursor-pointer flex-col gap-sm rounded-md bg-neutral-white p-lg text-left ring-1 ring-border-default focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
                  >
                    <div className="flex items-baseline justify-between gap-md">
                      <span className="text-body-l font-bold text-text-primary">{o.shop.name}</span>
                      <span className="shrink-0 text-body font-normal text-text-tertiary">
                        {o.paidAt ? fmtDate(o.paidAt) : '결제 전'}
                      </span>
                    </div>

                    <p className="text-body font-normal text-text-secondary">
                      {o.items[0].name}
                      {o.items.length > 1 ? ` 외 ${o.items.length - 1}건` : ` × ${o.items[0].quantity}`}
                    </p>

                    <div className="flex items-baseline justify-between gap-md">
                      <span className="text-body-l font-bold text-brand-primary">
                        {fmtPrice(o.totalAmount)}
                      </span>
                      <span className="inline-flex items-center gap-xxs rounded-full bg-status-recruiting-bg px-sm py-xxs">
                        <span className="size-[6px] rounded-full bg-status-recruiting" />
                        <span className="text-body-s font-medium text-status-recruiting">
                          {statusLabel(o.status, o.flowStatus)}
                        </span>
                      </span>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
            <div ref={sentinelRef} aria-hidden className="h-px w-full" />
            {isFetchingNextPage && (
              <p className="py-md text-center text-body font-normal text-text-tertiary">
                더 불러오는 중...
              </p>
            )}
          </>
        )}
      </main>
    </div>
  )
}
