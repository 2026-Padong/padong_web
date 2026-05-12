import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router'
import { EmptyState } from '@/components/ui/EmptyState'
import { fetchOrderFlowHistory } from '@/api/orderFlows'
import { FlowStatusBadge } from './MenuOrderList'

// 모임 내역 — 완료/거절된 과거 모임 리스트. 서버 필터 (GET /order-flows/history?from=&to=)
export function OrderHistoryList({
  storeId: _storeId,
  from = '',
  to = '',
}: {
  storeId: number
  from?: string
  to?: string
}) {
  const historyQuery = useQuery({
    queryKey: ['order-flow-history', from, to],
    queryFn: () => fetchOrderFlowHistory({ from: from || undefined, to: to || undefined }),
    staleTime: 60_000,
  })

  const nav = useNavigate()
  if (historyQuery.isLoading) return <EmptyState title="불러오는 중..." message="" />
  if (historyQuery.error) return <EmptyState title="오류" message="모임 내역을 불러올 수 없어요" />
  const items = historyQuery.data ?? []
  if (items.length === 0) {
    return from || to ? (
      <EmptyState title="해당 기간 모임이 없어요" message="" />
    ) : (
      <EmptyState title="모임 내역이 없어요" message="" />
    )
  }

  const fmtPrice = (n: number) => `${n.toLocaleString('ko-KR')}원`
  const formatDt = (s?: string) => {
    if (!s) return ''
    const d = new Date(s.replace(' ', 'T'))
    if (Number.isNaN(d.getTime())) return s
    const dow = ['일', '월', '화', '수', '목', '금', '토'][d.getDay()]
    const pad = (n: number) => String(n).padStart(2, '0')
    return `${d.getMonth() + 1}월 ${d.getDate()}일 (${dow}) ${pad(d.getHours())}:${pad(d.getMinutes())}`
  }

  return (
    <ul className="flex flex-col gap-md">
      {items.map((it) => (
        <li
          key={it.id}
          onClick={() => nav(`/admin/orders/history/${it.id}`, { viewTransition: true })}
          className="flex cursor-pointer flex-col gap-sm rounded-md bg-neutral-white p-lg ring-1 ring-border-default transition-colors hover:bg-surface-subtle"
        >
          <div className="flex items-start justify-between gap-md">
            <div className="flex flex-1 flex-col gap-xxs">
              <span className="text-body-l font-bold text-text-primary">
                {it.menus.map((m) => m.name).join(', ')}
              </span>
              {it.recruitmentDeadline && (
                <span className="text-body font-normal text-text-tertiary">
                  마감 {formatDt(it.recruitmentDeadline)}
                </span>
              )}
            </div>
            <FlowStatusBadge status={it.status} />
          </div>
          <div className="flex items-baseline justify-between gap-xs border-t border-border-default pt-sm">
            <span className="text-body font-normal text-text-secondary">
              참여 인원 <span className="font-bold text-brand-primary">{it.participantCount}명</span>
            </span>
            <span className="text-subhead font-bold text-text-primary whitespace-nowrap">
              {fmtPrice(it.totalAmount)}
            </span>
          </div>
        </li>
      ))}
    </ul>
  )
}
