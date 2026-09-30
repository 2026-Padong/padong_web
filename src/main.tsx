import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import App from './App.tsx'
import { queryClient } from '@/api/queryClient'
import { AuthProvider } from '@/lib/auth'

async function enableMocking() {
  if (!import.meta.env.DEV) return

  const apiBase =
    (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? 'http://localhost:8080'
  const useMocks = import.meta.env.VITE_USE_MOCKS !== 'false'

  if (!useMocks) {
    console.info(
      '%c⛔ MOCK OFF %c실 백엔드 사용  →  %s',
      'background:#c72e2e;color:#fff;padding:2px 6px;border-radius:3px;font-weight:bold',
      'color:#585858',
      apiBase,
    )
    // 이전 세션에서 등록된 MSW Service Worker 정리 (multipart body 손상 방지)
    if ('serviceWorker' in navigator) {
      const regs = await navigator.serviceWorker.getRegistrations()
      for (const r of regs) {
        if (r.active?.scriptURL.includes('mockServiceWorker.js')) {
          await r.unregister()
          console.info('[msw] previous service worker unregistered')
        }
      }
    }
    return
  }

  const { worker } = await import('@/mocks/browser')
  await worker.start({ onUnhandledRequest: 'bypass' })
  console.info(
    '%c✅ MOCK ON %cMSW 활성 — 일부만 mock, 나머지는 %s 로 bypass',
    'background:#218c45;color:#fff;padding:2px 6px;border-radius:3px;font-weight:bold',
    'color:#585858',
    apiBase,
  )
  console.info(
    '%cMocked endpoints:%c\n' +
      '  ✓ GET  /stores            (목록)\n' +
      '  ✓ GET  /stores/:id        (상세)\n' +
      '  ✓ POST /stores/likes      (좋아요 토글)\n' +
      '  ✓ GET  /dongs/search      (자동완성)\n' +
      '  ✓ GET  /neighborhoods/*   (맞춤 동네 찾기)\n' +
      '  ✓ GET  /preferences/*     (취향 설문)\n' +
      '  → POST /auth/signup       passthrough (multipart 손상 회피)\n' +
      '  → POST /auth/upgrade-admin passthrough\n' +
      '\n' +
      'Bypassed (실 백엔드 직행):\n' +
      '  · /auth/me, /auth/me-detail, /auth/logout, /auth/reissue, DELETE /auth/me\n' +
      '  · /dongne/admin-dongs, /dongne/detail, /dongne/likes/*\n' +
      '  · /stores POST/PUT/DELETE, /stores/mine, /stores/likes/me\n' +
      '  · /menus, /rent-price/*, /path/*, /mobility/* 등',
    'color:#2457e8;font-weight:bold',
    'color:#585858;font-size:11px',
  )
}

void enableMocking().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </QueryClientProvider>
    </StrictMode>,
  )
})
