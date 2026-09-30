import { apiDelete, apiGet, apiPatch, apiPost, apiPostMultipart, apiPutMultipart } from './client'
import type { ResponseDTO } from './contracts/auth'
import type { PageResponse } from './likes'
import type {
  CategoryOption,
  ShopSummaryResponse,
  StoreImageReorderRequest,
  StoreImageResponse,
  StoreRegistrationCreateRequest,
  StoreRegistrationUpdateRequest,
} from './contracts/shops'

// 백엔드 spec: GET /stores/mine (ADMIN 전용)
// 마이페이지 '내 가게 관리' — 최신 등록순(PK DESC) 페이징
export interface StoreRegistrationResponse {
  id: number
  name: string
  category: string
  categoryLabel: string
  address: string
  phoneNumber: string
  description: string
  openTime: string
  closeTime: string
  weekdayMask: number
  latitude: number
  longitude: number
  thumbnailUrl: string
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

// 백엔드 spec: POST /stores (ADMIN 전용) — JSON body
export async function createStore(
  req: StoreRegistrationCreateRequest,
): Promise<StoreRegistrationResponse> {
  const res = await apiPost<ResponseDTO<StoreRegistrationResponse>>('/stores', req)
  return res.data
}

// 백엔드 spec: PATCH /stores/{storeId} — 부분 수정 (JSON body)
export async function updateStore(
  storeId: number,
  req: StoreRegistrationUpdateRequest,
): Promise<StoreRegistrationResponse> {
  const res = await apiPatch<ResponseDTO<StoreRegistrationResponse>>(`/stores/${storeId}`, req)
  return res.data
}

// 백엔드 spec: DELETE /stores/{storeId} — soft delete
export async function deleteStore(storeId: number): Promise<void> {
  await apiDelete<ResponseDTO<void>>(`/stores/${storeId}`)
}

// 백엔드 spec: GET /stores/categories — 카테고리 옵션 목록
export async function fetchStoreCategories(): Promise<CategoryOption[]> {
  const res = await apiGet<ResponseDTO<CategoryOption[]>>('/stores/categories')
  return res.data
}

// ─── 썸네일 ────────────────────────────────────────────────────────────────
export async function uploadStoreThumbnail(storeId: number, file: File): Promise<void> {
  const form = new FormData()
  form.append('file', file)
  await apiPutMultipart<ResponseDTO<void>>(`/stores/${storeId}/thumbnail`, form)
}

export async function deleteStoreThumbnail(storeId: number): Promise<void> {
  await apiDelete<ResponseDTO<void>>(`/stores/${storeId}/thumbnail`)
}

// ─── 갤러리 이미지 ────────────────────────────────────────────────────────
export async function fetchStoreImages(storeId: number): Promise<StoreImageResponse[]> {
  const res = await apiGet<ResponseDTO<StoreImageResponse[]>>(`/stores/${storeId}/images`)
  return res.data
}

export async function uploadStoreImage(storeId: number, file: File): Promise<StoreImageResponse> {
  const form = new FormData()
  form.append('file', file)
  const res = await apiPostMultipart<ResponseDTO<StoreImageResponse>>(
    `/stores/${storeId}/images`,
    form,
  )
  return res.data
}

export async function deleteStoreImage(storeId: number, imageId: number): Promise<void> {
  await apiDelete<ResponseDTO<void>>(`/stores/${storeId}/images/${imageId}`)
}

export async function reorderStoreImages(
  storeId: number,
  req: StoreImageReorderRequest,
): Promise<void> {
  await apiPatch<ResponseDTO<void>>(`/stores/${storeId}/images/order`, req)
}

// 백엔드 spec: POST /stores/likes?storeId={id}
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
export async function fetchRandomStores(size = 3): Promise<ShopSummaryResponse[]> {
  const res = await apiGet<ResponseDTO<ShopSummaryResponse[]>>('/stores/random', { size })
  return res.data ?? []
}
