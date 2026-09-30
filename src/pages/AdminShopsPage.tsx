import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { HeaderNav } from '@/components/layout/HeaderNav'
import { EmptyState } from '@/components/ui/EmptyState'
import { useAuth } from '@/lib/auth'
import { fetchMyStores, type StoreRegistrationResponse } from '@/api/stores'
import { ActionButton } from '@/features/shop/components/ActionButton'
import { AdminShopDetailPanel } from '@/features/admin/components/AdminShopDetailPanel'
import { useShopDetail } from '@/api/queries/useShopDetail'
import { MenuOrderList, ActiveOrderBadge } from '@/features/admin/components/MenuOrderList'

// 사장님 전용 — 매장 관리 (와이드 2컬럼)
// 좌: 가게 정보 요약 + 세부 메뉴 (가게 정보 / 메뉴 관리)
// 우: 모임 관리 (진행 중 주문 흐름 - 풀 보기 링크 포함)
export function AdminShopsPage() {
  const nav = useNavigate()
  const { user } = useAuth()
  const [items, setItems] = useState<StoreRegistrationResponse[] | null>(null)
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
    if (!approved) return
    fetchMyStores()
      .then((page) => setItems(page.content))
      .catch((e) => {
        console.error('[admin-shops] fetch failed:', e)
        setError('가게 정보를 불러올 수 없어요')
      })
  }, [user, isAdmin, approved, nav])

  if (!user) return null
  const store = items?.[0]

  return (
    <div className="flex min-h-screen flex-col bg-neutral-white">
      <HeaderNav user={user} onMyPage={() => nav('/mypage')} />
      <main className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col gap-2xl px-2xl pt-md pb-md">
        <header className="flex items-center gap-sm">
          <button
            type="button"
            onClick={() => nav('/mypage')}
            aria-label="뒤로"
            className="cursor-pointer text-h3 text-text-tertiary hover:text-text-primary"
          >
            ←
          </button>
          <h1 className="text-h2 font-bold text-text-primary">매장 관리</h1>
        </header>

        {!approved ? (
          <EmptyState title="관리자 승인 대기 중" message="승인 완료 후 관리할 수 있어요" />
        ) : error ? (
          <EmptyState title="오류" message={error} />
        ) : items === null ? (
          <EmptyState title="불러오는 중..." message="" />
        ) : !store ? (
          <div className="flex flex-col gap-md">
            <EmptyState title="등록된 가게가 없어요" message="첫 가게를 등록해보세요" />
            <ActionButton onClick={() => nav('/admin/shops/new', { viewTransition: true })}>
              + 가게 등록
            </ActionButton>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-lg lg:grid-cols-[450px_1fr]">
            {/* LEFT — absolute trick: 좌측 panel 이 row 사이즈에 기여 X. row 는 우측 자연 + min-h 로만 결정 */}
            <aside className="flex flex-col gap-md lg:relative">
              <div className="lg:absolute lg:inset-0 lg:flex lg:overflow-hidden">
                <ShopDetailEmbed storeId={store.id} />
              </div>
            </aside>

            {/* RIGHT — 모임 현황(위) + 가게 관리(아래). 좌측 패널 top 과 동일 row 시작 → align-self start */}
            <section className="flex flex-col items-stretch gap-md self-start lg:min-h-[640px]">
              <div className="flex flex-col gap-md">
                <div className="flex items-baseline justify-between gap-sm">
                  <div className="flex items-center gap-md">
                    <h2 className="text-h3 font-bold text-text-primary leading-none">모임 현황</h2>
                    <ActiveOrderBadge storeId={store.id} />
                  </div>
                  <button
                    type="button"
                    onClick={() => nav('/admin/orders', { viewTransition: true })}
                    className="cursor-pointer text-body font-bold text-brand-primary hover:underline"
                  >
                    상세 보기 →
                  </button>
                </div>
                <MenuOrderList storeId={store.id} activeOnly />
              </div>

              <div className="flex flex-col gap-md">
                <h2 className="text-h3 font-bold text-text-primary">가게 관리</h2>
                <div className="grid grid-cols-1 gap-md md:grid-cols-2">
                  <NavCard
                    title="모임 생성"
                    description="메뉴 골라 모집 시작"
                    onClick={() => nav('/admin/orders/new', { viewTransition: true })}
                  />
                  <NavCard
                    title="모임 내역"
                    description="완료·거절된 모임 기록"
                    onClick={() => nav('/admin/orders/history', { viewTransition: true })}
                  />
                  <NavCard
                    title="가게 정보 수정"
                    description="이름·주소·영업 시간·이미지"
                    onClick={() => nav('/admin/shops/info', { viewTransition: true })}
                  />
                  <NavCard
                    title="메뉴 관리"
                    description="판매 메뉴 등록·수정·삭제"
                    onClick={() => nav('/admin/shops/menus', { viewTransition: true })}
                  />
                </div>
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  )
}

// ─── 가게 상세 패널 임베드 (사장 전용 AdminShopDetailPanel) ────────────────

function ShopDetailEmbed({ storeId }: { storeId: number }) {
  const [tab, setTab] = useState<'Menu' | 'Info'>('Menu')
  const detail = useShopDetail(String(storeId))
  if (detail.isLoading) {
    return <EmptyState title="불러오는 중..." message="" />
  }
  if (detail.isError || !detail.data) {
    return <EmptyState title="오류" message="가게 정보를 불러올 수 없어요" />
  }
  return <AdminShopDetailPanel shop={detail.data} tab={tab} onTabChange={setTab} />
}

// ─── 세부 메뉴 진입 카드 ────────────────────────────────────────────────────

function NavCard({
  title,
  description,
  onClick,
}: {
  title: string
  description: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-full cursor-pointer items-center gap-md rounded-md border border-border-default p-md text-left transition-colors hover:border-brand-primary hover:bg-brand-primary-tint/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
    >
      <div className="flex flex-1 flex-col gap-xxs">
        <span className="text-body-l font-bold text-text-primary">{title}</span>
        <span className="text-body font-normal text-text-secondary">{description}</span>
      </div>
      <span
        aria-hidden
        className="text-h3 font-normal text-text-tertiary transition-all group-hover:translate-x-[2px] group-hover:text-brand-primary"
      >
        ›
      </span>
    </button>
  )
}
