// 로그인 후 원래 위치로 복귀시키기 위한 returnUrl 보관/사용 헬퍼
// OAuth 풀페이지 리다이렉트(KakaoCallback) 사이에서도 살아남아야 해서 sessionStorage 사용
const KEY = 'padong.auth.returnUrl'

export function saveReturnUrl(path: string): void {
  if (typeof window === 'undefined') return
  // /login, /signup, /auth 경로는 저장하지 않음 (무한 루프 방지)
  if (path.startsWith('/login') || path.startsWith('/signup') || path.startsWith('/auth/')) {
    return
  }
  window.sessionStorage.setItem(KEY, path)
}

export function popReturnUrl(): string | null {
  if (typeof window === 'undefined') return null
  const v = window.sessionStorage.getItem(KEY)
  if (v) window.sessionStorage.removeItem(KEY)
  return v
}
