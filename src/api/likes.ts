import { apiGet, apiPost } from './client'
import type { ResponseDTO } from './contracts/auth'

// 백엔드 PageResponse — content[] + 페이지 메타 (가게 목록 등)
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

// 백엔드 CursorPageResponse — 무한 스크롤용 커서 페이징
// nextCursor: 다음 페이지 요청 시 cursor 파라미터로 사용. hasNext=false 면 null
export interface CursorPageResponse<T> {
  items: T[]
  nextCursor: number | null
  hasNext: boolean
}

// 동네 결과 카드(ResultCard)와 동일한 시각 표현을 위해 fullAddress/tags 포함
// 백엔드는 좋아요한 동네의 추천 메타(태그)를 join 해서 함께 반환
export interface LikedDongneResponse {
  likeId: number
  adminDongCode: string
  guName: string
  name: string
  fullAddress?: string
  tags?: string[]
}

// 가게 리스트 카드와 동일한 시각 표현을 위해 ShopSummary 와 유사한 필드 포함
// 백엔드는 좋아요한 가게의 store 정보를 join 해서 함께 반환
export interface LikedStoreResponse {
  likeId: number
  storeId: number
  name: string
  roadAddress: string
  category: string
  imageUrl?: string
  description?: string
  status?: 'recruiting' | 'preparing' | 'closed' | null
  participantCurrent?: number
  participantTotal?: number
}

// q — /dongs/search 와 동일 규칙: 행정동명 + 자치구명 + 전체주소 부분 일치 + 커서 페이징
// cursor — 이전 응답의 nextCursor. 첫 페이지는 undefined.
export async function fetchMyLikedDongs(
  q?: string,
  cursor?: number,
  size = 20,
): Promise<CursorPageResponse<LikedDongneResponse>> {
  const res = await apiGet<ResponseDTO<CursorPageResponse<LikedDongneResponse>>>(
    '/dongne/likes/me',
    {
      q: q || undefined,
      cursor,
      size,
    },
  )
  return res.data
}

// q — 가게 이름 부분 일치 (서버 사이드 검색) + 커서 페이징
export async function fetchMyLikedStores(
  q?: string,
  cursor?: number,
  size = 20,
): Promise<CursorPageResponse<LikedStoreResponse>> {
  const res = await apiGet<ResponseDTO<CursorPageResponse<LikedStoreResponse>>>(
    '/stores/likes/me',
    {
      q: q || undefined,
      cursor,
      size,
    },
  )
  return res.data
}

// 백엔드 spec: POST /dongne/likes?adminDongCode={code} — JWT 필수, 토글 (좋아요/취소)
export interface DongneLikeToggleResponse {
  adminDongId: number
  adminDongCode: string
  userId: number
  liked: boolean
  likeCount: number
}

export async function toggleDongneLike(
  adminDongCode: string,
): Promise<DongneLikeToggleResponse> {
  const res = await apiPost<ResponseDTO<DongneLikeToggleResponse>>(
    `/dongne/likes?adminDongCode=${encodeURIComponent(adminDongCode)}`,
    null,
  )
  return res.data
}
