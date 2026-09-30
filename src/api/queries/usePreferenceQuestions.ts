import { PREFERENCE_QUESTIONS } from '@/features/neighborhood-finder/data/preferenceQuestions'
import type { PreferenceQuestionListResponse } from '../contracts/questions'

// 질문 리스트는 백엔드에 엔드포인트가 없어서 프론트 로컬 상수로 제공
// (전송/분석만 /dongne/recommendations 로 백엔드에 보냄)
export const preferenceQuestionsKey = ['preferences', 'questions'] as const

export function usePreferenceQuestions(): {
  data: PreferenceQuestionListResponse
  isLoading: false
  error: null
  refetch: () => void
} {
  return {
    data: {
      items: PREFERENCE_QUESTIONS.map((q) => ({
        id: q.id,
        question: q.question,
        subtitle: q.subtitle ?? null,
        left: q.left,
        right: q.right,
      })),
    },
    isLoading: false,
    error: null,
    refetch: () => {},
  }
}
