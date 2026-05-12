import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { HeaderNav } from '@/components/layout/HeaderNav'
import { EmptyState } from '@/components/ui/EmptyState'
import { useAuth } from '@/lib/auth'
import { fetchMyStores } from '@/api/stores'
import { OrderHistoryList } from '@/features/admin/components/OrderHistoryList'
import { CalendarSelect } from '@/features/admin/components/StoreFormControls'

// 사장님 전용 — 모임 내역 (/admin/orders/history)
// 완료/거절된 과거 모임 리스트 + 완료일 범위 필터
export function AdminOrderHistoryPage() {
  const nav = useNavigate()
  const { user } = useAuth()
  const [storeId, setStoreId] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')

  useEffect(() => {
    if (!user) {
      nav('/login', { replace: true })
      return
    }
    if (user.role !== 'ADMIN') {
      nav('/mypage', { replace: true })
      return
    }
    if (user.approved === false) {
      nav('/admin/shops', { replace: true })
      return
    }
    fetchMyStores()
      .then((page) => setStoreId(page.content[0]?.id ?? null))
      .catch((e) => {
        console.error('[admin-order-history] fetch failed:', e)
        setError('가게 정보를 불러올 수 없어요')
      })
      .finally(() => setLoading(false))
  }, [user, nav])

  if (!user) return null

  return (
    <div className="flex min-h-screen flex-col bg-neutral-white">
      <HeaderNav user={user} onMyPage={() => nav('/mypage')} />
      <main className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col gap-2xl px-2xl pt-md pb-9">
        <header className="flex items-center gap-sm">
          <button
            type="button"
            onClick={() => nav('/admin/shops')}
            aria-label="뒤로"
            className="cursor-pointer text-h3 text-text-tertiary hover:text-text-primary"
          >
            ←
          </button>
          <h1 className="text-h2 font-bold text-text-primary">모임 내역</h1>
        </header>

        {loading ? (
          <EmptyState title="불러오는 중..." message="" />
        ) : error ? (
          <EmptyState title="오류" message={error} />
        ) : storeId == null ? (
          <EmptyState title="등록된 가게가 없어요" message="" />
        ) : (
          <section className="mx-auto flex w-full max-w-[800px] flex-col gap-md">
            <div className="flex flex-wrap items-center justify-between gap-sm">
              <h2 className="text-h3 font-bold text-text-primary">이전 모임 리스트</h2>
              <div className="flex items-center gap-xs">
                <CalendarSelect value={from} onChange={setFrom} placeholder="시작 날짜" />
                <span className="text-body font-normal text-text-tertiary">~</span>
                <CalendarSelect value={to} onChange={setTo} placeholder="종료 날짜" />
                {(from || to) && (
                  <button
                    type="button"
                    onClick={() => {
                      setFrom('')
                      setTo('')
                    }}
                    className="cursor-pointer text-body font-normal text-text-tertiary hover:text-text-primary"
                  >
                    초기화
                  </button>
                )}
              </div>
            </div>

            <OrderHistoryList storeId={storeId} from={from} to={to} />
          </section>
        )}
      </main>
    </div>
  )
}

