import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { EmptyState } from '@/components/ui/EmptyState'
import { ActionButton } from '@/features/shop/components/ActionButton'
import { fetchMenus, type MenuResponse } from '@/api/menus'
import {
  approveOrderFlow,
  cancelOrderFlow,
  completePickupOrderFlow,
  fetchOrderFlow,
  markReadyOrderFlow,
  rejectOrderFlow,
  type OrderFlowResponse,
} from '@/api/orderFlows'

// 메뉴별 진행 주문 흐름 리스트 — AdminOrdersPage (전체) / AdminShopsPage 허브 (activeOnly)
// activeOnly: 진행 중 모임 한 건만 노출 (가게당 동시 진행 모임은 1건)
export function MenuOrderList({ storeId, activeOnly }: { storeId: number; activeOnly?: boolean }) {
  const menusQuery = useQuery({
    queryKey: ['menus', storeId],
    queryFn: () => fetchMenus(storeId),
    staleTime: 30_000,
  })
  if (menusQuery.isLoading) return <EmptyState title="메뉴 불러오는 중..." message="" />
  if (menusQuery.error) return <EmptyState title="오류" message="메뉴를 불러올 수 없어요" />
  const menus = menusQuery.data ?? []
  if (menus.length === 0) return <EmptyState title="등록된 메뉴가 없어요" message="" />
  return (
    <ul className="flex flex-col gap-md">
      {menus.map((m) => (
        <li key={m.id}>
          <MenuOrderCard menu={m} activeOnly={activeOnly} />
        </li>
      ))}
    </ul>
  )
}

// ─── 공용 — flow 정보 → 라벨/값 필드 빌더 (MenuOrderCard, FlowInfoCard 등 공유) ─
export interface FlowInfoField {
  label: string
  value: string
}

export function buildFlowInfoFields(flow: OrderFlowResponse): FlowInfoField[] {
  const fmt = (n: number) => `${n.toLocaleString('ko-KR')}원`
  const formatDt = (s?: string) => {
    if (!s) return '-'
    const d = new Date(s.replace(' ', 'T'))
    if (Number.isNaN(d.getTime())) return s
    const dow = ['일', '월', '화', '수', '목', '금', '토'][d.getDay()]
    const pad = (n: number) => String(n).padStart(2, '0')
    return `${d.getMonth() + 1}월 ${d.getDate()}일 (${dow}) ${pad(d.getHours())}:${pad(d.getMinutes())}`
  }
  const fields: FlowInfoField[] = []
  if (flow.recruitmentStart) fields.push({ label: '모집 일시', value: formatDt(flow.recruitmentStart) })
  if (flow.recruitmentDeadline) fields.push({ label: '마감 시간', value: formatDt(flow.recruitmentDeadline) })
  if (flow.minOrderPerPerson != null)
    fields.push({ label: '인당 최소 주문', value: fmt(flow.minOrderPerPerson) })
  if ((flow.menus ?? []).length > 0)
    fields.push({ label: '메뉴', value: (flow.menus ?? []).map((m) => m.menuInfo).join(', ') })
  return fields
}

// 프론트 디자인 상태 — 6개 라벨/색 고정
// 백엔드 enum (RECRUITING/CLOSING/PENDING_FULL/WAITING_APPROVAL/PREPARING/READY_FOR_PICKUP/PICKUP_COMPLETED/CANCELED/REJECTED)
// 은 아래 normalizeFlowStatus 로 6개에 매핑
const FLOW_BADGE: Record<
  string,
  { label: string; bg: string; fg: string; dot: string }
> = {
  PENDING: {
    label: '모집중',
    bg: 'bg-status-recruiting-bg', fg: 'text-status-recruiting', dot: 'bg-status-recruiting',
  },
  PENDING_FULL: {
    label: '모집 완료',
    bg: 'bg-status-positive-bg', fg: 'text-status-positive', dot: 'bg-status-positive',
  },
  APPROVED: {
    label: '접수됨',
    bg: 'bg-status-closing-bg', fg: 'text-status-closing', dot: 'bg-status-closing',
  },
  READY: {
    label: '픽업 준비 완료',
    bg: 'bg-status-warning-bg', fg: 'text-status-warning', dot: 'bg-status-warning',
  },
  COMPLETED: {
    label: '픽업 완료',
    bg: 'bg-status-closed-bg', fg: 'text-status-closed', dot: 'bg-status-closed',
  },
  REJECTED: {
    label: '거절됨',
    bg: 'bg-status-critical-bg', fg: 'text-status-critical', dot: 'bg-status-critical',
  },
}

// 백엔드 9개 status → 프론트 6개로 정규화
function normalizeFlowStatus(s: string): string {
  switch (s) {
    case 'RECRUITING':
    case 'CLOSING':
      return 'PENDING'
    case 'PENDING_FULL':
    case 'WAITING_APPROVAL':
      return 'PENDING_FULL'
    case 'PREPARING':
      return 'APPROVED'
    case 'READY_FOR_PICKUP':
      return 'READY'
    case 'PICKUP_COMPLETED':
      return 'COMPLETED'
    case 'CANCELED':
    case 'REJECTED':
      return 'REJECTED'
    default:
      return s
  }
}

export function FlowStatusBadge({ status }: { status: string }) {
  const v = FLOW_BADGE[normalizeFlowStatus(status)] ?? FLOW_BADGE.PENDING
  return (
    <span className={`inline-flex items-center gap-xxs rounded-full px-xs py-xxs ${v.bg}`}>
      <span className={`size-[6px] rounded-full ${v.dot}`} />
      <span className={`text-body-s font-medium ${v.fg}`}>{v.label}</span>
    </span>
  )
}

function MenuOrderCard({ menu, activeOnly }: { menu: MenuResponse; activeOnly?: boolean }) {
  const qc = useQueryClient()
  const flowQuery = useQuery({
    queryKey: ['order-flow', menu.id],
    queryFn: () => fetchOrderFlow(menu.id),
    staleTime: 10_000,
  })
  const [acting, setActing] = useState(false)

  const handleAction = async (
    fn: (id: number) => Promise<OrderFlowResponse>,
    orderFlowId: number,
  ) => {
    setActing(true)
    try {
      const updated = await fn(orderFlowId)
      qc.setQueryData(['order-flow', menu.id], updated)
    } catch (e) {
      console.error('[order-flow:action] failed:', e)
    } finally {
      setActing(false)
    }
  }
  const flow = flowQuery.data

  // activeOnly: 진행 흐름 없는 메뉴는 렌더 X (가게당 진행 모임 1건만)
  if (activeOnly && !flow) return null

  const fields = flow ? buildFlowInfoFields(flow) : []
  const isEmphasis = (label: string) => label === '모집 일시' || label === '마감 시간'

  return (
    <article className="flex flex-col gap-sm rounded-md bg-neutral-white px-md py-md ring-1 ring-border-default">
      <dl className="flex flex-col gap-xs">
        {fields.map((f) => (
          <FlowRow key={f.label} label={f.label} value={f.value} emphasis={isEmphasis(f.label)} />
        ))}
      </dl>

      <div className="flex items-center justify-between gap-xs border-t border-border-default pt-sm">
        {flow ? (
          <>
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
                  handleAction(cancelOrderFlow, flow.id)
                }}
                disabled={acting}
                className="cursor-pointer rounded-md border border-status-critical bg-neutral-white px-lg py-xs text-body-l font-bold text-status-critical transition-colors hover:bg-status-critical/5 disabled:cursor-not-allowed disabled:opacity-50"
              >
                모임 취소
              </button>
            )}
          </>
        ) : flowQuery.isLoading ? (
          <span className="text-body font-normal text-text-tertiary">상태 확인 중...</span>
        ) : (
          <span className="text-body font-normal text-text-tertiary">진행 주문 없음</span>
        )}
      </div>

      {flow && (flow.canApprove || flow.canReject || flow.canMarkReadyForPickup || flow.canCompletePickup) && (
        <div className="flex gap-xs">
          {flow.canApprove && (
            <ActionButton onClick={() => handleAction(approveOrderFlow, flow.id)} disabled={acting} className="flex-1">
              접수
            </ActionButton>
          )}
          {flow.canReject && (
            <button
              type="button"
              onClick={() => handleAction(rejectOrderFlow, flow.id)}
              disabled={acting}
              className="flex-1 cursor-pointer rounded-md border border-status-critical bg-neutral-white py-sm text-subhead font-bold text-status-critical transition-colors hover:bg-status-critical/5 disabled:cursor-not-allowed disabled:opacity-50"
            >
              거절
            </button>
          )}
          {flow.canMarkReadyForPickup && (
            <ActionButton onClick={() => handleAction(markReadyOrderFlow, flow.id)} disabled={acting} className="flex-1">
              픽업 준비 완료
            </ActionButton>
          )}
          {flow.canCompletePickup && (
            <ActionButton onClick={() => handleAction(completePickupOrderFlow, flow.id)} disabled={acting} className="flex-1">
              픽업 완료
            </ActionButton>
          )}
        </div>
      )}
    </article>
  )
}

// 가게의 활성 모임(첫 진행중 flow)의 상태 배지 — 모집 현황 섹션 헤더 옆에 노출
export function ActiveOrderBadge({ storeId }: { storeId: number }) {
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
  const flow = flowQuery.data
  if (!flow) return null
  return <FlowStatusBadge status={flow.status} />
}

export function FlowRow({
  label,
  value,
  emphasis,
}: {
  label: string
  value: string
  emphasis?: boolean
}) {
  const valueCls = emphasis
    ? 'text-body-l font-bold text-text-primary'
    : 'text-body font-normal text-text-primary'
  return (
    <div className="flex items-baseline gap-md">
      <dt className="w-[88px] shrink-0 text-body font-bold text-brand-primary-hover">{label}</dt>
      <dd className={`flex-1 ${valueCls}`}>{value}</dd>
    </div>
  )
}
