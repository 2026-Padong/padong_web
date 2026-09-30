import { useState } from 'react'
import { useNavigate } from 'react-router'
import { HeaderNav } from '@/components/layout/HeaderNav'
import { ImageUpload } from '@/components/ui/ImageUpload'
import { AdminDongPicker } from '@/features/auth/components/AdminDongPicker'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { useAuth } from '@/lib/auth'
import { upgradeToAdmin } from '@/api/auth'

// USER → ADMIN 전환 신청 (사장님 등록)
export function UpgradeAdminPage() {
  const nav = useNavigate()
  const { user, refreshUser } = useAuth()
  const [licenseFile, setLicenseFile] = useState<File | null>(null)
  const [adminDongId, setAdminDongId] = useState<number | undefined>(undefined)
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState<{ license?: string }>({})
  const [doneOpen, setDoneOpen] = useState(false)
  const [errorOpen, setErrorOpen] = useState(false)

  if (!user) {
    nav('/login', { replace: true })
    return null
  }

  if (user.role === 'ADMIN') {
    return (
      <div className="flex min-h-screen flex-col bg-surface-subtle/40">
        <HeaderNav user={user} onMyPage={() => nav('/mypage')} />
        <main className="mx-auto flex w-full max-w-[480px] flex-1 flex-col items-center justify-center gap-md px-md text-center">
          <h1 className="text-h2 font-bold text-text-primary">이미 사장님으로 가입돼있어요</h1>
          <button
            type="button"
            onClick={() => nav('/mypage')}
            className="cursor-pointer rounded-md bg-brand-primary px-md py-sm text-body-l font-bold text-neutral-white"
          >
            마이페이지로
          </button>
        </main>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!licenseFile) {
      setErrors({ license: '사업자 등록증을 업로드해주세요' })
      return
    }
    setErrors({})
    setSubmitting(true)
    try {
      await upgradeToAdmin({ adminDongId }, licenseFile)
      await refreshUser()
      setDoneOpen(true)
    } catch (e) {
      console.error('[upgrade-admin] failed:', e)
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
            onClick={() => nav('/mypage')}
            aria-label="뒤로"
            className="cursor-pointer text-h3 text-text-tertiary hover:text-text-primary"
          >
            ←
          </button>
          <h1 className="text-h2 font-bold text-text-primary">사장님 전환 신청</h1>
        </header>

        <p className="text-body-l font-normal text-text-secondary">
          사업자 등록증을 제출하면 관리자 검토 후 승인됩니다. 승인 전에는 사장님 기능을 사용할 수 없어요.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-md">
          <ImageUpload
            label="사업자 등록증"
            value={licenseFile}
            onChange={(file) => {
              setLicenseFile(file)
              if (errors.license) setErrors({})
            }}
            invalid={!!errors.license}
            hint={errors.license ?? '이미지(jpg, png, webp) 또는 PDF, 5MB 이하'}
          />

          <AdminDongPicker
            label="영업 행정동 (선택 — 미입력 시 현재 거주 동네 유지)"
            selectedDongId={adminDongId}
            onChange={setAdminDongId}
            placeholder="현재 거주 동네 유지"
          />

          <button
            type="submit"
            disabled={submitting}
            className="mt-xs w-full cursor-pointer rounded-md bg-brand-primary py-sm text-body-l font-bold text-neutral-white drop-shadow-[0px_4px_24px_rgba(37,88,232,0.14)] transition-colors hover:bg-brand-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? '신청 중...' : '사장님 신청'}
          </button>
        </form>
      </main>

      <ConfirmDialog
        open={doneOpen}
        title="사장님 신청이 접수됐어요"
        description="관리자 승인이 완료되면 사장님 기능을 사용할 수 있어요."
        confirmLabel="확인"
        hideCancel
        onConfirm={() => {
          setDoneOpen(false)
          nav('/mypage')
        }}
      />
      <ConfirmDialog
        open={errorOpen}
        title="신청에 실패했어요"
        description="잠시 후 다시 시도해주세요."
        confirmLabel="확인"
        hideCancel
        onConfirm={() => setErrorOpen(false)}
      />
    </div>
  )
}
