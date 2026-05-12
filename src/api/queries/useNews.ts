import { useQuery } from '@tanstack/react-query'
import { fetchNewsByDong, fetchRandomNews, type News } from '../news'

// 동네 뉴스 — 백엔드 GET /news/search?dongne=
// dongne 비어있으면 호출 안 함 (게스트 / 동네 미설정)
export function useNewsByDong(dongne: string | undefined) {
  return useQuery<News[]>({
    queryKey: ['news', 'by-dong', dongne ?? ''],
    queryFn: () => fetchNewsByDong(dongne ?? ''),
    enabled: Boolean(dongne),
    staleTime: 5 * 60_000,
  })
}

// 랜덤 뉴스 — 메인페이지용. 백엔드 GET /news/random?size=
// 인증 불필요 (게스트 포함 누구나 호출 가능)
export function useRandomNews(size = 3) {
  return useQuery<News[]>({
    queryKey: ['news', 'random', size],
    queryFn: () => fetchRandomNews(size),
    staleTime: 5 * 60_000,
  })
}
