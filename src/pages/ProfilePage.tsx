import { useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { HeaderNav } from '@/components/layout/HeaderNav'
import { TextField } from '@/components/ui/TextField'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { useAuth } from '@/lib/auth'
import { updateMyProfile } from '@/api/auth'

// 마이페이지 > 정보 수정 — 닉네임 + 프로필 사진만 변경 (동네는 별도 페이지)
// 회원가입 폼과 동일 스타일 (max-w-[400px] + TextField + 흰 배경)
const MAX_NICKNAME = 20
const MAX_FILE_BYTES = 5 * 1024 * 1024 // 5MB

export function ProfilePage() {
  const nav = useNavigate()
  const { user, refreshUser } = useAuth()
  const [nickname, setNickname] = useState(user?.name ?? '')
  const [pictureFile, setPictureFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [doneOpen, setDoneOpen] = useState(false)
  const [errors, setErrors] = useState<{
    nickname?: string
    picture?: string
    submit?: string
  }>({})
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  if (!user) {
    nav('/login', { replace: true })
    return null
  }

  const initial = user.name.charAt(0).toUpperCase()
  const trimmed = nickname.trim()
  const nicknameChanged = trimmed.length > 0 && trimmed !== user.name
  const pictureChanged = pictureFile !== null
  const changed = nicknameChanged || pictureChanged
  const displayPicture = previewUrl ?? user.picture
  const isAdmin = user.role === 'ADMIN'

  const handlePickFile = () => fileInputRef.current?.click()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setErrors((p) => ({ ...p, picture: '이미지 파일만 업로드할 수 있어요' }))
      return
    }
    if (file.size > MAX_FILE_BYTES) {
      setErrors((p) => ({ ...p, picture: '5MB 이하 이미지만 업로드할 수 있어요' }))
      return
    }
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setPictureFile(file)
    setPreviewUrl(URL.createObjectURL(file))
    setErrors((p) => ({ ...p, picture: undefined }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const next: typeof errors = {}
    if (!trimmed) next.nickname = '닉네임을 입력해주세요'
    else if (trimmed.length < 2) next.nickname = '닉네임은 2자 이상이어야 해요'
    if (Object.keys(next).length) {
      setErrors(next)
      return
    }
    if (!changed) return
    setErrors({})
    setSubmitting(true)
    try {
      await updateMyProfile({ nickname: trimmed }, pictureFile)
      await refreshUser()
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
        setPreviewUrl(null)
      }
      setPictureFile(null)
      setDoneOpen(true)
    } catch (e) {
      console.error('[profile] update failed:', e)
      setErrors({ submit: '변경에 실패했어요. 잠시 후 다시 시도해주세요.' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-neutral-white">
      <HeaderNav user={user} onMyPage={() => nav('/mypage')} />
      <main className="mx-auto flex w-full max-w-[400px] flex-1 flex-col gap-xl px-md py-2xl">
        <header className="flex items-center gap-sm">
          <button
            type="button"
            onClick={() => nav('/mypage')}
            aria-label="뒤로"
            className="cursor-pointer text-h3 text-text-tertiary hover:text-text-primary"
          >
            ←
          </button>
          <h1 className="text-h2 font-bold text-text-primary">정보 수정</h1>
        </header>

        {/* 프로필 사진 */}
        <section className="flex flex-col items-center gap-sm">
          <button
            type="button"
            onClick={handlePickFile}
            aria-label="프로필 사진 변경"
            className="group relative cursor-pointer rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
          >
            {displayPicture ? (
              <img
                src={displayPicture}
                alt=""
                className="size-[96px] rounded-full object-cover ring-1 ring-border-default"
              />
            ) : (
              <div className="inline-flex size-[96px] items-center justify-center rounded-full bg-brand-primary text-h2 font-bold text-neutral-white">
                {initial}
              </div>
            )}
            <span
              aria-hidden
              className="absolute right-0 bottom-0 inline-flex size-[28px] items-center justify-center rounded-full bg-neutral-white text-body-l font-bold text-text-secondary ring-1 ring-border-default transition-colors group-hover:bg-surface-subtle"
            >
              +
            </span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          <button
            type="button"
            onClick={handlePickFile}
            className="cursor-pointer text-body font-medium text-brand-primary underline-offset-2 hover:underline"
          >
            사진 변경
          </button>
          {errors.picture && (
            <span className="text-body font-normal text-status-critical">{errors.picture}</span>
          )}
        </section>

        <form onSubmit={handleSubmit} className="flex flex-col gap-md">
          <TextField
            label="닉네임"
            type="text"
            value={nickname}
            maxLength={MAX_NICKNAME}
            onChange={(v) => {
              setNickname(v)
              if (errors.nickname) setErrors((p) => ({ ...p, nickname: undefined }))
            }}
            invalid={!!errors.nickname}
            hint={errors.nickname ?? `${trimmed.length}/${MAX_NICKNAME}`}
          />

          {user.email && (
            <TextField label="이메일" type="email" value={user.email} disabled hint="카카오 계정 이메일" />
          )}

          {isAdmin && (
            <TextField label="권한" type="text" value="사장님" disabled />
          )}

          <button
            type="submit"
            disabled={!changed || submitting}
            className="mt-xs w-full cursor-pointer rounded-md bg-brand-primary py-sm text-body-l font-bold text-neutral-white drop-shadow-[0px_4px_24px_rgba(37,88,232,0.14)] transition-colors hover:bg-brand-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? '저장 중...' : '저장'}
          </button>
        </form>
      </main>

      <ConfirmDialog
        open={doneOpen}
        title="정보가 변경됐어요"
        confirmLabel="확인"
        hideCancel
        onConfirm={() => {
          setDoneOpen(false)
          nav('/mypage')
        }}
      />
      <ConfirmDialog
        open={!!errors.submit}
        title="변경에 실패했어요"
        description={errors.submit ?? ''}
        confirmLabel="확인"
        hideCancel
        onConfirm={() => setErrors((p) => ({ ...p, submit: undefined }))}
      />
    </div>
  )
}
