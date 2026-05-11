import { useState } from 'react'
import { useNavigate } from 'react-router'
import { HeaderNav } from '@/components/layout/HeaderNav'
import { AdminDongSelect } from '@/features/auth/components/AdminDongSelect'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { useAuth } from '@/lib/auth'
import { updateAdminDong } from '@/api/auth'

// 내 동네(거주 행정동) 변경
export function MyAdminDongPage() {
  const nav = useNavigate()
  const { user, refreshUser } = useAuth()
  const [selectedId, setSelectedId] = useState<number | undefined>(user?.adminDongId)
  const [submitting, setSubmitting] = useState(false)
  const [doneOpen, setDoneOpen] = useState(false)
  const [errorOpen, setErrorOpen] = useState(false)

  if (!user) {
    nav('/login', { replace: true })
    return null
  }

  const handleSave = async () => {
    if (selectedId === undefined) return
    setSubmitting(true)
    try {
      await updateAdminDong(selectedId)
      await refreshUser()
      setDoneOpen(true)
    } catch (e) {
      console.error('[admin-dong] update failed:', e)
      setErrorOpen(true)
    } finally {
      setSubmitting(false)
    }
  }

  const changed = selectedId !== undefined && selectedId !== user.adminDongId

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
          <h1 className="text-h2 font-bold text-text-primary">내 동네 설정</h1>
        </header>

        {user.adminDongName && (
          <p className="text-body-l font-normal text-text-secondary">
            현재 내 동네 · <span className="font-bold text-text-primary">{user.adminDongName}</span>
          </p>
        )}

        <AdminDongSelect
          label="새 거주 행정동"
          selectedDongId={selectedId}
          onChange={setSelectedId}
        />

        <button
          type="button"
          onClick={handleSave}
          disabled={!changed || submitting}
          className="w-full cursor-pointer rounded-md bg-brand-primary py-sm text-body-l font-bold text-neutral-white drop-shadow-[0px_4px_24px_rgba(37,88,232,0.14)] transition-colors hover:bg-brand-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting ? '저장 중...' : '저장'}
        </button>
      </main>

      <ConfirmDialog
        open={doneOpen}
        title="내 동네가 변경됐어요"
        confirmLabel="확인"
        hideCancel
        onConfirm={() => {
          setDoneOpen(false)
          nav('/mypage')
        }}
      />
      <ConfirmDialog
        open={errorOpen}
        title="변경에 실패했어요"
        description="잠시 후 다시 시도해주세요."
        confirmLabel="확인"
        hideCancel
        onConfirm={() => setErrorOpen(false)}
      />
    </div>
  )
}
