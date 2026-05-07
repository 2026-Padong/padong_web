import { useMutation, useQuery } from '@tanstack/react-query'
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

export function useResults(query?: ResultListQuery) {
  return useQuery({
    queryKey: resultsKey(query),
    queryFn: () =>
      apiGet<ResultListResponse>('/neighborhoods/results', {
        lifestyleId: query?.lifestyleId,
        multi: query?.multi ? '1' : undefined,
      }),
  })
}

export function useAnalyze() {
  return useMutation({
    mutationFn: (body: AnalyzeRequest) => apiPost<AnalyzeResponse>('/neighborhoods/analyze', body),
  })
}
