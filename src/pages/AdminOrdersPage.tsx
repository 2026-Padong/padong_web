import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { HeaderNav } from '@/components/layout/HeaderNav'
import { EmptyState } from '@/components/ui/EmptyState'
import { ActionButton } from '@/features/shop/components/ActionButton'
import { useAuth } from '@/lib/auth'
import { fetchMyStores } from '@/api/stores'
import { fetchMenus } from '@/api/menus'
import {
  approveOrderFlow,
  cancelOrderFlow,
  completePickupOrderFlow,
  fetchOrderFlow,
  fetchOrderFlowParticipants,
  markReadyOrderFlow,
  rejectOrderFlow,
  type OrderFlowResponse,
} from '@/api/orderFlows'
import {
  buildFlowInfoFields,
  FlowRow,
  FlowStatusBadge,
} from '@/features/admin/components/MenuOrderList'

// 사장님 전용 — 모임 상세 (/admin/orders)
// 매장 관리 허브의 "상세 보기 →" 진입. 현재 진행 중 모임의 정보 + 참여자 + 액션
export function AdminOrdersPage() {
  const nav = useNavigate()
  const { user } = useAuth()
  const [storeId, setStoreId] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
        console.error('[admin-orders] fetch failed:', e)
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
          <h1 className="text-h2 font-bold text-text-primary">모임 상세</h1>
        </header>

        {loading ? (
          <EmptyState title="불러오는 중..." message="" />
        ) : error ? (
          <EmptyState title="오류" message={error} />
        ) : storeId == null ? (
          <EmptyState title="등록된 가게가 없어요" message="" />
        ) : (
          <ActiveFlowDetail storeId={storeId} />
        )}
      </main>
    </div>
  )
}

// ─── 활성 모임 상세 ─────────────────────────────────────────────────────────

function ActiveFlowDetail({ storeId }: { storeId: number }) {
  const menusQuery = useQuery({
    queryKey: ['menus', storeId],
    queryFn: () => fetchMenus(storeId),
    staleTime: 30_000,
  })
  const firstMenu = menusQuery.data?.[0]
  const flowQuery = useQuery({
    queryKey: ['order-flow', firstMenu?.id],
    queryFn: () => fetchOrderFlow(firstMenu!.id),
    staleTime: 10_000,
    enabled: !!firstMenu,
  })

  if (menusQuery.isLoading || flowQuery.isLoading)
    return <EmptyState title="불러오는 중..." message="" />
  if (menusQuery.error || flowQuery.error)
    return <EmptyState title="오류" message="모임 정보를 불러올 수 없어요" />
  const flow = flowQuery.data
  if (!flow)
    return <EmptyState title="진행 중인 모임이 없어요" message="모임을 먼저 생성해주세요" />

  return (
    <div className="mx-auto grid w-full grid-cols-1 gap-lg lg:grid-cols-[2fr_3fr]">
      {/* LEFT — 모임 정보 + 액션 */}
      <FlowInfoCard flow={flow} storeId={storeId} />

      {/* RIGHT — 참여자 리스트 */}
      <ParticipantsCard flow={flow} />
    </div>
  )
}

// ─── 모임 정보 카드 (라벨 폼 + 액션 버튼) ────────────────────────────────────

function FlowInfoCard({ flow, storeId }: { flow: OrderFlowResponse; storeId: number }) {
  const qc = useQueryClient()
  const [acting, setActing] = useState(false)

  const handleAction = async (fn: (id: number) => Promise<unknown>) => {
    setActing(true)
    try {
      await fn(flow.id)
      qc.invalidateQueries({ queryKey: ['order-flow', flow.menuId] })
      qc.invalidateQueries({ queryKey: ['menus', storeId] })
    } catch (e) {
      console.error('[order-flow:action] failed:', e)
    } finally {
      setActing(false)
    }
  }

  const fields = buildFlowInfoFields(flow)
  const isEmphasis = (label: string) => label === '모집 일시' || label === '마감 시간'

  return (
    <section className="flex flex-col gap-md">
      <div className="flex items-center justify-between gap-md">
        <h2 className="text-h3 font-bold text-text-primary">모임 정보</h2>
        <FlowStatusBadge status={flow.status} closingSoon={flow.closingSoon} />
      </div>

      <article className="flex flex-col gap-sm rounded-md bg-neutral-white p-lg ring-1 ring-border-default">
        <dl className="flex flex-col gap-xs">
          {fields.map((f) => (
            <FlowRow key={f.label} label={f.label} value={f.value} emphasis={isEmphasis(f.label)} />
          ))}
        </dl>

        <div className="flex items-center justify-between gap-xs border-t border-border-default pt-sm">
          {flow.participantCurrent != null && flow.participantTotal != null ? (
            <div className="flex items-baseline gap-md whitespace-nowrap">
              <span className="w-[88px] shrink-0 text-body font-normal text-text-secondary">
                현재 인원
              </span>
              <span className="text-subhead font-bold text-brand-primary">
                {flow.participantCurrent} / {flow.participantTotal}명
              </span>
            </div>
          ) : (
            <span />
          )}
          {flow.canCancel && (
            <button
              type="button"
              onClick={() => {
                if (!confirm('모임을 취소하시겠어요?')) return
                handleAction(cancelOrderFlow)
              }}
              disabled={acting}
              className="cursor-pointer rounded-md border border-status-critical bg-neutral-white px-lg py-xs text-body-l font-bold text-status-critical transition-colors hover:bg-status-critical/5 disabled:cursor-not-allowed disabled:opacity-50"
            >
              모임 취소
            </button>
          )}
        </div>
      </article>

      {(flow.canApprove || flow.canReject || flow.canMarkReadyForPickup || flow.canCompletePickup) && (
        <div className="flex gap-xs">
          {flow.canApprove && (
            <ActionButton onClick={() => handleAction(approveOrderFlow)} disabled={acting} className="flex-1">
              접수
            </ActionButton>
          )}
          {flow.canReject && (
            <button
              type="button"
              onClick={() => handleAction(rejectOrderFlow)}
              disabled={acting}
              className="flex-1 cursor-pointer rounded-md border border-status-critical bg-neutral-white py-sm text-subhead font-bold text-status-critical transition-colors hover:bg-status-critical/5 disabled:cursor-not-allowed disabled:opacity-50"
            >
              거절
            </button>
          )}
          {flow.canMarkReadyForPickup && (
            <ActionButton onClick={() => handleAction(markReadyOrderFlow)} disabled={acting} className="flex-1">
              픽업 준비 완료
            </ActionButton>
          )}
          {flow.canCompletePickup && (
            <ActionButton onClick={() => handleAction(completePickupOrderFlow)} disabled={acting} className="flex-1">
              픽업 완료
            </ActionButton>
          )}
        </div>
      )}
    </section>
  )
}

// ─── 참여자 카드 ────────────────────────────────────────────────────────────

function ParticipantsCard({ flow }: { flow: OrderFlowResponse }) {
  const participantsQuery = useQuery({
    queryKey: ['order-flow', flow.id, 'participants'],
    queryFn: () => fetchOrderFlowParticipants(flow.id),
    staleTime: 10_000,
  })
  const fmt = (n: number) => `${n.toLocaleString('ko-KR')}원`

  return (
    <section className="flex flex-col gap-md">
      <div className="flex items-baseline justify-between gap-sm">
        <h2 className="text-h3 font-bold text-text-primary">참여자</h2>
        {participantsQuery.data && (
          <span className="text-body font-normal text-text-tertiary">
            총 {participantsQuery.data.length}명
          </span>
        )}
      </div>

      {participantsQuery.isLoading ? (
        <EmptyState title="불러오는 중..." message="" />
      ) : participantsQuery.error ? (
        <EmptyState title="오류" message="참여자를 불러올 수 없어요" />
      ) : (participantsQuery.data ?? []).length === 0 ? (
        <EmptyState title="아직 참여자가 없어요" message="" />
      ) : (
        <ul className="flex flex-col gap-md">
          {participantsQuery.data!.map((p) => (
            <li
              key={p.userId}
              className="flex flex-col gap-sm rounded-md bg-neutral-white p-md ring-1 ring-border-default"
            >
              <div className="flex items-center justify-between gap-sm">
                <div className="flex items-center gap-sm">
                  <span className="text-subhead font-bold text-text-primary">{p.userName}</span>
                  <PaymentBadge status={p.paymentStatus} />
                </div>
                <span className="text-body font-normal text-text-tertiary">{p.joinedAt}</span>
              </div>
              <ul className="flex flex-col gap-xxs">
                {p.items.map((it) => (
                  <li
                    key={it.menuId}
                    className="flex items-baseline justify-between gap-sm text-body"
                  >
                    <span className="text-text-primary">
                      {it.menuInfo} <span className="text-text-tertiary">× {it.quantity}</span>
                    </span>
                    <span className="font-medium text-text-secondary whitespace-nowrap">
                      {fmt(it.price * it.quantity)}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="flex items-baseline justify-between gap-sm border-t border-border-default pt-sm">
                <span className="text-body font-normal text-text-tertiary">합계</span>
                <span className="text-subhead font-bold text-brand-primary">
                  {fmt(p.totalAmount)}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

// ─── 결제 상태 배지 ─────────────────────────────────────────────────────────

function PaymentBadge({ status }: { status?: string }) {
  if (!status) return null
  const v =
    status === 'PAID'
      ? { label: '결제 완료', bg: 'bg-status-positive-bg', fg: 'text-status-positive', dot: 'bg-status-positive' }
      : status === 'PENDING'
        ? { label: '결제 대기', bg: 'bg-status-warning-bg', fg: 'text-status-warning', dot: 'bg-status-warning' }
        : status === 'CANCELLED'
          ? { label: '취소됨', bg: 'bg-status-closed-bg', fg: 'text-status-closed', dot: 'bg-status-closed' }
          : status === 'REFUNDED'
            ? { label: '환불됨', bg: 'bg-status-closed-bg', fg: 'text-status-closed', dot: 'bg-status-closed' }
            : null
  if (!v) return null
  return (
    <span className={`inline-flex items-center gap-xxs rounded-full px-xs py-xxs ${v.bg}`}>
      <span className={`size-[6px] rounded-full ${v.dot}`} />
      <span className={`text-body-s font-medium ${v.fg}`}>{v.label}</span>
    </span>
  )
}
