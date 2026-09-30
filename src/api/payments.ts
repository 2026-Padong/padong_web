import { apiPost } from './client'
import type { ResponseDTO } from './contracts/auth'

// 백엔드 spec — 결제 2-step 흐름:
//   POST /payments/prepare  → orderId, paymentId, amount 받음
//   (PG widget 인증, 현재는 테스트 모드로 즉시 confirm)
//   POST /payments/confirm  → 최종 status 받음

export interface OrderMenuRequest {
  menuId: number
  quantity: number
}

export interface PaymentPrepareRequest {
  groupOrderId: number
  orderMenus: OrderMenuRequest[]
}

export interface PaymentPrepareResponse {
  orderId: number
  paymentId: string
  amount: number
  orderName: string
  customerName: string
  isTest: boolean
}

export interface PaymentConfirmRequest {
  paymentId: string
}

export interface PaymentResponse {
  paymentId: string
  orderId: number
  status: string // PAID | FAILED | CANCELED 등
  totalAmount: number
  isTest: boolean
  pgTxId: string
  paidAt: string
  canceledAt: string
  failureReason: string
}

export async function preparePayment(
  req: PaymentPrepareRequest,
): Promise<PaymentPrepareResponse> {
  const res = await apiPost<ResponseDTO<PaymentPrepareResponse>>('/payments/prepare', req)
  return res.data
}

export async function confirmPayment(
  req: PaymentConfirmRequest,
): Promise<PaymentResponse> {
  const res = await apiPost<ResponseDTO<PaymentResponse>>('/payments/confirm', req)
  return res.data
}
