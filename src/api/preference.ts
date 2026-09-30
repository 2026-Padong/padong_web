import { apiGet, ApiError } from './client'
import type { ResponseDTO } from './contracts/auth'

// 백엔드 spec: GET /api/preference/me/answers
// 마지막으로 제출한 q1..q10 답변 반환. 답변 없으면 404.
// /dongne/recommendations 호출 시 부수효과로 자동 저장됨 — 별도 저장 API 없음.
export interface PreferenceAnswersResponse {
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
  updatedAt: string
}

// 404 이면 null 반환 (설문 미진행 신규 유저 케이스)
export async function fetchMyPreferenceAnswers(): Promise<PreferenceAnswersResponse | null> {
  try {
    const res = await apiGet<ResponseDTO<PreferenceAnswersResponse>>('/api/preference/me/answers')
    return res.data
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) return null
    throw e
  }
}

// q1..q10 객체 → `/dongne/recommendations` 쿼리 파라미터로 변환
export function answersToQueryParams(a: PreferenceAnswersResponse): Record<string, number> {
  return {
    q1: a.q1, q2: a.q2, q3: a.q3, q4: a.q4, q5: a.q5,
    q6: a.q6, q7: a.q7, q8: a.q8, q9: a.q9, q10: a.q10,
  }
}
