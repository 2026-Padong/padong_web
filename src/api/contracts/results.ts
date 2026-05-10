export interface LatLng {
  lat: number
  lng: number
}

export interface ResultDto {
  id: string
  image: string
  dong: string
  fullAddress: string
  liked: boolean
  tags: string[]
  /** 0~100 — Selected ScoreBar fill 비율 */
  score: number
  /** 행정동 폴리곤 외곽선 — 서버가 동네 검색 결과에 inline으로 동반 (KakaoMap polygon 직접 사용) */
  geometry?: LatLng[]
  /** 마커 표시용 중심 좌표 (centroid) — 서버 계산 */
  center?: LatLng
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
  /** 직장 위치 검색어 — mock에선 결과 셔플/스코어 조정 트리거로 사용 */
  destination?: string
}

export interface AnalyzeResponse {
  analysisId: string
  lifestyleId: string
}

export interface AnalyzeRequest {
  answers: Record<number, 1 | 2 | 3 | 4 | 5>
}
