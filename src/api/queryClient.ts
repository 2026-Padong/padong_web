import { QueryClient } from '@tanstack/react-query'

// 기본 옵션 — 30초 신선, 재시도 1회, 윈도우 포커스 시 자동 리페치 끔
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
})
