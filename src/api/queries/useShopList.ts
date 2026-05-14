import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { apiGet } from '../client'
import type { ResponseDTO } from '../contracts/auth'
import type { PageResponse } from '../likes'
import type { ShopListQueryParams, ShopSummaryResponse } from '../contracts/shops'

export function shopListKey(query?: ShopListQueryParams) {
  return ['stores', 'list', query] as const
}

// 백엔드 spec: GET /stores (검색·필터·페이징)
// 비로그인도 호출 가능. likedOnly=true 는 JWT 있을 때만 의미.
// placeholderData: keepPreviousData — 파라미터 변경(검색·필터) 시 이전 데이터 유지하며 백그라운드 refetch
//   → ShopListPanel 이 unmount/remount 안 됨 → 검색 input/query state 보존
export function useShopList(query?: ShopListQueryParams, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: shopListKey(query),
    queryFn: async (): Promise<PageResponse<ShopSummaryResponse>> => {
      const params: Record<string, string | number | undefined> = {
        adminDongCode: query?.adminDongCode,
        q: query?.q,
        status: query?.status,
        category: query?.category,
        likedOnly: query?.likedOnly ? 'true' : undefined,
        page: query?.page,
        size: query?.size,
      }
      const res = await apiGet<ResponseDTO<PageResponse<ShopSummaryResponse>>>('/stores', params)
      return res.data
    },
    placeholderData: keepPreviousData,
    enabled: options?.enabled ?? true,
  })
}
