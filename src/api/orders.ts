import { apiGet } from './client'
import type { ResponseDTO } from './contracts/auth'
import type { CursorPageResponse } from './likes'
import type { OrderInfo } from '@/lib/orderStorage'

// 백엔드 OrderResponse (swagger 일치)
export interface OrderResponse {
  orderId: number
  orderNumber: string
  paymentId: string
  paidAt: string // ISO
  paymentMethod: 'card' | 'transfer' | string
  totalAmount: number
  status: string // PREPARING | READY | COMPLETED | CANCELLED
  shop: {
    id: number
    name: string
    imageUrl?: string
    category: string
    address: string
    phoneNumber: string
    openTime: string
    closeTime: string
  }
  items: {
    menuId: number
    name: string
    price: number
    quantity: number
  }[]
}

// 백엔드 응답 → 내부 OrderInfo 동일 모양 매핑
export function toOrderInfo(r: OrderResponse): OrderInfo {
  return {
    orderId: r.orderId,
    orderNumber: r.orderNumber,
    paymentId: r.paymentId,
    paidAt: r.paidAt,
    status: r.status,
    paymentMethod: r.paymentMethod === 'transfer' ? 'transfer' : 'card',
    shop: r.shop,
    items: r.items,
    totalAmount: r.totalAmount,
  }
}

// GET /orders/me?cursor=&size=
export async function fetchMyOrders(
  cursor?: number,
  size = 20,
): Promise<CursorPageResponse<OrderResponse>> {
  const res = await apiGet<ResponseDTO<CursorPageResponse<OrderResponse>>>('/orders/me', {
    cursor,
    size,
  })
  return res.data
}

// GET /orders/{orderId}
export async function fetchOrderDetail(orderId: number): Promise<OrderResponse> {
  const res = await apiGet<ResponseDTO<OrderResponse>>(`/orders/${orderId}`)
  return res.data
}
