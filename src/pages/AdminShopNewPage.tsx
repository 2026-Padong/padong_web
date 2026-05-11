import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { HeaderNav } from '@/components/layout/HeaderNav'
import { TextField } from '@/components/ui/TextField'
import { TimePicker } from '@/components/ui/TimePicker'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { useAuth } from '@/lib/auth'
import { createStore } from '@/api/stores'

interface FormState {
  name: string
  address: string
  phoneNumber: string
  openTime: string
  closeTime: string
}
type FormErrors = Partial<Record<keyof FormState, string>>

// 사장님 전용 — 가게 등록 폼
export function AdminShopNewPage() {
  const nav = useNavigate()
  const { user } = useAuth()

  const [form, setForm] = useState<FormState>({
    name: '',
    address: '',
    phoneNumber: '',
    openTime: '',
    closeTime: '',
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitting, setSubmitting] = useState(false)
  const [doneOpen, setDoneOpen] = useState(false)
  const [errorOpen, setErrorOpen] = useState(false)

  useEffect(() => {
    if (!user) nav('/login', { replace: true })
    else if (user.role !== 'ADMIN') nav('/mypage', { replace: true })
    else if (user.approved === false) nav('/admin/shops', { replace: true })
  }, [user, nav])

  if (!user) return null

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((p) => ({ ...p, [key]: value }))
    if (errors[key]) setErrors((p) => ({ ...p, [key]: undefined }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const next: FormErrors = {}
    if (!form.name.trim()) next.name = '가게명을 입력해주세요'
    if (!form.address.trim()) next.address = '주소를 입력해주세요'
    if (!form.phoneNumber.trim()) next.phoneNumber = '전화번호를 입력해주세요'
    if (!form.openTime) next.openTime = '오픈 시간을 선택해주세요'
    if (!form.closeTime) next.closeTime = '마감 시간을 선택해주세요'
    if (Object.keys(next).length) {
      setErrors(next)
      return
    }
    setSubmitting(true)
    try {
      await createStore(form)
      setDoneOpen(true)
    } catch (e) {
      console.error('[store:create] failed:', e)
      setErrorOpen(true)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-surface-subtle/40">
      <HeaderNav user={user} onMyPage={() => nav('/mypage')} />
      <main className="mx-auto flex w-full max-w-[640px] flex-1 flex-col gap-lg px-md py-2xl">
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

        <p className="text-body-l font-normal text-text-secondary">
          가게 기본 정보를 입력해주세요. 등록 후 메뉴와 상세 정보는 별도로 추가할 수 있어요.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-md">
          <TextField
            label="가게명"
            value={form.name}
            onChange={(v) => update('name', v)}
            placeholder="예: 파동 식당"
            invalid={!!errors.name}
            hint={errors.name}
          />
          <TextField
            label="주소"
            value={form.address}
            onChange={(v) => update('address', v)}
            placeholder="도로명 또는 지번 주소"
            invalid={!!errors.address}
            hint={errors.address}
          />
          <TextField
            label="전화번호"
            type="tel"
            value={form.phoneNumber}
            onChange={(v) => update('phoneNumber', v)}
            placeholder="예: 02-1234-5678"
            invalid={!!errors.phoneNumber}
            hint={errors.phoneNumber}
          />
          <div className="flex gap-md">
            <TimePicker
              label="오픈 시간"
              value={form.openTime}
              onChange={(v) => update('openTime', v)}
              invalid={!!errors.openTime}
              hint={errors.openTime}
            />
            <TimePicker
              label="마감 시간"
              value={form.closeTime}
              onChange={(v) => update('closeTime', v)}
              invalid={!!errors.closeTime}
              hint={errors.closeTime}
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="mt-xs w-full cursor-pointer rounded-md bg-brand-primary py-sm text-body-l font-bold text-neutral-white drop-shadow-[0px_4px_24px_rgba(37,88,232,0.14)] transition-colors hover:bg-brand-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? '등록 중...' : '등록'}
          </button>
        </form>
      </main>

      <ConfirmDialog
        open={doneOpen}
        title="가게가 등록됐어요"
        description="이제 가게 관리 페이지에서 정보를 확인하고 관리할 수 있어요."
        confirmLabel="확인"
        hideCancel
        onConfirm={() => {
          setDoneOpen(false)
          nav('/admin/shops', { replace: true })
        }}
      />
      <ConfirmDialog
        open={errorOpen}
        title="등록에 실패했어요"
        description="잠시 후 다시 시도해주세요."
        confirmLabel="확인"
        hideCancel
        onConfirm={() => setErrorOpen(false)}
      />
    </div>
  )
}
