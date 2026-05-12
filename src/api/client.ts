// HTTP fetch wrapper — JWT 자동 첨부 + 401 시 refresh 1회 재시도
// VITE_API_BASE_URL 미설정 시 dev fallback: Spring localhost:8080
const BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ??
  (import.meta.env.DEV ? 'http://localhost:8080' : '')

// JWT 토큰 스토리지 — auth context에서 set/clear
const TOKEN_KEYS = {
  access: 'padong.auth.accessToken',
  refresh: 'padong.auth.refreshToken',
}
export const tokenStore = {
  getAccess: () => window.localStorage.getItem(TOKEN_KEYS.access),
  getRefresh: () => window.localStorage.getItem(TOKEN_KEYS.refresh),
  set: (access: string, refresh: string) => {
    window.localStorage.setItem(TOKEN_KEYS.access, access)
    window.localStorage.setItem(TOKEN_KEYS.refresh, refresh)
  },
  clear: () => {
    window.localStorage.removeItem(TOKEN_KEYS.access)
    window.localStorage.removeItem(TOKEN_KEYS.refresh)
  },
}

export class ApiError extends Error {
  status: number
  payload: unknown

  constructor(status: number, payload: unknown, msg?: string) {
    super(msg ?? `HTTP ${status}`)
    this.name = 'ApiError'
    this.status = status
    this.payload = payload
  }
}

async function safeJson(res: Response): Promise<unknown> {
  try {
    return await res.json()
  } catch {
    return null
  }
}

async function parseBody<T>(res: Response): Promise<T> {
  if (res.status === 204) return undefined as T
  const text = await res.text()
  if (!text) return undefined as T
  return JSON.parse(text) as T
}

// reissue 호출 시 무한 루프 방지용 in-flight promise
let inflightRefresh: Promise<string | null> | null = null

async function tryRefresh(): Promise<string | null> {
  if (inflightRefresh) return inflightRefresh
  const refresh = tokenStore.getRefresh()
  if (!refresh) return null
  inflightRefresh = (async () => {
    try {
      const res = await fetch(`${BASE_URL}/auth/reissue`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: refresh }),
      })
      if (!res.ok) {
        tokenStore.clear()
        return null
      }
      const data = (await res.json()) as { data?: { accessToken: string; refreshToken: string } }
      const next = data.data
      if (!next?.accessToken) {
        tokenStore.clear()
        return null
      }
      tokenStore.set(next.accessToken, next.refreshToken)
      return next.accessToken
    } finally {
      inflightRefresh = null
    }
  })()
  return inflightRefresh
}

async function request<T>(input: string, init: RequestInit, retry = true): Promise<T> {
  const access = tokenStore.getAccess()
  const headers = new Headers(init.headers)
  if (access) headers.set('Authorization', `Bearer ${access}`)
  const res = await fetch(input, { ...init, headers })
  if (res.status === 401 && retry) {
    const newToken = await tryRefresh()
    if (newToken) return request<T>(input, init, false)
  }
  if (!res.ok) {
    const payload = await safeJson(res)
    // 401 은 인증 흐름의 정상 경로 (만료된 JWT 정리, 비로그인 endpoint 시도 등)
    // 호출자가 catch 로 처리하므로 console.error 노이즈 안 찍음
    if (res.status !== 401) {
      console.error(`[api] ${init.method ?? 'GET'} ${input} → ${res.status}`, payload)
    }
    throw new ApiError(res.status, payload)
  }
  return parseBody<T>(res)
}

export function apiGet<T>(
  path: string,
  params?: Record<string, string | number | undefined>,
): Promise<T> {
  const url = new URL(`${BASE_URL}${path}`, window.location.origin)
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== '') url.searchParams.set(k, String(v))
    }
  }
  return request<T>(url.toString(), { method: 'GET' })
}

export function apiPost<T>(path: string, body: unknown): Promise<T> {
  return request<T>(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

export function apiPut<T>(path: string, body: unknown): Promise<T> {
  return request<T>(`${BASE_URL}${path}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

export function apiPatch<T>(path: string, body: unknown): Promise<T> {
  return request<T>(`${BASE_URL}${path}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

// multipart/form-data — Content-Type 미지정 (fetch가 boundary 포함 자동 설정)
export function apiPostMultipart<T>(path: string, formData: FormData): Promise<T> {
  return request<T>(`${BASE_URL}${path}`, {
    method: 'POST',
    body: formData,
  })
}

export function apiPutMultipart<T>(path: string, formData: FormData): Promise<T> {
  return request<T>(`${BASE_URL}${path}`, {
    method: 'PUT',
    body: formData,
  })
}

export function apiDelete<T>(path: string): Promise<T> {
  return request<T>(`${BASE_URL}${path}`, { method: 'DELETE' })
}
