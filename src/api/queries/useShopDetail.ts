import { useQuery } from '@tanstack/react-query'
import { apiGet } from '../client'
import type { ResponseDTO } from '../contracts/auth'
import type { ShopDetailResponse } from '../contracts/shops'

export function shopDetailKey(id: string | undefined) {
  return ['stores', 'detail', id] as const
}

export function useShopDetail(id: string | undefined) {
  return useQuery({
    queryKey: shopDetailKey(id),
    queryFn: async (): Promise<ShopDetailResponse> => {
      const res = await apiGet<ResponseDTO<ShopDetailResponse>>(`/stores/${id}`)
      return res.data
    },
    enabled: Boolean(id),
  })
}
