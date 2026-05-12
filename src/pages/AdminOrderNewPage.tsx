import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import { HeaderNav } from '@/components/layout/HeaderNav'
import { EmptyState } from '@/components/ui/EmptyState'
import { InfoTable } from '@/features/shop/components/InfoTable'
import { ActionButton } from '@/features/shop/components/ActionButton'
import { useAuth } from '@/lib/auth'
import { fetchMyStores, type StoreRegistrationResponse } from '@/api/stores'
import { fetchMenus } from '@/api/menus'
import { createOrderFlow } from '@/api/orderFlows'
import { TimeSelect } from '@/features/admin/components/StoreFormControls'

// 사장님 전용 — 모임 생성 (/admin/orders/new)
// 가게의 메뉴들 중 다수 선택 + 모집 일시/마감/인당 최소/인원 입력
export function AdminOrderNewPage() {
  const nav = useNavigate()
  const { user } = useAuth()
  const [store, setStore] = useState<StoreRegistrationResponse | null>(null)
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
      .then((page) => setStore(page.content[0] ?? null))
      .catch((e) => {
        console.error('[order-new] fetch store failed:', e)
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
          <h1 className="text-h2 font-bold text-text-primary">모임 생성</h1>
        </header>

        {loading ? (
          <EmptyState title="불러오는 중..." message="" />
        ) : error ? (
          <EmptyState title="오류" message={error} />
        ) : !store ? (
          <EmptyState title="등록된 가게가 없어요" message="가게를 먼저 등록해주세요" />
        ) : (
          <OrderForm storeId={store.id} />
        )}
      </main>
    </div>
  )
}

// ─── 모임 폼 ───────────────────────────────────────────────────────────────

function OrderForm({ storeId }: { storeId: number }) {
  const nav = useNavigate()
  const menusQuery = useQuery({
    queryKey: ['menus', storeId],
    queryFn: () => fetchMenus(storeId),
    staleTime: 30_000,
  })

  const [form, setForm] = useState({
    menuIds: [] as number[],
    recruitmentDeadline: '',
    minOrderPerPerson: 0,
    participantTotal: 5,
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const toggleMenu = (id: number) => {
    setForm((s) => ({
      ...s,
      menuIds: s.menuIds.includes(id)
        ? s.menuIds.filter((x) => x !== id)
        : [...s.menuIds, id],
    }))
  }

  const valid =
    form.menuIds.length > 0 &&
    form.recruitmentDeadline.length > 0 &&
    form.minOrderPerPerson > 0 &&
    form.participantTotal > 0

  const handleSubmit = async () => {
    if (!valid || submitting) return
    setSubmitting(true)
    setError(null)
    try {
      // 모집 시작 = 생성 시점, 마감 = 오늘 + 입력된 시:분 (이미 지난 시각이면 내일로)
      const now = new Date()
      const pad = (n: number) => String(n).padStart(2, '0')
      const dateStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
      const recruitmentStart = `${dateStr} ${pad(now.getHours())}:${pad(now.getMinutes())}`

      const [hh = '00', mm = '00'] = form.recruitmentDeadline.split(':')
      const deadline = new Date(now)
      deadline.setHours(Number(hh), Number(mm), 0, 0)
      if (deadline.getTime() <= now.getTime()) {
        // 이미 지난 시각이면 내일로
        deadline.setDate(deadline.getDate() + 1)
      }
      const recruitmentDeadline = `${deadline.getFullYear()}-${pad(deadline.getMonth() + 1)}-${pad(deadline.getDate())} ${pad(deadline.getHours())}:${pad(deadline.getMinutes())}`

      await createOrderFlow({
        storeId,
        menuIds: form.menuIds,
        recruitmentStart,
        recruitmentDeadline,
        minOrderPerPerson: form.minOrderPerPerson,
        participantTotal: form.participantTotal,
      })
      nav('/admin/shops', { replace: true })
    } catch (e) {
      console.error('[order:create] failed:', e)
      setError('모임 생성 실패. 잠시 후 다시 시도해주세요.')
    } finally {
      setSubmitting(false)
    }
  }

  if (menusQuery.isLoading) return <EmptyState title="메뉴 불러오는 중..." message="" />
  if (menusQuery.error) return <EmptyState title="오류" message="메뉴를 불러올 수 없어요" />
  const menus = menusQuery.data ?? []
  if (menus.length === 0)
    return <EmptyState title="등록된 메뉴가 없어요" message="메뉴를 먼저 등록해주세요" />

  return (
    <div className="mx-auto flex w-full max-w-[640px] flex-col gap-md">
      <h2 className="text-subhead font-bold text-text-primary">모임 정보</h2>
      <InfoTable
        className="gap-md p-lg"
        rows={[
          {
            label: '마감 시간',
            value: (
              <TimeSelect
                value={form.recruitmentDeadline}
                onChange={(v) => setForm((p) => ({ ...p, recruitmentDeadline: v }))}
              />
            ),
          },
          {
            label: '인당 최소 주문',
            value: (
              <NumberInput
                value={form.minOrderPerPerson}
                onChange={(v) => setForm((p) => ({ ...p, minOrderPerPerson: v }))}
                placeholder="인당 최소 주문 금액을 입력하세요"
                suffix="원"
              />
            ),
          },
          {
            label: '모집 인원',
            value: (
              <NumberInput
                value={form.participantTotal}
                onChange={(v) => setForm((p) => ({ ...p, participantTotal: v }))}
                placeholder="모집 인원을 입력하세요"
                suffix="명"
              />
            ),
          },
          {
            label: '메뉴',
            alignStart: true,
            value: (
              <ul className="flex flex-col">
                {menus.map((m) => {
                  const checked = form.menuIds.includes(m.id)
                  const disabled = !!m.soldOut
                  return (
                    <li key={m.id}>
                      <label
                        className={
                          'flex w-full items-center gap-sm py-xs ' +
                          (disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer')
                        }
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          disabled={disabled}
                          onChange={() => !disabled && toggleMenu(m.id)}
                          className="size-[18px] shrink-0 cursor-pointer accent-brand-primary disabled:cursor-not-allowed"
                        />
                        <span className="flex-1 text-body-l font-medium text-text-primary">
                          {m.name}
                          {disabled && (
                            <span className="ml-sm inline-flex items-center rounded-full bg-status-closed-bg px-xs py-xxs text-body-s font-medium text-status-closed">
                              품절
                            </span>
                          )}
                        </span>
                        <span className="text-body font-normal text-text-tertiary whitespace-nowrap">
                          {m.price.toLocaleString('ko-KR')}원
                        </span>
                      </label>
                    </li>
                  )
                })}
              </ul>
            ),
          },
        ]}
      />

      {error && (
        <p className="text-body font-normal text-status-critical">{error}</p>
      )}

      <div className="mt-xs flex flex-col items-center gap-sm">
        <ActionButton
          onClick={handleSubmit}
          disabled={!valid || submitting}
          className="w-full max-w-[420px]"
        >
          {submitting ? '생성 중...' : '모임 생성'}
        </ActionButton>
      </div>
    </div>
  )
}

// ─── 입력 컨트롤 ─────────────────────────────────────────────────────────────

function NumberInput({
  value,
  onChange,
  placeholder,
  suffix,
}: {
  value: number
  onChange: (v: number) => void
  placeholder?: string
  suffix?: string
}) {
  return (
    <div className="flex items-center gap-xs">
      <input
        type="number"
        inputMode="numeric"
        min={0}
        value={value === 0 ? '' : value}
        onChange={(e) => onChange(Number(e.target.value) || 0)}
        placeholder={placeholder}
        className="h-[34px] w-full rounded-md border border-border-default bg-neutral-white px-sm text-body-l text-text-primary outline-none transition-colors placeholder:text-text-tertiary focus:border-brand-primary"
      />
      {suffix && (
        <span className="shrink-0 text-body font-normal text-text-tertiary">{suffix}</span>
      )}
    </div>
  )
}

