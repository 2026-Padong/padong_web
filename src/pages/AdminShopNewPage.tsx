import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import { HeaderNav } from '@/components/layout/HeaderNav'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { InfoTable } from '@/features/shop/components/InfoTable'
import { ActionButton } from '@/features/shop/components/ActionButton'
import { useAuth } from '@/lib/auth'
import { createStore, uploadStoreThumbnail, uploadStoreImage } from '@/api/stores'
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
import { weekdaysToMask } from '@/features/admin/utils/weekdays'

// 가게 등록 — AdminShopsPage 편집 모드와 동일 컴포넌트 (ShopThumbnailField / ShopGalleryField /
// CategorySelect / TimeSelect / WeekdayToggle) 재사용.
// 이미지는 staged (로컬 ObjectURL 미리보기) → 가게 생성 후 순차 업로드.
export function AdminShopNewPage() {
  const nav = useNavigate()
  const { user } = useAuth()

  const [form, setForm] = useState({
    name: '',
    category: '',
    address: '',
    phoneNumber: '',
    description: '',
    openTime: '11:00',
    closeTime: '22:00',
  })
  const [weekdays, setWeekdays] = useState<boolean[]>([true, true, true, true, true, false, false])
  const [thumbnail, setThumbnail] = useState<File | null>(null)
  const [detailImages, setDetailImages] = useState<File[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [doneOpen, setDoneOpen] = useState(false)
  const [errorOpen, setErrorOpen] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  // staged 파일 → ObjectURL 미리보기 (unmount/변경 시 revoke)
  const thumbUrl = useMemo(() => (thumbnail ? URL.createObjectURL(thumbnail) : null), [thumbnail])
  const detailUrls = useMemo(() => detailImages.map((f) => URL.createObjectURL(f)), [detailImages])
  useEffect(() => {
    return () => {
      if (thumbUrl) URL.revokeObjectURL(thumbUrl)
      detailUrls.forEach(URL.revokeObjectURL)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [thumbUrl])
  useEffect(() => () => detailUrls.forEach(URL.revokeObjectURL), [detailUrls])

  useEffect(() => {
    if (!user) nav('/login', { replace: true })
    else if (user.role !== 'ADMIN') nav('/mypage', { replace: true })
    else if (user.approved === false) nav('/admin/shops', { replace: true })
  }, [user, nav])

  if (!user) return null

  const update = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) => {
    setForm((p) => ({ ...p, [k]: v }))
    if (errors[k]) setErrors((p) => ({ ...p, [k]: '' }))
  }
  const setInput =
    <K extends keyof typeof form>(k: K) => (e: React.ChangeEvent<HTMLInputElement>) =>
      update(k, e.target.value)

  const handleSubmit = async () => {
    const next: Record<string, string> = {}
    if (!form.name.trim()) next.name = '가게명을 입력해주세요'
    if (!form.category.trim()) next.category = '카테고리를 선택해주세요'
    if (!form.address.trim()) next.address = '주소를 입력해주세요'
    if (!form.phoneNumber.trim()) next.phoneNumber = '전화번호를 입력해주세요'
    if (Object.keys(next).length) {
      setErrors(next)
      return
    }
    setSubmitting(true)
    try {
      const created = await createStore({
        name: form.name,
        category: form.category,
        address: form.address,
        phoneNumber: form.phoneNumber,
        description: form.description || undefined,
        openTime: form.openTime,
        closeTime: form.closeTime,
        weekdayMask: weekdaysToMask(weekdays),
      })
      // 스테이징된 이미지 순차 업로드 (best-effort)
      const uploadErrors: string[] = []
      if (thumbnail) {
        try {
          await uploadStoreThumbnail(created.id, thumbnail)
        } catch (e) {
          console.error('[create-store:thumbnail] failed:', e)
          uploadErrors.push('썸네일')
        }
      }
      for (const img of detailImages) {
        try {
          await uploadStoreImage(created.id, img)
        } catch (e) {
          console.error('[create-store:image] failed:', e)
          uploadErrors.push(`상세 이미지 (${img.name})`)
        }
      }
      if (uploadErrors.length > 0) {
        setErrorMsg(`가게는 등록됐지만 ${uploadErrors.join(', ')} 업로드 실패. 매장 관리에서 다시 시도해주세요.`)
        setErrorOpen(true)
        return
      }
      setDoneOpen(true)
    } catch (e) {
      console.error('[store:create] failed:', e)
      setErrorMsg('등록 실패. 잠시 후 다시 시도해주세요.')
      setErrorOpen(true)
    } finally {
      setSubmitting(false)
    }
  }

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
          <h1 className="text-h2 font-bold text-text-primary">가게 등록</h1>
        </header>

        {/* 외곽 컨테이너 — w-fit + mx-auto, 상단(썸네일+상세이미지)이 폭을 결정 */}
        <div className="mx-auto flex w-fit max-w-full flex-col gap-0">
          {/* 상단 ROW — 썸네일 + 상세 이미지 */}
          <div className="flex flex-col items-start gap-lg lg:flex-row lg:gap-3xl">
            <section className="flex flex-col gap-sm lg:w-fit lg:shrink-0">
              <SectionHeader title="썸네일 이미지" hint="5 : 4" />
              <ShopThumbnailField
                src={thumbUrl}
                editing
                onSelect={setThumbnail}
                onRemove={() => setThumbnail(null)}
                alt={form.name}
              />
            </section>

            <section className="flex flex-col gap-sm lg:w-fit">
              <SectionHeader title="상세 이미지" hint="16 : 9" />
              <ShopGalleryField
                items={detailImages.map((f, i) => ({ key: String(i), url: detailUrls[i] }))}
                editing
                onAdd={(f) => setDetailImages((prev) => [...prev, f])}
                onRemove={(key) => setDetailImages((prev) => prev.filter((_, idx) => String(idx) !== key))}
                alt={form.name}
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
                  value: (
                    <EditInput
                      value={form.name}
                      onChange={setInput('name')}
                      placeholder="가게 이름을 입력하세요"
                    />
                  ),
                },
                {
                  label: '카테고리',
                  value: <CategorySelect value={form.category} onChange={(v) => update('category', v)} />,
                },
                {
                  label: '주소',
                  value: (
                    <EditInput
                      value={form.address}
                      onChange={setInput('address')}
                      placeholder="주소를 입력하세요"
                    />
                  ),
                },
                {
                  label: '전화',
                  value: (
                    <PhoneInput
                      value={form.phoneNumber}
                      onChange={(v) => update('phoneNumber', v)}
                    />
                  ),
                },
                { label: '영업 요일', value: <WeekdayToggle value={weekdays} onChange={setWeekdays} /> },
                {
                  label: '오픈 시간',
                  value: <TimeSelect value={form.openTime} onChange={(v) => update('openTime', v)} />,
                },
                {
                  label: '마감 시간',
                  value: <TimeSelect value={form.closeTime} onChange={(v) => update('closeTime', v)} />,
                },
                {
                  label: '가게 설명',
                  value: (
                    <EditInput
                      value={form.description}
                      onChange={setInput('description')}
                      placeholder="가게 소개를 한 줄로 적어주세요 (선택)"
                    />
                  ),
                },
              ]}
            />
            {Object.values(errors).filter(Boolean).length > 0 && (
              <p className="mt-xs text-body font-normal text-status-critical">
                {Object.values(errors).filter(Boolean).join(' · ')}
              </p>
            )}
          </section>

          {/* 중앙 액션 */}
          <div className="mt-xs flex flex-col items-center gap-sm">
            <ActionButton onClick={handleSubmit} disabled={submitting} className="w-full max-w-[420px]">
              {submitting ? '등록 중...' : '등록'}
            </ActionButton>
          </div>
        </div>
      </main>

      <ConfirmDialog
        open={doneOpen}
        title="가게가 등록됐어요"
        description="이제 매장 관리 페이지에서 정보를 확인하고 관리할 수 있어요."
        confirmLabel="확인"
        hideCancel
        onConfirm={() => {
          setDoneOpen(false)
          nav('/admin/shops', { replace: true })
        }}
      />
      <ConfirmDialog
        open={errorOpen}
        title="알림"
        description={errorMsg}
        confirmLabel="확인"
        hideCancel
        onConfirm={() => {
          setErrorOpen(false)
          if (errorMsg.includes('가게는 등록됐지만')) nav('/admin/shops', { replace: true })
        }}
      />
    </div>
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
