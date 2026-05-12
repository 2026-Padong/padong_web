// ─────────────────────────────────────────────────────────────
// 가게 — 백엔드 swagger 스펙 일치
//   GET /stores         → ResponseDTO<PageResponse<ShopSummaryResponse>>
//   GET /stores/{id}    → ResponseDTO<ShopDetailResponse>
// ─────────────────────────────────────────────────────────────

export type ShopStatusEnum = 'RECRUITING' | 'CLOSING' | 'CLOSED'

export interface ShopSummaryResponse {
  id: number
  name: string
  imageUrl: string
  category: string
  description: string
  participantCurrent: number
  participantTotal: number
  status: ShopStatusEnum
  likeCount: number
  likedByCurrentUser: boolean
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
  category: string
  imageUrl: string
  likedByCurrentUser: boolean
  description: string
  address: string
  phoneNumber: string
  openTime: string // "HH:mm"
  closeTime: string // "HH:mm"
  images: string[]
  menuCategories: string[]
  menus: ShopMenuItemResponse[]
  participantCurrent: number
  participantTotal: number
  status: ShopStatusEnum
  /** 현재 진행 중인 공동주문 ID. null 이면 진행 중 GroupOrder 없음 (결제 disable) */
  currentGroupOrderId: number | null
  /** 가게 위경도 — 백엔드 추가 예정. 적재 전엔 null. */
  latitude?: number | null
  longitude?: number | null
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
