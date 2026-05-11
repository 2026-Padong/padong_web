// 카카오 로그인 트리거 — Spring Security OAuth2가 전 과정 처리
// role(USER/ADMIN) query를 백엔드에 전달 → OAuth2SuccessHandler가 분기
import type { Role } from '@/api/contracts/auth'

export function triggerKakaoLogin(role: Role = 'USER') {
  const origin =
    (import.meta.env.VITE_API_BASE_URL as string | undefined) ??
    (import.meta.env.DEV ? 'http://localhost:8080' : '')
  const url = new URL(`${origin}/oauth2/authorization/kakao`)
  url.searchParams.set('role', role)
  window.location.href = url.toString()
}
