import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { useAuth } from '@/lib/auth'

// Spring Security OAuth2SuccessHandler가 redirect하는 콜백 페이지
// 4가지 케이스:
//   1) ?signupRequired=true&requestedRole=&kakaoId=&nickname=&picture=&email=  → /signup
//   2) ?roleMismatch=true&actualRole=&requestedRole=                          → 다른 로그인 페이지 안내
//   3) ?pendingApproval=true                                                   → ADMIN 승인 대기
//   4) ?accessToken=&refreshToken=&userId=&nickname=&role=                     → 토큰 저장 + 홈
type View = 'loading' | 'pendingApproval' | 'mismatch'

export function KakaoCallbackPage() {
  const nav = useNavigate()
  const [params] = useSearchParams()
  const { loginWithTokens, refreshUser } = useAuth()
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [view, setView] = useState<View>('loading')
  const [mismatchInfo, setMismatchInfo] = useState<{
    actualRole: string
    requestedRole: string
  } | null>(null)

  useEffect(() => {
    const error = params.get('error') ?? params.get('error_description')
    if (error) {
      console.error('[oauth callback] error:', error)
      setErrorMsg('로그인이 취소되었거나 실패했어요')
      return
    }

    // case 1 — 신규 가입자
    if (params.get('signupRequired') === 'true') {
      const next = new URLSearchParams()
      for (const k of ['kakaoId', 'nickname', 'picture', 'email', 'requestedRole']) {
        const v = params.get(k)
        if (v) next.set(k === 'requestedRole' ? 'role' : k, v)
      }
      nav(`/signup?${next.toString()}`, { replace: true })
      return
    }

    // case 2 — role mismatch
    if (params.get('roleMismatch') === 'true') {
      setMismatchInfo({
        actualRole: params.get('actualRole') ?? 'USER',
        requestedRole: params.get('requestedRole') ?? 'USER',
      })
      setView('mismatch')
      return
    }

    // case 3 — ADMIN 승인 대기
    if (params.get('pendingApproval') === 'true') {
      setView('pendingApproval')
      return
    }

    // case 4 — 정상 로그인
    const accessToken = params.get('accessToken')
    const refreshToken = params.get('refreshToken')
    const userIdRaw = params.get('userId')
    const nickname = params.get('nickname')
    const roleRaw = params.get('role')

    if (accessToken && refreshToken && userIdRaw) {
      // 1) 토큰 + 기본 정보 즉시 저장 (UI 빠르게)
      loginWithTokens(
        {
          name: nickname ?? `회원${userIdRaw}`,
          userId: Number(userIdRaw),
          role: roleRaw === 'ADMIN' ? 'ADMIN' : 'USER',
        },
        { accessToken, refreshToken },
      )
      // 2) /auth/me-detail로 email/picture/adminDong 등 보강 후 홈 이동
      void refreshUser().finally(() => nav('/', { replace: true }))
      return
    }

    setErrorMsg('로그인 응답을 해석할 수 없어요')
  }, [params, nav, loginWithTokens, refreshUser])

  return (
    <div className="flex min-h-screen items-center justify-center px-md">
      {errorMsg ? (
        <div className="flex flex-col items-center gap-md text-center">
          <p className="text-body-l font-bold text-status-critical">{errorMsg}</p>
          <button
            type="button"
            onClick={() => nav('/login', { replace: true })}
            className="cursor-pointer rounded-md bg-brand-primary px-md py-sm text-body-l font-bold text-neutral-white hover:bg-brand-primary-hover"
          >
            로그인 페이지로
          </button>
        </div>
      ) : view === 'mismatch' && mismatchInfo ? (
        <RoleMismatchView info={mismatchInfo} nav={nav} />
      ) : view === 'pendingApproval' ? (
        <div className="flex max-w-[400px] flex-col items-center gap-md text-center">
          <h1 className="text-h2 font-bold text-text-primary">관리자 승인 대기 중</h1>
          <p className="text-body-l font-normal text-text-secondary">
            관리자 계정 신청이 접수되었어요. 승인이 완료되면 로그인할 수 있어요.
          </p>
          <button
            type="button"
            onClick={() => nav('/', { replace: true })}
            className="cursor-pointer rounded-md bg-brand-primary px-md py-sm text-body-l font-bold text-neutral-white hover:bg-brand-primary-hover"
          >
            홈으로
          </button>
        </div>
      ) : (
        <p className="text-body-l text-text-secondary">로그인 처리 중...</p>
      )}
    </div>
  )
}

function RoleMismatchView({
  info,
  nav,
}: {
  info: { actualRole: string; requestedRole: string }
  nav: ReturnType<typeof useNavigate>
}) {
  const wantedAdmin = info.requestedRole === 'ADMIN'
  const actuallyAdmin = info.actualRole === 'ADMIN'

  const title = wantedAdmin
    ? '사장님 계정이 아니에요'
    : '사장님 계정으로 등록된 사용자에요'
  const desc = wantedAdmin
    ? '일반 사용자로 가입된 계정이에요. 일반 로그인을 이용해주세요.'
    : '사장님으로 가입된 계정이에요. 사장님 로그인을 이용해주세요.'
  const targetPath = actuallyAdmin ? '/admin/login' : '/login'
  const targetLabel = actuallyAdmin ? '사장님 로그인으로' : '일반 로그인으로'

  return (
    <div className="flex max-w-[400px] flex-col items-center gap-md text-center">
      <h1 className="text-h2 font-bold text-text-primary">{title}</h1>
      <p className="text-body-l font-normal text-text-secondary">{desc}</p>
      <button
        type="button"
        onClick={() => nav(targetPath, { replace: true })}
        className="cursor-pointer rounded-md bg-brand-primary px-md py-sm text-body-l font-bold text-neutral-white hover:bg-brand-primary-hover"
      >
        {targetLabel}
      </button>
    </div>
  )
}
