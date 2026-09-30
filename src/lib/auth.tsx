import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { fetchMeDetail, logoutApi } from '@/api/auth'
import type { UserDetailResponse } from '@/api/contracts/auth'
import { tokenStore } from '@/api/client'
import type { Role } from '@/api/contracts/auth'

// 인증 사용자 — Spring /auth/me-detail 응답을 평탄화
export interface User {
  name: string
  userId: number
  role: Role
  email?: string
  picture?: string
  adminDongId?: number
  adminDongName?: string
  approved?: boolean
}

function toUser(detail: UserDetailResponse): User {
  return {
    name: detail.nickname,
    userId: detail.userId,
    role: detail.role,
    email: detail.email,
    picture: detail.picture,
    adminDongId: detail.adminDong?.id,
    adminDongName: detail.adminDong?.name,
    approved: detail.approved,
  }
}

interface AuthContextValue {
  user: User | null
  loginWithTokens: (
    user: User,
    tokens: { accessToken: string; refreshToken: string },
  ) => void
  /** 백엔드 user 상세 다시 가져와 user state 갱신 (행정동 변경 등 후) */
  refreshUser: () => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)
const USER_CACHE_KEY = 'padong.auth.user'

export function AuthProvider({ children }: { children: ReactNode }) {
  // 초기값 — localStorage UI 캐시
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window === 'undefined') return null
    const stored = window.localStorage.getItem(USER_CACHE_KEY)
    if (!stored) return null
    try {
      return JSON.parse(stored) as User
    } catch {
      return null
    }
  })

  // user 캐시 sync
  useEffect(() => {
    if (user) window.localStorage.setItem(USER_CACHE_KEY, JSON.stringify(user))
    else window.localStorage.removeItem(USER_CACHE_KEY)
  }, [user])

  const refreshUser = useCallback(async () => {
    if (!tokenStore.getAccess()) return
    try {
      const detail = await fetchMeDetail()
      setUser(toUser(detail))
    } catch (e) {
      console.error('[auth] fetchMeDetail failed:', e)
      tokenStore.clear()
      setUser(null)
    }
  }, [])

  // 마운트 시 백엔드 세션 검증 + user 상세 정보 보강
  useEffect(() => {
    void refreshUser()
  }, [refreshUser])

  const loginWithTokens = useCallback<AuthContextValue['loginWithTokens']>((u, tokens) => {
    tokenStore.set(tokens.accessToken, tokens.refreshToken)
    setUser(u)
  }, [])

  const logout = useCallback(async () => {
    try {
      await logoutApi()
    } catch (e) {
      console.error('[auth] logout api failed:', e)
    }
    tokenStore.clear()
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({ user, loginWithTokens, refreshUser, logout }),
    [user, loginWithTokens, refreshUser, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
