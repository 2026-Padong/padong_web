import { apiGet } from './client'
import type { ResponseDTO } from './contracts/auth'

// 백엔드 PageResponse — content[] + 페이지 메타
export interface PageResponse<T> {
  content: T[]
  page: number
  size: number
  totalElements: number
  totalPages: number
  first: boolean
  last: boolean
  hasNext: boolean
  hasPrevious: boolean
}

export interface LikedDongneResponse {
  likeId: number
  adminDongCode: string
  guName: string
  name: string
}

export interface LikedStoreResponse {
  likeId: number
  storeId: number
  name: string
  roadAddress: string
  category: string
}

export async function fetchMyLikedDongs(): Promise<PageResponse<LikedDongneResponse>> {
  const res = await apiGet<ResponseDTO<PageResponse<LikedDongneResponse>>>('/dongne/likes/me')
  return res.data
}

export async function fetchMyLikedStores(): Promise<PageResponse<LikedStoreResponse>> {
  const res = await apiGet<ResponseDTO<PageResponse<LikedStoreResponse>>>('/stores/likes/me')
  return res.data
}
