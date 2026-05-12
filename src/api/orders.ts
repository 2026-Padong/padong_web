import { apiGet } from './client'
import type { ResponseDTO } from './contracts/auth'
import type { CursorPageResponse } from './likes'
import type { OrderInfo } from '@/lib/orderStorage'

// 백엔드 OrderResponse (swagger 일치)
//   status      : 결제 상태 (OrderStatus)     — READY/PAID/CANCELED/FAILED
//   flowStatus  : 공구 fulfillment 상태       — PENDING/WAITING_APPROVAL/APPROVED/READY/COMPLETED/REJECTED
// 사용자 화면 라벨은 둘을 조합해서 결정 (예: status=PAID + flowStatus=READY → "픽업 가능").
export type OrderPaymentStatus = 'READY' | 'PAID' | 'CANCELED' | 'FAILED'
export type OrderFlowStatus =
  | 'PENDING'
  | 'WAITING_APPROVAL'
  | 'APPROVED'
  | 'READY'
  | 'COMPLETED'
  | 'REJECTED'

export interface OrderResponse {
  orderId: number
  orderNumber: string
  paymentId: string
  paidAt: string | null // ISO. 결제 전이면 null
  paymentMethod: 'card' | 'transfer' | string | null
  totalAmount: number
  status: OrderPaymentStatus
  flowStatus: OrderFlowStatus
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
    flowStatus: r.flowStatus,
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
