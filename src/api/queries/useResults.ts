import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiGet } from '../client'
import type { ResponseDTO } from '../contracts/auth'
import type { AnalyzeRequest } from '../contracts/results'
import type { MobilityResponse } from '../mobility'
import type { PageResponse } from '../likes'
import { answersToQueryParams, fetchMyPreferenceAnswers } from '../preference'
import { loadPreferenceAnswers, savePreferenceAnswers } from '@/lib/preferenceStorage'

// 백엔드: GET /dongne/recommendations?q1=..&q10=..&page=&size=
// q1..q10 required (1~5), page/size optional
// 응답은 출퇴근(/mobility/arrival)과 동일한 MobilitySimpleResponse 재사용
export interface DongneRecommendationResponse {
  userType: string
  page: PageResponse<MobilityResponse>
}

// 분석 결과 캐시 키 — useAnalyze 가 setQueryData 로 채움, useRecommendation 이 읽음
export const recommendationKey = ['dongne', 'recommendations'] as const

export function useAnalyze() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (body: AnalyzeRequest) => {
      const params: Record<string, number> = {}
      for (let i = 1; i <= 10; i++) {
        const v = body.answers[i]
        if (v == null) throw new Error(`q${i} 미응답`)
        params[`q${i}`] = v
      }
      const res = await apiGet<ResponseDTO<DongneRecommendationResponse>>(
        '/dongne/recommendations',
        params,
      )
      // 비로그인 유저용 폴백 — 답변을 localStorage 백업 (로그인 유저는 백엔드가 entity 저장)
      savePreferenceAnswers(body.answers)
      return res.data
    },
    onSuccess: (data) => {
      qc.setQueryData(recommendationKey, data)
      // 결과 페이지 query 도 동일 데이터로 prime — 진입 시 즉시 표시 + 백그라운드 refetch
      qc.setQueryData(['preference', 'recommendation'], data)
    },
  })
}

// 분석 결과 읽기 — useAnalyze 가 setQueryData 로 캐시한 응답을 페이지 간 공유
export function useRecommendation(): DongneRecommendationResponse | undefined {
  const qc = useQueryClient()
  return qc.getQueryData<DongneRecommendationResponse>(recommendationKey)
}

// 결과 페이지의 canonical 데이터 소스 — DB(엔티티) 기준.
// 1) GET /api/preference/me/answers (JWT 유저) — 저장된 q1..q10
// 2) 답변 있으면 /dongne/recommendations 호출 (fresh AI 추천)
// 3) 답변 없음 + localStorage 폴백 (비로그인) → 같은 흐름
// 4) 둘 다 없음 → null (설문 미진행)
export function usePreferenceRecommendation() {
  return useQuery<DongneRecommendationResponse | null>({
    queryKey: ['preference', 'recommendation'],
    queryFn: async () => {
      // 백엔드 우선 (로그인 유저)
      let answers = await fetchMyPreferenceAnswers().catch(() => null)
      // 비로그인 / DB 미보유 → localStorage 폴백
      if (!answers) answers = loadPreferenceAnswers()
      if (!answers) return null
      const params = answersToQueryParams(answers)
      const res = await apiGet<ResponseDTO<DongneRecommendationResponse>>(
        '/dongne/recommendations',
        params,
      )
      return res.data
    },
    staleTime: 5 * 60_000,
    retry: false,
  })
}
