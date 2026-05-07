export interface PreferenceQuestionDto {
  id: number
  question: string
  subtitle: string | null
}

export interface PreferenceQuestionListResponse {
  items: PreferenceQuestionDto[]
}
