import { useQuery } from '@tanstack/react-query'
import { fetchRandomNews, type News } from '../news'

// 랜덤 뉴스 — 메인페이지용. 백엔드 GET /news/random?size=
// 인증 불필요 (게스트 포함 누구나 호출 가능)
export function useRandomNews(size = 3) {
  return useQuery<News[]>({
    queryKey: ['news', 'random', size],
    queryFn: () => fetchRandomNews(size),
    staleTime: 5 * 60_000,
  })
}
