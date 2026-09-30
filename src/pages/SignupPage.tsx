import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { HeaderNav } from '@/components/layout/HeaderNav'
import { TextField } from '@/components/ui/TextField'
import { ImageUpload } from '@/components/ui/ImageUpload'
import { AdminDongPicker } from '@/features/auth/components/AdminDongPicker'
import { signupOrLogin } from '@/api/auth'
import { useAuth } from '@/lib/auth'
import { popReturnUrl } from '@/lib/loginRedirect'
import type { Role } from '@/api/contracts/auth'

// 신규 가입 페이지 — 카카오 OAuth 후 백엔드가 signupRequired=true로 redirect
// role(USER/ADMIN)은 LoginPage 입구 선택 시 sessionStorage에 저장 → callback이 query로 전달
// USER: 닉네임만 / ADMIN: 닉네임 + 행정동 ID + 사업자등록증 URL (관리자 승인 대기)
export function SignupPage() {
  const nav = useNavigate()
  const [params] = useSearchParams()
  const { loginWithTokens } = useAuth()

  const kakaoIdRaw = params.get('kakaoId')
  const initialNickname = params.get('nickname') ?? ''
  const email = params.get('email') ?? ''
  const picture = params.get('picture') ?? ''
  const role = (params.get('role') === 'ADMIN' ? 'ADMIN' : 'USER') as Role
  const isAdmin = role === 'ADMIN'

  const [nickname, setNickname] = useState(initialNickname)
  const [adminDongId, setAdminDongId] = useState<number | undefined>(undefined)
  const [licenseFile, setLicenseFile] = useState<File | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState<{ nickname?: string; adminDongId?: string; licenseUrl?: string }>({})

  useEffect(() => {
    if (!kakaoIdRaw) nav('/login', { replace: true })
  }, [kakaoIdRaw, nav])

  if (!kakaoIdRaw) return null
  const kakaoId = Number(kakaoIdRaw)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const next: typeof errors = {}
    if (!nickname.trim()) next.nickname = '닉네임을 입력해주세요'
    // USER만 거주 행정동 필수 (백엔드 검증)
    if (!isAdmin && adminDongId === undefined) {
      next.adminDongId = '자치구와 행정동을 선택해주세요'
    }
    if (isAdmin && !licenseFile) {
      next.licenseUrl = '사업자 등록증을 업로드해주세요'
    }
    if (Object.keys(next).length) {
      setErrors(next)
      return
    }
    setErrors({})
    setSubmitting(true)
    try {
      const res = await signupOrLogin(
        {
          kakaoId,
          nickname,
          email: email || undefined,
          picture: picture || undefined,
          role,
          adminDongId: isAdmin ? undefined : adminDongId,
        },
        isAdmin ? licenseFile : null,
      )
      // ADMIN 신청 시 승인 대기 흐름
      if (isAdmin && !res.approved) {
        nav('/auth/kakao/callback?pendingApproval=true', { replace: true })
        return
      }
      loginWithTokens(
        { name: nickname, userId: res.userId, role: res.role },
        { accessToken: res.accessToken, refreshToken: res.refreshToken },
      )
      const returnUrl = popReturnUrl()
      nav(returnUrl ?? '/', { replace: true })
    } catch (e) {
      console.error('[signup] failed:', e)
      setErrors({ nickname: '회원가입에 실패했어요. 다시 시도해주세요' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-neutral-white">
      <HeaderNav hideAuth />
      <main className="mx-auto flex w-full max-w-[400px] flex-1 flex-col items-stretch justify-center gap-xl px-md py-2xl">
        <header className="flex flex-col items-center gap-xs">
          <h1 className="text-h1 font-bold text-text-primary">
            {isAdmin ? '사장님 가입' : '회원가입'}
          </h1>
          <p className="text-body-l font-normal text-text-tertiary">
            {isAdmin ? '관리자 승인이 필요해요' : '간단한 정보만 입력해주세요'}
          </p>
        </header>

        <form onSubmit={handleSubmit} className="flex flex-col gap-md">
          <TextField
            label="닉네임"
            type="text"
            value={nickname}
            onChange={(v) => {
              setNickname(v)
              if (errors.nickname) setErrors((p) => ({ ...p, nickname: undefined }))
            }}
            invalid={!!errors.nickname}
            hint={errors.nickname}
          />

          {email && (
            <TextField label="이메일" type="email" value={email} disabled hint="카카오 계정 이메일" />
          )}

          {!isAdmin && (
            <AdminDongPicker
              label="거주 행정동"
              selectedDongId={adminDongId}
              onChange={(id) => {
                setAdminDongId(id)
                if (errors.adminDongId) setErrors((p) => ({ ...p, adminDongId: undefined }))
              }}
              invalid={!!errors.adminDongId}
              hint={errors.adminDongId}
            />
          )}

          {isAdmin && (
            <ImageUpload
              label="사업자 등록증"
              value={licenseFile}
              onChange={(file) => {
                setLicenseFile(file)
                if (errors.licenseUrl) setErrors((p) => ({ ...p, licenseUrl: undefined }))
              }}
              invalid={!!errors.licenseUrl}
              hint={errors.licenseUrl ?? '이미지(jpg, png, webp) 또는 PDF, 5MB 이하'}
            />
          )}

          <button
            type="submit"
            disabled={submitting}
            className="mt-xs w-full cursor-pointer rounded-md bg-brand-primary py-sm text-body-l font-bold text-neutral-white drop-shadow-[0px_4px_24px_rgba(37,88,232,0.14)] transition-colors hover:bg-brand-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? '가입 중...' : isAdmin ? '사장님 신청' : '가입 완료'}
          </button>

          {isAdmin && (
            <p className="text-center text-body font-normal text-text-tertiary">
              신청 후 관리자 승인 시까지 로그인이 제한됩니다.
            </p>
          )}
        </form>
      </main>
    </div>
  )
}
