import { useQuery } from '@tanstack/react-query'
import { apiGet } from '../client'
import type { ShopListQuery, ShopListResponse } from '../contracts/shops'

const PATH = '/shops'

export function shopListKey(query?: ShopListQuery) {
  return ['shops', query] as const
}

export function useShopList(query?: ShopListQuery) {
  return useQuery({
    queryKey: shopListKey(query),
    queryFn: () =>
      apiGet<ShopListResponse>(PATH, {
        q: query?.q,
        page: query?.page,
        filters: query?.filters?.join(','),
      }),
  })
}
