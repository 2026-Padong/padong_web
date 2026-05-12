import { apiGet, apiPost } from './client'
import type { ResponseDTO } from './contracts/auth'
import type { PageResponse } from './likes'
import type { ShopSummaryResponse } from './contracts/shops'

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

// 백엔드 spec: POST /stores/likes?storeId={id} — JWT 필수, userId 는 토큰에서 추출
// 같은 사용자가 같은 가게에 다시 호출하면 좋아요 취소
export interface StoreLikeToggleResponse {
  storeId: number
  userId: number
  liked: boolean
  likeCount: number
}

export async function toggleStoreLike(storeId: number): Promise<StoreLikeToggleResponse> {
  const res = await apiPost<ResponseDTO<StoreLikeToggleResponse>>(
    `/stores/likes?storeId=${storeId}`,
    null,
  )
  return res.data
}

// 랜덤 가게 — 메인페이지 공동구매 섹션용 (인증 불필요)
// 백엔드 spec: GET /stores/random?size=N → ResponseDTO<ShopSummaryResponse[]>
// 응답은 PageResponse 가 아니라 flat array
export async function fetchRandomStores(size = 3): Promise<ShopSummaryResponse[]> {
  const res = await apiGet<ResponseDTO<ShopSummaryResponse[]>>('/stores/random', { size })
  return res.data ?? []
}
