import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query'
import { apiGet, apiPost } from '../client'
import type {
  AnalyzeRequest,
  AnalyzeResponse,
  ResultListQuery,
  ResultListResponse,
} from '../contracts/results'

export function resultsKey(query?: ResultListQuery) {
  return ['neighborhoods', 'results', query] as const
}

export function useResults(query?: ResultListQuery & { enabled?: boolean }) {
  return useQuery({
    queryKey: resultsKey(query),
    queryFn: () =>
      apiGet<ResultListResponse>('/neighborhoods/results', {
        lifestyleId: query?.lifestyleId,
        multi: query?.multi ? '1' : undefined,
        destination: query?.destination || undefined,
      }),
    // destination 변경마다 refetch 발생 — 이전 데이터 유지해야 input/포커스 안 끊김
    placeholderData: keepPreviousData,
    enabled: query?.enabled ?? true,
  })
}

export function useAnalyze() {
  return useMutation({
    mutationFn: (body: AnalyzeRequest) => apiPost<AnalyzeResponse>('/neighborhoods/analyze', body),
  })
}
