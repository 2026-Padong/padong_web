import { apiGet, apiPost, apiPut } from './client'
import type { ResponseDTO } from './contracts/auth'

// 백엔드 /order-flows — 사장님 주문 처리 흐름
// GET  /order-flows?menuId=X                        메뉴별 주문 흐름 단건
// PUT  /order-flows/approve?orderFlowId=X           승인
// PUT  /order-flows/reject?orderFlowId=X            거절
// PUT  /order-flows/ready?orderFlowId=X             픽업 준비 완료
// PUT  /order-flows/pickup-complete?orderFlowId=X   픽업 완료

// 백엔드 OrderFlowResponse.menus 원소 = MenuResponse 그대로
import type { MenuResponse } from './menus'

export type OrderFlowMenuRef = MenuResponse

export interface OrderFlowResponse {
  id: number
  storeId: number
  menuId: number              // 대표 메뉴 id (legacy)
  menuInfo: string            // 대표 메뉴 이름 (legacy)
  status: string              // 모임 상태 (PENDING, PENDING_FULL, APPROVED/PREPARING, READY, COMPLETED, REJECTED, CANCELED)
  menus?: OrderFlowMenuRef[]
  recruitmentStart?: string
  recruitmentDeadline?: string
  minOrderPerPerson?: number
  paymentMethod?: string
  participantCurrent?: number
  participantTotal?: number
  canceledAt?: string
  canceledReason?: string
  canApprove: boolean
  canReject: boolean
  canMarkReadyForPickup: boolean
  canCompletePickup: boolean
  canCancel: boolean
}

export async function fetchOrderFlow(menuId: number): Promise<OrderFlowResponse | null> {
  try {
    const res = await apiGet<ResponseDTO<OrderFlowResponse>>('/order-flows', { menuId })
    return res.data
  } catch (e) {
    // 진행 중 주문 없으면 404 — null 로 반환
    if (e instanceof Error && /404/.test(e.message)) return null
    throw e
  }
}

async function putAction(
  action: 'approve' | 'reject' | 'ready' | 'pickup-complete',
  orderFlowId: number,
): Promise<OrderFlowResponse> {
  const res = await apiPut<ResponseDTO<OrderFlowResponse>>(
    `/order-flows/${action}?orderFlowId=${orderFlowId}`,
    null,
  )
  return res.data
}

export const approveOrderFlow = (id: number) => putAction('approve', id)
export const rejectOrderFlow = (id: number) => putAction('reject', id)
export const markReadyOrderFlow = (id: number) => putAction('ready', id)
export const completePickupOrderFlow = (id: number) => putAction('pickup-complete', id)
// 모집중 단계에서 모임 자체 취소 (사장 측)
export const cancelOrderFlow = (id: number) => putAction('cancel' as any, id)

// 모임 생성 — 프론트 선행 디자인 (백엔드 미지원 시 mock)
export interface CreateOrderFlowRequest {
  storeId: number
  menuIds: number[]
  recruitmentStart: string     // ISO 또는 "YYYY-MM-DD HH:mm"
  recruitmentDeadline: string
  minOrderPerPerson: number
  participantTotal: number
}

export async function createOrderFlow(
  req: CreateOrderFlowRequest,
): Promise<OrderFlowResponse> {
  const res = await apiPost<ResponseDTO<OrderFlowResponse>>('/order-flows', req)
  return res.data
}

// 모임 참여자 — 프론트 디자인 정합 (userName + items[] 메뉴 breakdown). 백엔드 추가 요청 필요
export type PaymentStatus = 'PENDING' | 'PAID' | 'CANCELLED' | 'REFUNDED'
export interface OrderFlowParticipantItem {
  menuId: number
  menuInfo: string
  price: number
  quantity: number
}
export interface OrderFlowParticipant {
  userId: number
  userName: string
  joinedAt: string
  items: OrderFlowParticipantItem[]
  totalAmount: number
  paymentStatus?: PaymentStatus
}

export async function fetchOrderFlowParticipants(
  orderFlowId: number,
): Promise<OrderFlowParticipant[]> {
  const res = await apiGet<ResponseDTO<OrderFlowParticipant[]>>(
    `/order-flows/${orderFlowId}/participants`,
  )
  return res.data
}

// 모임 내역 — 완료/거절된 과거 모임
export interface OrderFlowHistoryItem {
  id: number
  storeId: number
  status: 'COMPLETED' | 'REJECTED'
  menus: OrderFlowMenuRef[]
  recruitmentStart?: string
  recruitmentDeadline?: string
  participantCount: number
  totalAmount: number
  completedAt: string
}

export interface OrderFlowHistoryFilter {
  /** ISO date (YYYY-MM-DD) — 완료일 기준 시작 (포함) */
  from?: string
  /** ISO date (YYYY-MM-DD) — 완료일 기준 종료 (포함) */
  to?: string
}

export async function fetchOrderFlowHistory(
  filter?: OrderFlowHistoryFilter,
): Promise<OrderFlowHistoryItem[]> {
  const params: Record<string, string> = {}
  if (filter?.from) params.from = filter.from
  if (filter?.to) params.to = filter.to
  const res = await apiGet<ResponseDTO<OrderFlowHistoryItem[]>>(
    '/order-flows/history',
    Object.keys(params).length ? params : undefined,
  )
  return res.data
}

export async function fetchOrderFlowHistoryDetail(id: number): Promise<OrderFlowHistoryItem> {
  const res = await apiGet<ResponseDTO<OrderFlowHistoryItem>>(`/order-flows/history/${id}`)
  return res.data
}
