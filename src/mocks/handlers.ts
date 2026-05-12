import { http, passthrough } from 'msw'

// 클라이언트가 BASE_URL = localhost:8080 으로 요청하므로 MSW 핸들러도 동일 origin에 맞춰야 매칭됨
const BASE = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? 'http://localhost:8080'

// ─────────────────────────────────────────────────────────────
// MSW 핸들러 카탈로그 — 거의 모든 백엔드 endpoint 직행, multipart/payment 만 explicit passthrough
//
// [Passthrough — multipart/payment 등 명시 처리]
//   POST /auth/signup, /auth/upgrade-admin
//   PUT  /auth/me
//   POST /payments/prepare, /payments/confirm
//
// [Bypass — 핸들러 없음, 실 백엔드 직행 (onUnhandledRequest: 'bypass')]
//   /stores/*, /orders/*, /dongne/*, /dongs/*, /realtime/*, /news/*,
//   /mobility/*, /auth/me-detail, /menus 등 — 백엔드 구현된 모든 endpoint
//
// NOTE: explicit passthrough() 는 React Query rapid-cancel 시 mockServiceWorker
//  가 "Failed to fetch" 오류를 던지는 알려진 이슈로 GET 류엔 사용 X
//
// 취향 질문: 프론트 로컬 상수 (PREFERENCE_QUESTIONS)
// 분석: 백엔드 /dongne/recommendations 직접 호출
// ─────────────────────────────────────────────────────────────

export const handlers = [
  // multipart auth 엔드포인트만 explicit passthrough (FormData 손상 회피)
  http.post(`${BASE}/auth/signup`, () => passthrough()),
  http.post(`${BASE}/auth/upgrade-admin`, () => passthrough()),
  http.put(`${BASE}/auth/me`, () => passthrough()),

  // 결제 엔드포인트 — 실 백엔드 + PortOne 으로 직행
  http.post(`${BASE}/payments/prepare`, () => passthrough()),
  http.post(`${BASE}/payments/confirm`, () => passthrough()),
]
