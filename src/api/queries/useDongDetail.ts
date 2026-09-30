import { useQuery } from '@tanstack/react-query'
import { fetchDongDetail, type DongDetailResponse } from '../dongDetail'

// 동네 상세 — 백엔드 GET /dongne/detail
// adminDongCode 가 선택된 추천 동네, arrivalAdminDongCode 가 사용자 직장(있으면 통근 path 까지 채워짐)
export function useDongDetail(
  adminDongCode: string | undefined,
  arrivalAdminDongCode?: string,
) {
  return useQuery<DongDetailResponse>({
    queryKey: ['dongne', 'detail', adminDongCode ?? '', arrivalAdminDongCode ?? ''],
    queryFn: () => fetchDongDetail(adminDongCode ?? '', arrivalAdminDongCode),
    enabled: Boolean(adminDongCode),
    staleTime: 60_000,
  })
}
