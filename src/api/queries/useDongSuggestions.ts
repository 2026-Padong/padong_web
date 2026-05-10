import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { apiGet } from '../client'

interface DongSuggestionsResponse {
  items: string[]
}

/**
 * 행정동 이름 자동완성 — query 입력에 매칭되는 행정동 top 10 반환.
 * 빈 query는 fetch 안 함 (enabled false).
 */
export function useDongSuggestions(query: string) {
  const q = query.trim()
  return useQuery({
    queryKey: ['dongs', 'search', q],
    queryFn: () => apiGet<DongSuggestionsResponse>('/dongs/search', { q }),
    enabled: q.length > 0,
    placeholderData: keepPreviousData,
    staleTime: 60_000,
  })
}
