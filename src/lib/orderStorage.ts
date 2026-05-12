// 결제 후 주문 정보 — Complete / OrderDetail / MyOrders 페이지에서 사용
// localStorage 기반 (탭/세션 종료 후에도 유지). 추후 백엔드 GET /orders/me 생기면 교체.
import type { CartItem } from './cart'

export interface OrderInfo {
  orderId: number
  /** 백엔드 발급 사용자 노출용 주문번호 (yyyyMMdd-PK5자리). 백엔드 응답에 있을 때만 채워짐 */
  orderNumber?: string
  paymentId: string
  paidAt: string | null // ISO 8601. 미결제면 null
  /** 결제 상태 (OrderStatus) — READY/PAID/CANCELED/FAILED */
  status?: string
  /** Fulfillment 상태 (OrderFlowStatus) — PENDING/WAITING_APPROVAL/APPROVED/READY/COMPLETED/REJECTED */
  flowStatus?: string
  shop: {
    id: number
    name: string
    imageUrl?: string
    category: string
    address: string
    phoneNumber: string
    openTime: string // HH:mm
    closeTime: string
  }
  items: CartItem[]
  totalAmount: number
  paymentMethod: 'card' | 'transfer'
}

const KEY_PREFIX = 'padong.order.'

export function saveOrder(order: OrderInfo): void {
  window.localStorage.setItem(KEY_PREFIX + order.orderId, JSON.stringify(order))
}

export function loadOrder(orderId: number): OrderInfo | null {
  const raw = window.localStorage.getItem(KEY_PREFIX + orderId)
  if (!raw) return null
  try {
    return JSON.parse(raw) as OrderInfo
  } catch {
    return null
  }
}

// localStorage 의 모든 주문 — paidAt 기준 최신순
export function listLocalOrders(): OrderInfo[] {
  const orders: OrderInfo[] = []
  for (let i = 0; i < window.localStorage.length; i++) {
    const key = window.localStorage.key(i)
    if (!key || !key.startsWith(KEY_PREFIX)) continue
    const raw = window.localStorage.getItem(key)
    if (!raw) continue
    try {
      orders.push(JSON.parse(raw) as OrderInfo)
    } catch {
      // 손상된 항목 무시
    }
  }
  // paidAt null (미결제) 은 뒤로
  const ts = (v: string | null) => (v ? new Date(v).getTime() : 0)
  return orders.sort((a, b) => ts(b.paidAt) - ts(a.paidAt))
}

// ─────────────────────────────────────────────────────────────
// Mock 주문 데이터 — localStorage 비어있을 때 표시 (UX 데모용)
// 추후 GET /orders/me API 연동 시 제거 가능
// ─────────────────────────────────────────────────────────────
const daysAgo = (n: number) => new Date(Date.now() - n * 24 * 60 * 60 * 1000).toISOString()

export const MOCK_ORDERS: OrderInfo[] = [
  {
    orderId: 1001,
    paymentId: 'mock-pay-1001',
    paidAt: daysAgo(1),
    shop: {
      id: 1,
      name: '연희제빵소',
      imageUrl: undefined,
      category: '베이커리',
      address: '서울 서대문구 연희로 11길 24',
      phoneNumber: '02-3142-8200',
      openTime: '10:00',
      closeTime: '22:00',
    },
    items: [
      { menuId: 1, name: '크루아상', price: 4500, quantity: 2 },
      { menuId: 3, name: '아메리카노', price: 3500, quantity: 1 },
    ],
    totalAmount: 12500,
    paymentMethod: 'card',
  },
  {
    orderId: 1002,
    paymentId: 'mock-pay-1002',
    paidAt: daysAgo(3),
    shop: {
      id: 2,
      name: '연남책방 라떼',
      imageUrl: undefined,
      category: '카페, 책방',
      address: '서울 마포구 연남로 12',
      phoneNumber: '02-1234-5678',
      openTime: '11:00',
      closeTime: '21:00',
    },
    items: [
      { menuId: 4, name: '라떼', price: 5000, quantity: 2 },
    ],
    totalAmount: 10000,
    paymentMethod: 'card',
  },
  {
    orderId: 1003,
    paymentId: 'mock-pay-1003',
    paidAt: daysAgo(7),
    shop: {
      id: 3,
      name: '망원 떡방앗간',
      imageUrl: undefined,
      category: '떡, 한과',
      address: '서울 마포구 망원동 100',
      phoneNumber: '02-2345-6789',
      openTime: '09:00',
      closeTime: '20:00',
    },
    items: [{ menuId: 7, name: '인절미', price: 5000, quantity: 1 }],
    totalAmount: 5000,
    paymentMethod: 'transfer',
  },
]
