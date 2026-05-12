import { useQuery } from '@tanstack/react-query'
import { fetchRandomStores } from '../stores'
import type { ShopSummaryResponse } from '../contracts/shops'

// 랜덤 가게 — 메인페이지용. 백엔드 GET /stores/random?size=
// 인증 불필요. 짧은 staleTime 으로 새로고침 시 다른 가게 노출
export function useRandomStores(size = 3) {
  return useQuery<ShopSummaryResponse[]>({
    queryKey: ['stores', 'random', size],
    queryFn: () => fetchRandomStores(size),
    staleTime: 60_000, // 1분 — 너무 자주 셔플되면 산만
  })
}
