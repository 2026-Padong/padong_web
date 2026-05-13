import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { apiGet } from '../client'
import type { ResponseDTO } from '../contracts/auth'
import type { ShopDetailResponse } from '../contracts/shops'

export function shopDetailKey(id: string | undefined) {
  return ['stores', 'detail', id] as const
}

// keepPreviousData — id 변경 시 이전 가게 데이터 유지하며 백그라운드 refetch.
// 효과: 다른 가게 카드 클릭 시 detail.data 가 잠시 undefined 가 되지 않음
// → ShopDetailPanel/MapOverlayCard 깜빡임 없음, JSX 트리 안정 → list 페이지 state 보존.
export function useShopDetail(id: string | undefined) {
  return useQuery({
    queryKey: shopDetailKey(id),
    queryFn: async (): Promise<ShopDetailResponse> => {
      const res = await apiGet<ResponseDTO<ShopDetailResponse>>(`/stores/${id}`)
      return res.data
    },
    enabled: Boolean(id),
    placeholderData: keepPreviousData,
  })
}
