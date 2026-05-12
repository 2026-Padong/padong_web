import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { fetchMyOrders, fetchOrderDetail, toOrderInfo } from '@/api/orders'
import { loadOrder, type OrderInfo } from '@/lib/orderStorage'

const PAGE_SIZE = 20

// 내 주문 목록 — 백엔드 GET /orders/me 커서 페이징
// localStorage 의 방금-결제-한 주문은 첫 페이지 응답에 prepend (서버 sync 사이 보강용)
export function useInfiniteMyOrders() {
  return useInfiniteQuery({
    queryKey: ['orders', 'me'],
    queryFn: async ({ pageParam }) => fetchMyOrders(pageParam as number | undefined, PAGE_SIZE),
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (last) =>
      last.hasNext ? last.nextCursor ?? undefined : undefined,
  })
}

// 단일 주문 — nav state 우선, 없으면 백엔드. localStorage 는 결제 직후 fallback.
export function useOrderDetail(orderId: number | undefined) {
  return useQuery({
    queryKey: ['orders', 'detail', orderId],
    queryFn: async (): Promise<OrderInfo | null> => {
      if (!orderId) return null
      // 1) 백엔드
      try {
        const res = await fetchOrderDetail(orderId)
        return toOrderInfo(res)
      } catch (e) {
        // 2) 백엔드 실패 시 localStorage (오프라인/결제 직후 sync 전)
        console.error('[order-detail] fetch failed, fallback to localStorage:', e)
        return loadOrder(orderId)
      }
    },
    enabled: Boolean(orderId),
  })
}
