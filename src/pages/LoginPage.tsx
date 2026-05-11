import { useNavigate } from 'react-router'
import { HeaderNav } from '@/components/layout/HeaderNav'
import { triggerKakaoLogin } from '@/lib/kakaoAuth'
import kakaoLoginImg from '@/assets/kakao-login.png'

// 로그인 페이지 — 입구 분리 패턴
// 일반 사용자: 카카오 로그인 (signup 시 USER role 자동)
// 사장님: "사장님으로 시작하기" → 같은 카카오 OAuth지만 signup 시 ADMIN 흐름으로 분기
export function LoginPage() {
  const nav = useNavigate()

  return (
    <div className="flex min-h-screen flex-col bg-neutral-white">
      <HeaderNav hideAuth />
      <main className="mx-auto flex w-full max-w-[400px] flex-1 flex-col items-stretch justify-center gap-xl px-md py-2xl">
        <header className="flex flex-col items-center">
          <h1 className="text-h1 font-bold text-text-primary">로그인</h1>
        </header>

        {/* 일반 사용자 */}
        <button
          type="button"
          onClick={() => triggerKakaoLogin('USER')}
          aria-label="카카오 로그인"
          className="cursor-pointer rounded-md transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FEE500]"
        >
          <img src={kakaoLoginImg} alt="카카오 로그인" className="mx-auto h-auto" />
        </button>

        {/* 구분선 */}
        <div className="flex items-center gap-md" role="separator" aria-label="또는">
          <div className="h-px flex-1 bg-border-default" />
          <span className="text-body font-normal text-text-tertiary">사장님이신가요?</span>
          <div className="h-px flex-1 bg-border-default" />
        </div>

        {/* 사장님 입구 — 전용 로그인 페이지로 이동 */}
        <button
          type="button"
          onClick={() => nav('/admin/login', { viewTransition: true })}
          className="cursor-pointer rounded-md border border-border-default bg-neutral-white py-sm text-body-l font-bold text-text-primary transition-colors hover:bg-surface-subtle focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
        >
          사장님으로 시작하기
        </button>

        <button
          type="button"
          onClick={() => nav('/', { viewTransition: true })}
          className="cursor-pointer text-center text-body font-normal text-text-tertiary hover:text-text-secondary"
        >
          홈으로
        </button>
      </main>
    </div>
  )
}
