import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { HeaderNav } from '@/components/layout/HeaderNav'
import { useAuth } from '@/lib/auth'
import { fetchMyStores, type StoreRegistrationResponse } from '@/api/stores'
import { AdminStoreCard } from '@/features/admin/components/AdminStoreCard'

// 사장님 전용 — 내 가게 관리 페이지
// 가드:
//   - 비로그인 → /login
//   - role !== ADMIN → /mypage
//   - approved === false → "승인 대기" 안내
//   - approved === true → 가게 리스트
export function AdminShopsPage() {
  const nav = useNavigate()
  const { user } = useAuth()
  const [items, setItems] = useState<StoreRegistrationResponse[] | null>(null)
  const [total, setTotal] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const isAdmin = user?.role === 'ADMIN'
  const approved = user?.approved === true

  useEffect(() => {
    if (!user) {
      nav('/login', { replace: true })
      return
    }
    if (!isAdmin) {
      nav('/mypage', { replace: true })
      return
    }
    if (!approved) return // 승인 대기 — fetch 생략

    fetchMyStores()
      .then((page) => {
        setItems(page.content)
        setTotal(page.totalElements)
      })
      .catch((e) => {
        console.error('[admin-shops] fetch failed:', e)
        setError('가게 목록을 불러올 수 없어요')
      })
  }, [user, isAdmin, approved, nav])

  if (!user) return null

  return (
    <div className="flex min-h-screen flex-col bg-surface-subtle/40">
      <HeaderNav user={user} onMyPage={() => nav('/mypage')} />
      <main className="mx-auto flex w-full max-w-[640px] flex-1 flex-col gap-lg px-md py-2xl">
        <header className="flex flex-col gap-xs">
          <div className="flex items-center gap-sm">
            <button
              type="button"
              onClick={() => nav('/mypage')}
              aria-label="뒤로"
              className="cursor-pointer text-h3 text-text-tertiary hover:text-text-primary"
            >
              ←
            </button>
            <h1 className="text-h2 font-bold text-text-primary">내 가게 관리</h1>
            {approved && items && (
              <span className="ml-auto inline-flex items-center rounded-full bg-surface-subtle px-xs py-xxs text-body font-medium text-text-secondary">
                {total}개
              </span>
            )}
          </div>
          <p className="ml-[28px] text-body-l font-normal text-text-secondary">
            등록한 가게의 정보를 확인하고 관리할 수 있어요.
          </p>
        </header>

        {!approved ? (
          <PendingApprovalCard onBack={() => nav('/mypage', { replace: true })} />
        ) : error ? (
          <p className="rounded-md bg-neutral-white p-lg text-body-l text-status-critical ring-1 ring-border-default">
            {error}
          </p>
        ) : items === null ? (
          <p className="rounded-md bg-neutral-white p-lg text-body-l text-text-tertiary ring-1 ring-border-default">
            불러오는 중...
          </p>
        ) : items.length === 0 ? (
          <EmptyStoresCard onRegister={() => nav('/admin/shops/new', { viewTransition: true })} />
        ) : (
          <div className="flex flex-col gap-md">
            <button
              type="button"
              onClick={() => nav('/admin/shops/new', { viewTransition: true })}
              className="self-end cursor-pointer rounded-md bg-brand-primary px-md py-sm text-body-l font-bold text-neutral-white drop-shadow-[0px_4px_24px_rgba(37,88,232,0.14)] transition-colors hover:bg-brand-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
            >
              + 가게 등록
            </button>
            {items.map((s) => (
              <AdminStoreCard key={s.id} store={s} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

function PendingApprovalCard({ onBack }: { onBack: () => void }) {
  return (
    <div className="flex flex-col items-center gap-md rounded-md bg-neutral-white p-2xl text-center ring-1 ring-border-default">
      <h2 className="text-h3 font-bold text-text-primary">관리자 승인 대기 중</h2>
      <p className="max-w-[360px] text-body-l font-normal text-text-secondary">
        사장님 신청이 접수되었어요. 승인이 완료되면 가게를 등록하고 관리할 수 있어요.
      </p>
      <button
        type="button"
        onClick={onBack}
        className="mt-xs cursor-pointer rounded-md bg-surface-subtle px-md py-sm text-body-l font-bold text-text-primary transition-colors hover:bg-surface-subtle/70"
      >
        마이페이지로
      </button>
    </div>
  )
}

function EmptyStoresCard({ onRegister }: { onRegister: () => void }) {
  return (
    <div className="flex flex-col items-center gap-md rounded-md bg-neutral-white p-2xl text-center ring-1 ring-border-default">
      <h2 className="text-h3 font-bold text-text-primary">아직 등록된 가게가 없어요</h2>
      <p className="max-w-[360px] text-body-l font-normal text-text-secondary">
        첫 가게를 등록하고 손님들에게 노출해보세요.
      </p>
      <button
        type="button"
        onClick={onRegister}
        className="mt-xs cursor-pointer rounded-md bg-brand-primary px-md py-sm text-body-l font-bold text-neutral-white drop-shadow-[0px_4px_24px_rgba(37,88,232,0.14)] transition-colors hover:bg-brand-primary-hover"
      >
        + 가게 등록하기
      </button>
    </div>
  )
}
