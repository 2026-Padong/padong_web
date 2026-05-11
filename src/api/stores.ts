import { apiGet, apiPost } from './client'
import type { ResponseDTO } from './contracts/auth'
import type { PageResponse } from './likes'

// 백엔드 spec: GET /stores/mine (ADMIN 전용)
// 마이페이지 '내 가게 관리' — 최신 등록순(PK DESC) 페이징
export interface StoreRegistrationResponse {
  id: number
  name: string
  address: string
  phoneNumber: string
  openTime: string
  closeTime: string
  likeCount: number
  likedByCurrentUser: boolean
}

export async function fetchMyStores(
  page = 0,
  size = 20,
): Promise<PageResponse<StoreRegistrationResponse>> {
  const res = await apiGet<ResponseDTO<PageResponse<StoreRegistrationResponse>>>(
    '/stores/mine',
    { page, size },
  )
  return res.data
}

export interface CreateStoreRequest {
  name: string
  address: string
  phoneNumber: string
  openTime: string // 'HH:mm' or 'HH:mm:ss'
  closeTime: string
}

// 백엔드 spec: POST /stores (ADMIN 전용) — 쿼리 파라미터로 전달
export async function createStore(req: CreateStoreRequest): Promise<StoreRegistrationResponse> {
  const qs = new URLSearchParams({
    name: req.name,
    address: req.address,
    phoneNumber: req.phoneNumber,
    openTime: req.openTime,
    closeTime: req.closeTime,
  }).toString()
  const res = await apiPost<ResponseDTO<StoreRegistrationResponse>>(`/stores?${qs}`, null)
  return res.data
}
