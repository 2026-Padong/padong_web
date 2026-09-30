// Spring 백엔드 auth 계약 — /api/auth/* 응답 형식
export type Role = 'USER' | 'ADMIN'

// 공통 응답 래퍼
export interface ResponseDTO<T> {
  statusCode: string
  message: string
  data: T
}

// POST /api/auth/signup
export interface SignUpRequest {
  kakaoId: number
  nickname: string
  email?: string
  picture?: string
  role: Role
  adminDongId?: number
  businessLicenseImageUrl?: string
}

export interface SignUpResponse {
  userId: number
  kakaoId: number
  role: Role
  adminDongCode?: string
  registered: boolean
  approved: boolean
  accessToken: string
  refreshToken: string
}

// POST /api/auth/reissue
export interface ReissueRequest {
  refreshToken: string
}

export interface JwtToken {
  accessToken: string
  refreshToken: string
}

// GET /auth/me-detail → ResponseDTO<UserDetailResponse>
export interface AdminDongRef {
  id: number
  name: string
  guName?: string
  adminDongCode?: string
}

export interface UserDetailResponse {
  userId: number
  nickname: string
  picture?: string
  email?: string
  role: Role
  approved: boolean
  adminDong?: AdminDongRef | null
}

// POST /auth/upgrade-admin
export interface AdminUpgradeRequest {
  businessLicenseImageUrl: string
  adminDongId?: number
}

export interface AdminUpgradeResponse {
  userId: number
  role: Role
  approved: boolean
}
