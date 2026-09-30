import { apiGet, apiPatch } from './client'
import type { ResponseDTO } from './contracts/auth'

// 백엔드 RecommendationLogController — AI 추천 학습용 UX 로깅
// 스웨거 PATCH /api/recommendation-logs/{click, like, dwell-time, interaction}
//        GET   /api/recommendation-logs/latest?userId&adminDongCode

export interface RecommendationLogUpdateResponse {
  userId: number
  adminDongCode: string
  updated: boolean
}

export interface RecommendationLogRow {
  id: number
  userId: number
  adminDongCode: string
  rankPosition: number
  impression: boolean
  clickedCount: number
  likedCount: number
  dwellTimeSec: number
  recommendationType: string
  q1: number
  q2: number
  q3: number
  q4: number
  q5: number
  q6: number
  q7: number
  q8: number
  q9: number
  q10: number
  createdAt: string
  updatedAt: string
}

export async function logRecommendationClick(
  userId: number,
  adminDongCode: string,
): Promise<RecommendationLogUpdateResponse> {
  const res = await apiPatch<ResponseDTO<RecommendationLogUpdateResponse>>(
    '/api/recommendation-logs/click',
    { userId, adminDongCode },
  )
  return res.data
}

export async function logRecommendationLike(
  userId: number,
  adminDongCode: string,
  liked: boolean,
): Promise<RecommendationLogUpdateResponse> {
  const res = await apiPatch<ResponseDTO<RecommendationLogUpdateResponse>>(
    '/api/recommendation-logs/like',
    { userId, adminDongCode, liked },
  )
  return res.data
}

export async function logRecommendationDwellTime(
  userId: number,
  adminDongCode: string,
  dwellTimeSec: number,
): Promise<RecommendationLogUpdateResponse> {
  const res = await apiPatch<ResponseDTO<RecommendationLogUpdateResponse>>(
    '/api/recommendation-logs/dwell-time',
    { userId, adminDongCode, dwellTimeSec },
  )
  return res.data
}

export interface RecommendationLogInteractionInput {
  clicked?: boolean
  liked?: boolean
  dwellTimeSec?: number
}

export async function logRecommendationInteraction(
  userId: number,
  adminDongCode: string,
  input: RecommendationLogInteractionInput,
): Promise<RecommendationLogUpdateResponse> {
  const res = await apiPatch<ResponseDTO<RecommendationLogUpdateResponse>>(
    '/api/recommendation-logs/interaction',
    { userId, adminDongCode, ...input },
  )
  return res.data
}

export async function fetchLatestRecommendationLog(
  userId: number,
  adminDongCode: string,
): Promise<RecommendationLogRow> {
  const res = await apiGet<ResponseDTO<RecommendationLogRow>>(
    '/api/recommendation-logs/latest',
    { userId, adminDongCode },
  )
  return res.data
}
