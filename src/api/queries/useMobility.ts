import { keepPreviousData, useQuery } from '@tanstack/react-query'
import {
  fetchMobilityArrival,
  fetchMobilityArrivalMulti,
  type MobilityFilters,
  type MobilityResponse,
} from '../mobility'
import type { PageResponse } from '../likes'

// 단일 직장 위치 → 추천 거주 행정동 (생활이동 많은 순)
export function useMobilityArrival(
  adminDongCode: string | undefined,
  filters: MobilityFilters = {},
) {
  return useQuery<PageResponse<MobilityResponse>>({
    queryKey: ['mobility', 'arrival', adminDongCode ?? '', filters],
    queryFn: () => fetchMobilityArrival(adminDongCode ?? '', filters),
    enabled: Boolean(adminDongCode),
    staleTime: 60_000,
    placeholderData: keepPreviousData,
  })
}

// 여러 직장 위치 → 공통 추천
export function useMobilityArrivalMulti(
  adminDongCodes: string[],
  filters: MobilityFilters = {},
) {
  const enabled = adminDongCodes.length > 0
  return useQuery<PageResponse<MobilityResponse>>({
    queryKey: ['mobility', 'arrival-multi', adminDongCodes, filters],
    queryFn: () => fetchMobilityArrivalMulti(adminDongCodes, filters),
    enabled,
    staleTime: 60_000,
    placeholderData: keepPreviousData,
  })
}
