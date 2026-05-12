import { keepPreviousData, useQuery } from '@tanstack/react-query'
import {
  fetchDistrictSummary,
  fetchDistrictHotplaces,
  type DistrictSummaryResponse,
  type HotplaceRealtimeItem,
} from '../realtime'
import type { PageResponse } from '../likes'

// 자치구 날씨 summary — 백엔드 GET /realtime/districts/{guName}/summary
export function useDistrictSummary(guName: string | undefined) {
  return useQuery<DistrictSummaryResponse>({
    queryKey: ['realtime', 'summary', guName ?? ''],
    queryFn: () => fetchDistrictSummary(guName ?? ''),
    enabled: Boolean(guName),
    staleTime: 5 * 60_000,
  })
}

// 자치구 핫플레이스 — 백엔드 GET /realtime/districts/{guName}/hotplaces?page=&size=
// offset 페이징 — PageNavigation 컴포넌트와 직결
// keepPreviousData → 페이지 전환 시 이전 페이지 잠깐 유지해 UI flicker 방지
export function useDistrictHotplaces(guName: string | undefined, page = 0, size = 3) {
  return useQuery<PageResponse<HotplaceRealtimeItem>>({
    queryKey: ['realtime', 'hotplaces', guName ?? '', page, size],
    queryFn: () => fetchDistrictHotplaces(guName ?? '', page, size),
    enabled: Boolean(guName),
    staleTime: 5 * 60_000,
    placeholderData: keepPreviousData,
  })
}
