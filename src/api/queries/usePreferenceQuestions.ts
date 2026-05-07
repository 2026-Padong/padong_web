import { useQuery } from '@tanstack/react-query'
import { apiGet } from '../client'
import type { PreferenceQuestionListResponse } from '../contracts/questions'

export const preferenceQuestionsKey = ['preferences', 'questions'] as const

export function usePreferenceQuestions() {
  return useQuery({
    queryKey: preferenceQuestionsKey,
    queryFn: () => apiGet<PreferenceQuestionListResponse>('/preferences/questions'),
    staleTime: Infinity,
  })
}
