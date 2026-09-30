import { useNavigate } from 'react-router'
import { HeaderNav } from '@/components/layout/HeaderNav'
import { triggerKakaoLogin } from '@/lib/kakaoAuth'
import kakaoLoginImg from '@/assets/kakao-login.png'

// 사장님 로그인 페이지 — 카카오 OAuth ?role=ADMIN
// 일반 사용자 로그인은 /login
export function AdminLoginPage() {
  const nav = useNavigate()

  return (
    <div className="flex min-h-screen flex-col bg-neutral-white">
      <HeaderNav hideAuth />
      <main className="mx-auto flex w-full max-w-[400px] flex-1 flex-col items-stretch justify-center gap-xl px-md py-2xl">
        <header className="flex flex-col items-center gap-xs">
          <h1 className="text-h1 font-bold text-text-primary">사장님으로 로그인</h1>
          <p className="text-body-l font-normal text-text-tertiary">
            내 가게가 등록된 카카오 계정으로 로그인해주세요
          </p>
        </header>

        <button
          type="button"
          onClick={() => triggerKakaoLogin('ADMIN')}
          aria-label="사장님 카카오 로그인"
          className="cursor-pointer rounded-md transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FEE500]"
        >
          <img src={kakaoLoginImg} alt="카카오 로그인" className="mx-auto h-auto" />
        </button>

        <div className="flex flex-col items-center gap-xs text-center text-body font-normal text-text-tertiary">
          <span>사장님이 아니에요</span>
          <button
            type="button"
            onClick={() => nav('/login', { viewTransition: true })}
            className="cursor-pointer font-bold text-brand-primary hover:underline"
          >
            일반 로그인
          </button>
        </div>
      </main>
    </div>
  )
}
