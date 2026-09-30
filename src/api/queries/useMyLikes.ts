import { useInfiniteQuery } from '@tanstack/react-query'
import {
  fetchMyLikedDongs,
  fetchMyLikedStores,
  type CursorPageResponse,
  type LikedDongneResponse,
  type LikedStoreResponse,
} from '../likes'

const PAGE_SIZE = 20

// 내가 좋아요한 가게 — 서버 사이드 검색(q) + 커서 기반 무한 스크롤
// 백엔드 spec: GET /stores/likes/me?cursor=&size=&q=
export function useInfiniteMyLikedStores(q?: string) {
  return useInfiniteQuery<CursorPageResponse<LikedStoreResponse>>({
    queryKey: ['likes', 'stores', q ?? ''],
    queryFn: ({ pageParam }) =>
      fetchMyLikedStores(q, pageParam as number | undefined, PAGE_SIZE),
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.hasNext ? lastPage.nextCursor ?? undefined : undefined,
  })
}

// 내가 좋아요한 동네 — 서버 사이드 검색(q) + 커서 기반 무한 스크롤
// 백엔드 spec: GET /dongne/likes/me?cursor=&size=&q=
export function useInfiniteMyLikedDongs(q?: string) {
  return useInfiniteQuery<CursorPageResponse<LikedDongneResponse>>({
    queryKey: ['likes', 'dongs', q ?? ''],
    queryFn: ({ pageParam }) =>
      fetchMyLikedDongs(q, pageParam as number | undefined, PAGE_SIZE),
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.hasNext ? lastPage.nextCursor ?? undefined : undefined,
  })
}
