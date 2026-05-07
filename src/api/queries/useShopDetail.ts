import { useQuery } from '@tanstack/react-query'
import { apiGet } from '../client'
import type { ShopDetailDto } from '../contracts/shops'

export function shopDetailKey(id: string | undefined) {
  return ['shops', 'detail', id] as const
}

export function useShopDetail(id: string | undefined) {
  return useQuery({
    queryKey: shopDetailKey(id),
    queryFn: () => apiGet<ShopDetailDto>(`/shops/${id}`),
    enabled: Boolean(id),
  })
}
