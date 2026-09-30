import { apiGet } from './client'
import type { ResponseDTO } from './contracts/auth'
import type { PageResponse } from './likes'

// 백엔드 DistrictRealtime 분할 endpoint (swagger 일치)
//   GET /realtime/districts/{guName}/summary   → DistrictSummaryResponse
//   GET /realtime/districts/{guName}/hotplaces?cursor=&size= → CursorPageResponse<HotplaceRealtimeItem>

export interface WeatherSummary {
  weatherStatus: string
  temperature: string
  sensibleTemperature: string
  humidity: string
  fineDustStatus: string
  fineDust: string
  precipitationProbability: string
}

export interface DistrictSummaryResponse {
  guName: string
  selectedAreaNm: string
  summary: WeatherSummary
}

export interface HotplacePopulation {
  min: string
  max: string
  display: string
  congestionLevel: string
  congestionMessage: string
}

export interface HotplaceRealtimeItem {
  areaNm: string
  thumbnail: string
  category: string
  roadAddr: string
  eventNm: string
  weather: WeatherSummary
  population: HotplacePopulation
  age?: { dominantGroup?: string; dominantRate?: string }
  gender?: { maleRate?: string; femaleRate?: string }
  transport?: unknown
  roadTraffic?: { status?: string; speed?: string }
  /** 측정 시각 — Seoul Open API 의 PPLTN_TIME/WTHR_TIME 노출. "YYYY-MM-DD HH:mm" 형식 */
  dataTime?: string
}

// GET /realtime/districts/{guName}/summary
export async function fetchDistrictSummary(guName: string): Promise<DistrictSummaryResponse> {
  const res = await apiGet<ResponseDTO<DistrictSummaryResponse>>(
    `/realtime/districts/${encodeURIComponent(guName)}/summary`,
  )
  return res.data
}

// GET /realtime/districts/{guName}/hotplaces?page=&size= (offset 페이징)
export async function fetchDistrictHotplaces(
  guName: string,
  page = 0,
  size = 3,
): Promise<PageResponse<HotplaceRealtimeItem>> {
  const res = await apiGet<ResponseDTO<PageResponse<HotplaceRealtimeItem>>>(
    `/realtime/districts/${encodeURIComponent(guName)}/hotplaces`,
    { page, size },
  )
  return res.data
}
