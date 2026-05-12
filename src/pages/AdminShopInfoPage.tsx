import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { HeaderNav } from '@/components/layout/HeaderNav'
import { EmptyState } from '@/components/ui/EmptyState'
import { InfoTable } from '@/features/shop/components/InfoTable'
import { ActionButton } from '@/features/shop/components/ActionButton'
import { ShopImageGallery } from '@/features/shop/components/ShopImageGallery'
import { useAuth } from '@/lib/auth'
import {
  fetchMyStores,
  updateStore,
  deleteStore,
  uploadStoreThumbnail,
  deleteStoreThumbnail,
  uploadStoreImage,
  deleteStoreImage,
  type StoreRegistrationResponse,
} from '@/api/stores'
import type { StoreImageResponse } from '@/api/contracts/shops'
import { useShopDetail } from '@/api/queries/useShopDetail'
import type { ShopDetailResponse } from '@/api/contracts/shops'
import {
  CategorySelect,
  PhoneInput,
  TimeSelect,
  WeekdayToggle,
} from '@/features/admin/components/StoreFormControls'
import {
  ShopThumbnailField,
  ShopGalleryField,
} from '@/features/admin/components/ShopImageFields'
import {
  formatWeekdaysParen,
  maskToWeekdays,
  weekdaysToMask,
} from '@/features/admin/utils/weekdays'

// 사장님 전용 — 가게 정보 (조회/수정/삭제 + 썸네일·상세 이미지 관리)
// 라우트: /admin/shops/info  (허브 /admin/shops 에서 진입)
export function AdminShopInfoPage() {
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
        setError('가게 목록을 불러올 수 없어요')
      })
  }, [user, isAdmin, approved, nav])

  if (!user) return null

  const primaryStore = items?.[0]

  return (
    <div className="flex min-h-screen flex-col bg-neutral-white">
      <HeaderNav user={user} onMyPage={() => nav('/mypage')} />
      <main className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col gap-0 px-2xl pt-md pb-9">
        <header className="flex items-center gap-sm">
          <button
            type="button"
            onClick={() => nav('/admin/shops')}
            aria-label="뒤로"
            className="cursor-pointer text-h3 text-text-tertiary hover:text-text-primary"
          >
            ←
          </button>
          <h1 className="text-h2 font-bold text-text-primary">가게 정보</h1>
        </header>

        {!approved ? (
          <EmptyState title="관리자 승인 대기 중" message="승인 완료 후 관리할 수 있어요" />
        ) : error ? (
          <EmptyState title="오류" message={error} />
        ) : items === null ? (
          <EmptyState title="불러오는 중..." message="" />
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center gap-md p-xl">
            <EmptyState title="등록된 가게가 없어요" message="첫 가게를 등록해보세요" />
            <ActionButton onClick={() => nav('/admin/shops/new', { viewTransition: true })}>
              + 가게 등록
            </ActionButton>
          </div>
        ) : !primaryStore ? null : (
          <ShopInfoSection storeId={primaryStore.id} />
        )}
      </main>
    </div>
  )
}

// ─── 가게 정보 섹션 ────────────────────────────────────────────────────────

function ShopInfoSection({ storeId }: { storeId: number }) {
  const detail = useShopDetail(String(storeId))
  if (detail.isLoading) return <EmptyState title="불러오는 중..." message="" />
  if (detail.isError || !detail.data)
    return <EmptyState title="오류" message="가게 정보를 불러올 수 없어요" />
  return <ShopInfoCard shop={detail.data} />
}

const trimSec = (t: string) => (t || '').split(':').slice(0, 2).join(':')

function ShopInfoCard({ shop }: { shop: ShopDetailResponse }) {
  const nav = useNavigate()
  const qc = useQueryClient()
  const [editing, setEditing] = useState(false)
  const [busy, setBusy] = useState(false)
  const [form, setForm] = useState({
    name: shop.name,
    address: shop.address,
    phoneNumber: shop.phoneNumber,
    openTime: trimSec(shop.openTime),
    closeTime: trimSec(shop.closeTime),
    description: shop.description ?? '',
  })
  const [weekdays, setWeekdays] = useState<boolean[]>(maskToWeekdays(shop.weekdayMask ?? 0))
  const [category, setCategory] = useState(shop.category)
  const set =
    <K extends keyof typeof form>(k: K) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [k]: e.target.value }))

  const enterEdit = () => {
    setForm({
      name: shop.name,
      address: shop.address,
      phoneNumber: shop.phoneNumber,
      openTime: trimSec(shop.openTime),
      closeTime: trimSec(shop.closeTime),
      description: shop.description ?? '',
    })
    setWeekdays(maskToWeekdays(shop.weekdayMask ?? 0))
    setCategory(shop.category)
    setEditing(true)
  }
  const handleCancel = () => setEditing(false)
  const handleSave = async () => {
    setBusy(true)
    try {
      await updateStore(shop.id, {
        name: form.name,
        category,
        address: form.address,
        phoneNumber: form.phoneNumber,
        description: form.description,
        openTime: form.openTime,
        closeTime: form.closeTime,
        weekdayMask: weekdaysToMask(weekdays),
      })
      qc.invalidateQueries({ queryKey: ['shop-detail', String(shop.id)] })
      qc.invalidateQueries({ queryKey: ['stores'] })
      setEditing(false)
    } catch (e) {
      console.error('[store:update] failed:', e)
      alert('수정 실패. 입력값을 확인해주세요.')
    } finally {
      setBusy(false)
    }
  }
  const handleDelete = async () => {
    if (!confirm('가게를 삭제하시겠어요? 되돌릴 수 없어요.')) return
    setBusy(true)
    try {
      await deleteStore(shop.id)
      qc.invalidateQueries({ queryKey: ['stores'] })
      qc.invalidateQueries({ queryKey: ['shop-detail'] })
      nav('/mypage', { replace: true })
    } catch (e) {
      console.error('[store:delete] failed:', e)
      alert('삭제 실패. 잠시 후 다시 시도해주세요.')
    } finally {
      setBusy(false)
    }
  }

  const weekdayValue = editing ? (
    <WeekdayToggle value={weekdays} onChange={setWeekdays} />
  ) : (
    formatWeekdaysParen(weekdays)
  )

  const openValue = editing ? (
    <TimeSelect value={form.openTime} onChange={(v) => setForm((p) => ({ ...p, openTime: v }))} />
  ) : (
    trimSec(shop.openTime)
  )
  const closeValue = editing ? (
    <TimeSelect value={form.closeTime} onChange={(v) => setForm((p) => ({ ...p, closeTime: v }))} />
  ) : (
    trimSec(shop.closeTime)
  )

  const addressFull = shop.address ?? ''

  return (
    <div className="flex flex-col gap-lg">
      {/* 외곽 컨테이너 — w-fit 으로 내부 콘텐츠 폭에 fit + mx-auto 로 페이지 중앙 정렬
          상단(썸네일 + 상세 이미지)이 컨테이너 폭을 결정 → 하단 가게 정보가 컨테이너 풀폭으로 같이 끝남 */}
      <div className={`mx-auto flex w-fit max-w-full flex-col ${editing ? 'gap-0' : 'gap-lg'}`}>
        {/* 상단 — 썸네일 + 상세 이미지 */}
        <div className="flex flex-col items-start gap-lg lg:flex-row lg:gap-3xl">
          <section className="flex flex-col gap-sm lg:w-fit lg:shrink-0">
            <SectionHeader title="썸네일 이미지" hint="5 : 4" />
            <RemoteThumbnail
              storeId={shop.id}
              src={shop.thumbnailUrl}
              editing={editing}
              name={shop.name}
            />
          </section>

          <section className="flex flex-col gap-sm lg:w-fit">
            <SectionHeader title="상세 이미지" hint="16 : 9" />
            <RemoteGallery
              storeId={shop.id}
              images={shop.images ?? []}
              editing={editing}
              name={shop.name}
            />
          </section>
        </div>

        {/* 하단 — 가게 정보 (컨테이너 풀폭) */}
        <section className="flex w-full flex-col gap-sm">
          <SectionHeader title="가게 정보" />
          <InfoTable
            className="gap-xs"
            rows={[
              {
                label: '가게명',
                value: editing ? (
                  <EditInput
                    value={form.name}
                    onChange={set('name')}
                    placeholder="가게 이름을 입력하세요"
                  />
                ) : (
                  shop.name
                ),
              },
              {
                label: '카테고리',
                value: editing ? (
                  <CategorySelect value={category} onChange={setCategory} />
                ) : (
                  shop.categoryLabel || shop.category
                ),
              },
              {
                label: '주소',
                value: editing ? (
                  <EditInput
                    value={form.address}
                    onChange={set('address')}
                    placeholder="주소를 입력하세요"
                  />
                ) : (
                  addressFull
                ),
              },
              {
                label: '전화',
                value: editing ? (
                  <PhoneInput
                    value={form.phoneNumber}
                    onChange={(v) => setForm((p) => ({ ...p, phoneNumber: v }))}
                  />
                ) : (
                  shop.phoneNumber
                ),
              },
              { label: '영업 요일', value: weekdayValue },
              { label: '오픈 시간', value: openValue },
              { label: '마감 시간', value: closeValue },
              {
                label: '가게 설명',
                value: editing ? (
                  <EditInput
                    value={form.description}
                    onChange={set('description')}
                    placeholder="가게 소개를 한 줄로 적어주세요 (선택)"
                  />
                ) : (
                  shop.description ?? '-'
                ),
              },
            ]}
          />
        </section>
      </div>

      {/* 하단 — 중앙 액션 */}
      <div className="mt-xs flex flex-col items-center gap-sm">
        {editing ? (
          <div className="flex w-full max-w-[420px] gap-xs">
            <button
              type="button"
              onClick={handleCancel}
              disabled={busy}
              className="flex-1 cursor-pointer rounded-md border border-border-default bg-neutral-white py-sm text-subhead font-bold text-text-primary transition-colors hover:bg-surface-subtle disabled:cursor-not-allowed"
            >
              취소
            </button>
            <ActionButton onClick={handleSave} disabled={busy} className="flex-1">
              저장
            </ActionButton>
          </div>
        ) : (
          <>
            <ActionButton onClick={enterEdit} disabled={busy} className="w-full max-w-[420px]">
              가게 정보 수정
            </ActionButton>
            <button
              type="button"
              onClick={handleDelete}
              disabled={busy}
              className="cursor-pointer rounded-md px-md py-xs text-body font-normal text-text-tertiary hover:text-status-critical disabled:cursor-not-allowed disabled:opacity-50"
            >
              가게 삭제
            </button>
          </>
        )}
      </div>
    </div>
  )
}

// ─── 원격 (실 API) 어댑터 — ShopThumbnailField / ShopGalleryField 재사용 ──

function RemoteThumbnail({
  storeId,
  src,
  editing,
  name,
}: {
  storeId: number
  src: string | null | undefined
  editing: boolean
  name: string
}) {
  const qc = useQueryClient()
  const [busy, setBusy] = useState(false)
  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ['shop-detail', String(storeId)] })
    qc.invalidateQueries({ queryKey: ['stores'] })
  }
  const handleSelect = async (f: File) => {
    setBusy(true)
    try {
      await uploadStoreThumbnail(storeId, f)
      invalidate()
    } catch (e) {
      console.error('[thumbnail:upload] failed:', e)
      alert('썸네일 업로드 실패')
    } finally {
      setBusy(false)
    }
  }
  const handleRemove = async () => {
    if (!confirm('썸네일을 제거하시겠어요?')) return
    setBusy(true)
    try {
      await deleteStoreThumbnail(storeId)
      invalidate()
    } catch (e) {
      console.error('[thumbnail:delete] failed:', e)
      alert('썸네일 제거 실패')
    } finally {
      setBusy(false)
    }
  }
  return (
    <ShopThumbnailField
      src={src ?? null}
      editing={editing}
      onSelect={handleSelect}
      onRemove={handleRemove}
      busy={busy}
      alt={name}
    />
  )
}

function RemoteGallery({
  storeId,
  images,
  editing,
  name,
}: {
  storeId: number
  images: StoreImageResponse[]
  editing: boolean
  name: string
}) {
  const qc = useQueryClient()
  const [busy, setBusy] = useState(false)
  const invalidate = () => qc.invalidateQueries({ queryKey: ['shop-detail', String(storeId)] })
  const handleAdd = async (f: File) => {
    setBusy(true)
    try {
      await uploadStoreImage(storeId, f)
      invalidate()
    } catch (e) {
      console.error('[image:upload] failed:', e)
      alert('이미지 추가 실패')
    } finally {
      setBusy(false)
    }
  }
  const handleRemove = async (key: string) => {
    if (!confirm('이 이미지를 제거하시겠어요?')) return
    setBusy(true)
    try {
      await deleteStoreImage(storeId, Number(key))
      invalidate()
    } catch (e) {
      console.error('[image:delete] failed:', e)
      alert('이미지 제거 실패')
    } finally {
      setBusy(false)
    }
  }
  return (
    <ShopGalleryField
      items={images.map((i) => ({ key: String(i.id), url: i.url }))}
      editing={editing}
      onAdd={handleAdd}
      onRemove={handleRemove}
      busy={busy}
      alt={name}
    />
  )
}

// ─── 섹션 헤더 (제목 + 비율 hint) ──────────────────────────────────────────

function SectionHeader({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="flex w-full items-baseline justify-between gap-sm">
      <h3 className="text-subhead font-bold text-text-primary">{title}</h3>
      {hint && (
        <span className="text-body font-normal text-text-tertiary">{hint}</span>
      )}
    </div>
  )
}

// InfoTable 행 value 자리에 들어가는 inline input — TextField 스타일 (border + focus) 재사용
// 보기 모드 ↔ 수정 모드 전환 시 행 높이 흔들림 X (h-[34px] 고정)
function EditInput({
  value,
  onChange,
  placeholder,
}: {
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
}) {
  return (
    <input
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="h-[34px] w-full rounded-md border border-border-default bg-neutral-white px-sm text-body-l text-text-primary outline-none transition-colors placeholder:text-text-tertiary focus:border-brand-primary"
    />
  )
}

