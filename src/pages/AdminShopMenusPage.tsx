import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { HeaderNav } from '@/components/layout/HeaderNav'
import { EmptyState } from '@/components/ui/EmptyState'
import { InfoTable } from '@/features/shop/components/InfoTable'
import { useAuth } from '@/lib/auth'
import { fetchMyStores } from '@/api/stores'
import {
  createMenu,
  deleteMenu,
  fetchMenus,
  toggleMenuSoldOut,
  updateMenu,
  type MenuCreateRequest,
  type MenuResponse,
  type MenuUpdateRequest,
} from '@/api/menus'

// 사장님 전용 — 메뉴 관리 (CRUD)
// /admin/shops 허브의 "메뉴 관리" 진입 카드에서 도달
export function AdminShopMenusPage() {
  const nav = useNavigate()
  const { user } = useAuth()
  const [storeId, setStoreId] = useState<number | null>(null)
  const [storeLoading, setStoreLoading] = useState(true)
  const [storeError, setStoreError] = useState<string | null>(null)

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
      .then((page) => {
        const store = page.content[0]
        if (!store) {
          setStoreError('등록된 가게가 없어요')
          return
        }
        setStoreId(store.id)
      })
      .catch((e) => {
        console.error('[admin-menus] fetch store failed:', e)
        setStoreError('가게 정보를 불러올 수 없어요')
      })
      .finally(() => setStoreLoading(false))
  }, [user, nav])

  if (!user) return null

  return (
    <div className="flex min-h-screen flex-col bg-neutral-white">
      <HeaderNav user={user} onMyPage={() => nav('/mypage')} />
      <main className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col gap-md px-2xl pt-md pb-9">
        <header className="flex items-center gap-sm">
          <button
            type="button"
            onClick={() => nav('/admin/shops')}
            aria-label="뒤로"
            className="cursor-pointer text-h3 text-text-tertiary hover:text-text-primary"
          >
            ←
          </button>
          <h1 className="text-h2 font-bold text-text-primary">메뉴 관리</h1>
        </header>

        {storeLoading ? (
          <EmptyState title="불러오는 중..." message="" />
        ) : storeError ? (
          <EmptyState title="오류" message={storeError} />
        ) : storeId == null ? null : (
          <MenuListSection storeId={storeId} />
        )}
      </main>
    </div>
  )
}

// ─── 메뉴 리스트 + CRUD 섹션 ─────────────────────────────────────────────────

function MenuListSection({ storeId }: { storeId: number }) {
  const qc = useQueryClient()
  const menusQuery = useQuery({
    queryKey: ['menus', storeId],
    queryFn: () => fetchMenus(storeId),
    staleTime: 30_000,
  })
  const [adding, setAdding] = useState(false)

  const createMutation = useMutation({
    mutationFn: (input: { menuInfo: string; price: number }) =>
      createMenu({ storeId, menuInfo: input.menuInfo, price: input.price }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['menus', storeId] })
      setAdding(false)
    },
  })

  if (menusQuery.isLoading) return <EmptyState title="메뉴 불러오는 중..." message="" />
  if (menusQuery.error)
    return <EmptyState title="오류" message="메뉴를 불러올 수 없어요" />

  const menus = menusQuery.data ?? []

  return (
    <section className="mx-auto flex w-full max-w-[800px] flex-col gap-md">
      <div className="flex items-center justify-between gap-sm">
        <p className="text-body-l font-bold text-text-primary">
          전체 메뉴 <span className="text-brand-primary">{menus.length}</span>
        </p>
        {!adding && (
          <button
            type="button"
            onClick={() => setAdding(true)}
            className="cursor-pointer rounded-md border border-brand-primary bg-neutral-white px-sm py-xxs text-body font-bold text-brand-primary transition-colors hover:bg-brand-primary-tint"
          >
            + 메뉴 등록
          </button>
        )}
      </div>

      {adding && (
        <MenuEditCard
          mode="create"
          initial={emptyInput()}
          onCancel={() => setAdding(false)}
          onSubmit={(input) => createMutation.mutate(input)}
          submitting={createMutation.isPending}
        />
      )}

      {menus.length === 0 && !adding ? (
        <EmptyState title="등록된 메뉴가 없어요" message="첫 메뉴를 등록해보세요" />
      ) : (
        <ul className="flex flex-col gap-md">
          {menus.map((m) => (
            <li key={m.id}>
              <MenuRow storeId={storeId} menu={m} />
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

// ─── 메뉴 한 줄 (보기 ↔ 편집 토글) ───────────────────────────────────────────

function MenuRow({ storeId, menu }: { storeId: number; menu: MenuResponse }) {
  const qc = useQueryClient()
  const [editing, setEditing] = useState(false)

  const updateMutation = useMutation({
    mutationFn: (input: MenuUpdateRequest) => updateMenu(menu.id, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['menus', storeId] })
      setEditing(false)
    },
  })
  const deleteMutation = useMutation({
    mutationFn: () => deleteMenu(menu.id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['menus', storeId] }),
  })
  const soldOutMutation = useMutation({
    mutationFn: (next: boolean) => toggleMenuSoldOut(menu.id, next),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['menus', storeId] }),
  })

  if (editing) {
    return (
      <MenuEditCard
        mode="edit"
        initial={menuToInput(menu)}
        onCancel={() => setEditing(false)}
        onSubmit={(input) => updateMutation.mutate(input)}
        submitting={updateMutation.isPending}
      />
    )
  }

  const fmt = (n: number) => `${n.toLocaleString('ko-KR')}원`
  const soldOut = !!menu.soldOut
  return (
    <article
      className={
        'flex items-center gap-md rounded-md border border-border-default bg-neutral-white px-lg py-md ' +
        (soldOut ? 'opacity-60' : '')
      }
    >
      <h3 className="flex-1 text-subhead font-medium text-text-primary">
        {menu.menuInfo}
        {soldOut && (
          <span className="ml-sm inline-flex items-center rounded-full bg-status-closed-bg px-xs py-xxs text-body-s font-medium text-status-closed">
            품절
          </span>
        )}
      </h3>
      <p className="text-body-l font-bold text-text-primary whitespace-nowrap">
        {fmt(menu.price)}
      </p>
      <div className="flex gap-xs">
        <button
          type="button"
          onClick={() => soldOutMutation.mutate(!soldOut)}
          disabled={soldOutMutation.isPending}
          className={
            'cursor-pointer rounded-md border px-md py-xs text-body font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ' +
            (soldOut
              ? 'border-brand-primary bg-neutral-white text-brand-primary hover:bg-brand-primary-tint'
              : 'border-border-default bg-neutral-white text-text-secondary hover:bg-surface-subtle')
          }
        >
          {soldOut ? '품절 해제' : '품절'}
        </button>
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="cursor-pointer rounded-md border border-border-default bg-neutral-white px-md py-xs text-body font-medium text-text-primary transition-colors hover:bg-surface-subtle"
        >
          수정
        </button>
        <button
          type="button"
          onClick={() => {
            if (!confirm(`"${menu.menuInfo}" 메뉴를 삭제할까요?`)) return
            deleteMutation.mutate()
          }}
          disabled={deleteMutation.isPending}
          className="cursor-pointer rounded-md border border-status-critical bg-neutral-white px-md py-xs text-body font-medium text-status-critical transition-colors hover:bg-status-critical/5 disabled:cursor-not-allowed disabled:opacity-50"
        >
          삭제
        </button>
      </div>
    </article>
  )
}

// ─── 메뉴 입력 폼 (create / edit 공용) ───────────────────────────────────────

interface MenuFormInput {
  menuInfo: string
  price: number
}

function MenuEditCard({
  mode,
  initial,
  onCancel,
  onSubmit,
  submitting,
}: {
  mode: 'create' | 'edit'
  initial: MenuFormInput
  onCancel: () => void
  onSubmit: (input: MenuFormInput) => void
  submitting: boolean
}) {
  const [form, setForm] = useState<MenuFormInput>(initial)
  const valid = form.menuInfo.trim().length > 0 && form.price > 0

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        if (!valid || submitting) return
        onSubmit(form)
      }}
      className="flex flex-col gap-sm"
    >
      <InfoTable
        className="gap-xs"
        rows={[
          {
            label: '메뉴 이름',
            value: (
              <EditInput
                value={form.menuInfo}
                onChange={(e) => setForm((s) => ({ ...s, menuInfo: e.target.value }))}
                placeholder="메뉴 이름을 입력하세요"
              />
            ),
          },
          {
            label: '가격',
            value: (
              <EditInput
                type="number"
                value={form.price === 0 ? '' : String(form.price)}
                onChange={(e) => {
                  const v = Number(e.target.value) || 0
                  setForm((s) => ({ ...s, price: v }))
                }}
                placeholder="가격을 입력하세요 (원)"
              />
            ),
          },
        ]}
      />

      <div className="flex justify-end gap-xs">
        <button
          type="button"
          onClick={onCancel}
          className="cursor-pointer rounded-md border border-border-default bg-neutral-white px-md py-xs text-body font-medium text-text-primary transition-colors hover:bg-surface-subtle"
        >
          취소
        </button>
        <button
          type="submit"
          disabled={!valid || submitting}
          className="cursor-pointer rounded-md bg-brand-primary px-md py-xs text-body font-bold text-neutral-white transition-colors hover:bg-brand-primary-hover disabled:cursor-not-allowed disabled:opacity-40"
        >
          {submitting ? '저장 중...' : mode === 'create' ? '등록' : '저장'}
        </button>
      </div>
    </form>
  )
}

// ─── InfoTable 행 value 자리 EditInput — AdminShopInfoPage 와 동일 스타일 ─

function EditInput({
  value,
  onChange,
  placeholder,
  type,
}: {
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  type?: string
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="h-[34px] w-full rounded-md border border-border-default bg-neutral-white px-sm text-body-l text-text-primary outline-none transition-colors placeholder:text-text-tertiary focus:border-brand-primary"
    />
  )
}

// ─── 헬퍼 ───────────────────────────────────────────────────────────────────

function emptyInput(): MenuFormInput {
  return { menuInfo: '', price: 0 }
}

function menuToInput(m: MenuResponse): MenuFormInput {
  return { menuInfo: m.menuInfo, price: m.price }
}
