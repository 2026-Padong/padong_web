import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiGet } from '../client'
import type { ResponseDTO } from '../contracts/auth'
import type { AnalyzeRequest } from '../contracts/results'
import type { MobilityResponse } from '../mobility'
import type { PageResponse } from '../likes'

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
      return res.data
    },
    onSuccess: (data) => {
      qc.setQueryData(recommendationKey, data)
    },
  })
}

// 분석 결과 읽기 — useAnalyze 가 setQueryData 로 캐시한 응답을 페이지 간 공유
export function useRecommendation(): DongneRecommendationResponse | undefined {
  const qc = useQueryClient()
  return qc.getQueryData<DongneRecommendationResponse>(recommendationKey)
}
