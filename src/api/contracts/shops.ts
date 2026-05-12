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

/** 사용자 측 모집 상태 — 가게 카드/상세에서 노출 */
export type RecruitmentStatus =
  | 'RECRUITING'
  | 'CLOSING_SOON'
  | 'IN_PROGRESS'
  | 'NO_FLOW'
  | 'OUT_OF_HOURS'

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
  recruitmentStatus: RecruitmentStatus
  likeCount: number
  likedByCurrentUser: boolean
  latitude: number
  longitude: number
  weekdayMask: number      // 영업 요일 비트마스크 (bit0=MON..bit6=SUN)
}

export interface ShopListQueryParams {
  adminDongCode?: string
  q?: string
  status?: RecruitmentStatus
  category?: string
  likedOnly?: boolean
  page?: number
  size?: number
}

export interface ShopMenuItemResponse {
  id: number
  name: string
  price: number
  soldOut: boolean
}

export interface CurrentGroupOrderSummary {
  id: number
  recruitmentDeadline: string  // ISO 또는 "YYYY-MM-DD HH:mm"
  minOrderPerPerson: number    // 1인 최소 주문 금액 (원)
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
  menus: ShopMenuItemResponse[]
  participantCurrent: number
  participantTotal: number
  recruitmentStatus: RecruitmentStatus
  /** 진행 중 공동주문. null 이면 진행 중 GroupOrder 없음 (결제 disable) */
  currentGroupOrder: CurrentGroupOrderSummary | null
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
