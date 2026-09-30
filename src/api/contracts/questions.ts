export interface PreferencePoleDto {
  emoji: string
  title: string
  description: string
}

export interface PreferenceQuestionDto {
  id: number
  question: string
  subtitle: string | null
  left: PreferencePoleDto
  right: PreferencePoleDto
}

export interface PreferenceQuestionListResponse {
  items: PreferenceQuestionDto[]
}
