import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import { HeaderNav } from '@/components/layout/HeaderNav'
import { EmptyState } from '@/components/ui/EmptyState'
import { useAuth } from '@/lib/auth'
import { fetchOrderFlowHistoryDetail, fetchOrderFlowParticipants } from '@/api/orderFlows'
import { FlowRow, FlowStatusBadge } from '@/features/admin/components/MenuOrderList'

// 사장님 전용 — 모임 내역 단건 상세 (/admin/orders/history/:id)
export function AdminOrderHistoryDetailPage() {
  const nav = useNavigate()
  const { user } = useAuth()
  const { id } = useParams<{ id: string }>()
  const flowId = Number(id)

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
  }, [user, nav])

  const detailQuery = useQuery({
    queryKey: ['order-flow-history', flowId],
    queryFn: () => fetchOrderFlowHistoryDetail(flowId),
    enabled: !!flowId,
    staleTime: 60_000,
  })

  if (!user) return null

  const fmtPrice = (n: number) => `${n.toLocaleString('ko-KR')}원`
  const formatDt = (s?: string) => {
    if (!s) return '-'
    const d = new Date(s.replace(' ', 'T'))
    if (Number.isNaN(d.getTime())) return s
    const dow = ['일', '월', '화', '수', '목', '금', '토'][d.getDay()]
    const pad = (n: number) => String(n).padStart(2, '0')
    return `${d.getMonth() + 1}월 ${d.getDate()}일 (${dow}) ${pad(d.getHours())}:${pad(d.getMinutes())}`
  }

  return (
    <div className="flex min-h-screen flex-col bg-neutral-white">
      <HeaderNav user={user} onMyPage={() => nav('/mypage')} />
      <main className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col gap-2xl px-2xl pt-md pb-9">
        <header className="flex items-center gap-sm">
          <button
            type="button"
            onClick={() => nav('/admin/orders/history')}
            aria-label="뒤로"
            className="cursor-pointer text-h3 text-text-tertiary hover:text-text-primary"
          >
            ←
          </button>
          <h1 className="text-h2 font-bold text-text-primary">모임 내역 상세</h1>
        </header>

        {detailQuery.isLoading ? (
          <EmptyState title="불러오는 중..." message="" />
        ) : detailQuery.error || !detailQuery.data ? (
          <EmptyState title="오류" message="모임 정보를 불러올 수 없어요" />
        ) : (
          (() => {
            const flow = detailQuery.data
            return (
              <div className="mx-auto grid w-full grid-cols-1 gap-lg lg:grid-cols-[2fr_3fr]">
                {/* LEFT — 모임 정보 */}
                <section className="flex flex-col gap-md">
                  <div className="flex items-center justify-between gap-md">
                    <h2 className="text-h3 font-bold text-text-primary">모임 정보</h2>
                    <FlowStatusBadge status={flow.status} />
                  </div>

                  <article className="flex flex-col gap-sm rounded-md bg-neutral-white p-lg ring-1 ring-border-default">
                    <dl className="flex flex-col gap-xs">
                      {flow.recruitmentStart && (
                        <FlowRow
                          label="모집 일시"
                          value={formatDt(flow.recruitmentStart)}
                          emphasis
                        />
                      )}
                      {flow.recruitmentDeadline && (
                        <FlowRow
                          label="마감 시간"
                          value={formatDt(flow.recruitmentDeadline)}
                          emphasis
                        />
                      )}
                      <FlowRow label="완료 일시" value={formatDt(flow.completedAt)} />
                      <FlowRow
                        label="메뉴"
                        value={flow.menus.map((m) => m.menuInfo).join(', ')}
                      />
                    </dl>

                    <div className="flex items-baseline justify-between gap-xs border-t border-border-default pt-sm">
                      <div className="flex items-baseline gap-md whitespace-nowrap">
                        <span className="w-[88px] shrink-0 text-body font-normal text-text-secondary">
                          참여 인원
                        </span>
                        <span className="text-subhead font-bold text-brand-primary">
                          {flow.participantCount}명
                        </span>
                      </div>
                      <div className="flex items-baseline gap-md whitespace-nowrap">
                        <span className="text-body font-normal text-text-secondary">총액</span>
                        <span className="text-subhead font-bold text-text-primary">
                          {fmtPrice(flow.totalAmount)}
                        </span>
                      </div>
                    </div>
                  </article>
                </section>

                {/* RIGHT — 참여자 */}
                <ParticipantsCard flowId={flow.id} />
              </div>
            )
          })()
        )}
      </main>
    </div>
  )
}

// ─── 참여자 카드 (AdminOrdersPage 와 동일 구조) ─────────────────────────────

function ParticipantsCard({ flowId }: { flowId: number }) {
  const participantsQuery = useQuery({
    queryKey: ['order-flow', flowId, 'participants'],
    queryFn: () => fetchOrderFlowParticipants(flowId),
    staleTime: 60_000,
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
        <EmptyState title="참여자가 없어요" message="" />
      ) : (
        <ul className="flex flex-col gap-md">
          {participantsQuery.data!.map((p) => (
            <li
              key={p.userId}
              className="flex flex-col gap-sm rounded-md bg-neutral-white p-md ring-1 ring-border-default"
            >
              <div className="flex items-center justify-between gap-sm">
                <span className="text-subhead font-bold text-text-primary">{p.userName}</span>
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
