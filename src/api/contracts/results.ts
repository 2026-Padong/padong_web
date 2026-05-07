export interface ResultDto {
  id: string
  image: string
  dong: string
  fullAddress: string
  liked: boolean
  tags: string[]
  /** 0~100 — Selected ScoreBar fill 비율 */
  score: number
}

export interface ResultListResponse {
  items: ResultDto[]
  total: number
  /** 추천 라이프스타일 분류 (예: efficient) */
  lifestyleId: string
}

export interface ResultListQuery {
  lifestyleId?: string
  multi?: boolean
}

export interface AnalyzeResponse {
  analysisId: string
  lifestyleId: string
}

export interface AnalyzeRequest {
  answers: Record<number, 1 | 2 | 3 | 4 | 5>
}
