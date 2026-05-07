// 백엔드 미완성 — 임시 계약. 추후 OpenAPI 스펙으로 대체 가능.

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
