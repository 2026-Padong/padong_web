import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { apiGet } from '../client'
import type { ResponseDTO } from '../contracts/auth'

// 백엔드 spec: GET /dongs/search?q={text}&limit={n}
// 행정동 자동완성 — prefix 우선 + contains 매칭. 인증 불필요.
export interface DongSuggestionItem {
  adminDongCode: string
  name: string
  guName: string
  fullAddress: string
}

interface DongSuggestionsData {
  items: DongSuggestionItem[]
}

export function useDongSuggestions(query: string, limit = 10) {
  const q = query.trim()
  return useQuery({
    queryKey: ['dongs', 'search', q, limit],
    queryFn: async (): Promise<DongSuggestionsData> => {
      const res = await apiGet<ResponseDTO<DongSuggestionsData>>('/dongs/search', { q, limit })
      return res.data
    },
    enabled: q.length > 0,
    placeholderData: keepPreviousData,
    staleTime: 60_000,
  })
}
