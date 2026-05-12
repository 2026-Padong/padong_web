// ─────────────────────────────────────────────────────────────
// 가게 — 백엔드 swagger 스펙 일치 (Phase 11 — 신규 endpoint + 필드 보강)
//   GET    /stores              → PageResponse<ShopSummaryResponse>
//   GET    /stores/{id}         → ShopDetailResponse
//   GET    /stores/categories   → CategoryOption[]
//   POST   /stores              JSON body: StoreRegistrationCreateRequest
//   PATCH  /stores/{id}         JSON body: StoreRegistrationUpdateRequest
//   DELETE /stores/{id}
//   PUT    /stores/{id}/thumbnail    multipart (file)
//   DELETE /stores/{id}/thumbnail
//   GET    /stores/{id}/images       → StoreImageResponse[]
//   POST   /stores/{id}/images       multipart (file) → StoreImageResponse
//   PATCH  /stores/{id}/images/order body: StoreImageReorderRequest
//   DELETE /stores/{id}/images/{imageId}
// ─────────────────────────────────────────────────────────────

export type ShopStatusEnum = 'RECRUITING' | 'CLOSING' | 'CLOSED'

export interface CategoryOption {
  code: string
  label: string
}

export interface StoreImageResponse {
  id: number
  url: string
  order: number
}

export interface ShopSummaryResponse {
  id: number
  name: string
  thumbnailUrl: string
  category: string         // enum code (예: BAKERY)
  categoryLabel: string    // 표시 라벨 (예: 베이커리)
  description: string
  participantCurrent: number
  participantTotal: number
  status: ShopStatusEnum
  likeCount: number
  likedByCurrentUser: boolean
  latitude: number
  longitude: number
  weekdayMask: number      // 영업 요일 비트마스크 (bit0=MON..bit6=SUN)
}

export interface ShopListQueryParams {
  adminDongCode?: string
  q?: string
  status?: ShopStatusEnum
  category?: string
  likedOnly?: boolean
  page?: number
  size?: number
}

export interface ShopMenuItemResponse {
  id: number
  name: string
  price: number
}

export interface ShopDetailResponse {
  id: number
  name: string
  category: string         // enum code
  categoryLabel: string    // 표시 라벨
  thumbnailUrl: string
  likedByCurrentUser: boolean
  description: string
  address: string
  phoneNumber: string
  openTime: string         // "HH:mm"
  closeTime: string        // "HH:mm"
  weekdayMask: number      // 비트마스크
  images: StoreImageResponse[]
  menuCategories: string[]
  menus: ShopMenuItemResponse[]
  participantCurrent: number
  participantTotal: number
  status: ShopStatusEnum
  /** 현재 진행 중인 공동주문 ID. null 이면 진행 중 GroupOrder 없음 (결제 disable) */
  currentGroupOrderId: number | null
  latitude: number
  longitude: number
}

// ─── 요청 body ────────────────────────────────────────────────────────────
export interface StoreRegistrationCreateRequest {
  /**
   * 가게가 속한 행정동 코드. 백엔드가 address → geocoding 으로 자동 매핑 → 프론트는 미전송.
   */
  adminDongCode?: string
  name: string
  category: string
  address: string
  phoneNumber: string
  description?: string
  openTime: string         // HH:mm
  closeTime: string        // HH:mm
  weekdayMask?: number
  latitude?: number
  longitude?: number
}

export interface StoreRegistrationUpdateRequest {
  adminDongCode?: string
  name?: string
  category?: string
  address?: string
  phoneNumber?: string
  description?: string
  openTime?: string
  closeTime?: string
  weekdayMask?: number
  latitude?: number
  longitude?: number
}

export interface StoreImageReorderRequest {
  ids: number[]
}

// ─────────────────────────────────────────────────────────────
// 레거시 — 목록 API 및 ShopCard, ShopListPanel 에서 사용 중
// 추후 GET /stores (목록) 연동 시 ShopSummaryResponse 로 대체 예정
// ─────────────────────────────────────────────────────────────

export type ShopStatusDto = 'recruiting' | 'closing' | 'closed'

export interface ShopDto {
  id: string
  image: string
  name: string
  category: string
  description: string | null
  status: ShopStatusDto
  participantCurrent: number
  participantTotal: number
  liked: boolean
}

export interface ShopMenuDto {
  name: string
  description: string | null
  price: number
  originalPrice: number | null
  image: string | null
}

export interface ShopInfoRowDto {
  label: string
  value: string
}

export interface ShopDetailDto extends ShopDto {
  images: string[]
  menuCategories: string[]
  menus: ShopMenuDto[]
  infoRows: ShopInfoRowDto[]
  bookmarked: boolean
}

export interface ShopListResponse {
  items: ShopDto[]
  total: number
}

export interface ShopListQuery {
  q?: string
  filters?: string[]
  page?: number
}
