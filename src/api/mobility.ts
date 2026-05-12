import { apiGet } from './client'
import type { ResponseDTO } from './contracts/auth'
import type { PageResponse } from './likes'
import type { LatLng } from './contracts/results'

// 백엔드 mobility API (라이브 응답 기준)
//   GET /mobility/arrival/{adminDongCode}        — single mode
//   GET /mobility/arrival/multi?arrivalDongCodes — multi mode
// 둘 다 PageResponse<MobilityResponse> 반환

export interface AdminDongDto {
  address: string
  adminDongCode: string
}

// GeoJSON Feature with Polygon — 행정동 폴리곤
export interface BoundaryGeoJSON {
  type: 'Feature'
  properties: {
    adminDongCode: string
    name: string
    guName: string
  }
  geometry: {
    type: 'Polygon' | 'MultiPolygon'
    coordinates: number[][][] | number[][][][]
  }
}

// 스웨거 정의값 — APARTMENT / OFFICETEL / ROW_MULTIFAMILY / DETACHED_MULTIFAMILY
export interface ResidenceBuildingType {
  buildingTypeCode: string
  buildingTypeLabel: string
}

// 스웨거 정의값 — SALE / JEONSE / MONTHLY_RENT
export interface RentPriceTradeType {
  tradeTypeCode: string
  tradeTypeLabel: string
}

export interface SelectedRentPriceValue {
  amount: number | null    // 매매/전세 (단위 만원)
  deposit?: number | null  // 월세 시 보증금
  monthlyRent?: number | null // 월세 시 월세금
}

export interface SelectedRentPrice {
  buildingType: ResidenceBuildingType
  tradeType: RentPriceTradeType
  price: SelectedRentPriceValue
}

// 스웨거 MobilitySimpleResponse — /mobility/arrival 응답 (라이브 응답엔 safetyGrade/rentPrice 아직 미적재)
export interface MobilityResponse {
  departureDong: AdminDongDto
  totalMobility: number
  /** single 모드만 보장. multi 모드는 누락 가능 */
  avgTime?: number
  /** 안전등급 — 스웨거 정의, 라이브 미적재 (적재 시 자동 표시) */
  safetyGrade?: string | null
  /** 대표 임대료 — 스웨거 정의, 라이브 미적재 (적재 시 자동 표시) */
  rentPrice?: SelectedRentPrice | null
  /** 좋아요 메타 — 스웨거에 인라인 적용 완료 */
  likeCount: number
  likedByCurrentUser: boolean
  boundary?: BoundaryGeoJSON
}

export interface MobilityFilters {
  page?: number
  size?: number
  minAvgTime?: number
  maxAvgTime?: number
  minEachAvgTime?: number
  maxEachAvgTime?: number
  departureDistrictNames?: string
  contractType?: string
  houseType?: string
  minSalePrice?: number
  maxSalePrice?: number
  minJeonseDeposit?: number
  maxJeonseDeposit?: number
  minMonthlyDeposit?: number
  maxMonthlyDeposit?: number
  minMonthlyRent?: number
  maxMonthlyRent?: number
}

export async function fetchMobilityArrival(
  adminDongCode: string,
  filters: MobilityFilters = {},
): Promise<PageResponse<MobilityResponse>> {
  const res = await apiGet<ResponseDTO<PageResponse<MobilityResponse>>>(
    `/mobility/arrival/${encodeURIComponent(adminDongCode)}`,
    filters as Record<string, string | number | undefined>,
  )
  return res.data
}

export async function fetchMobilityArrivalMulti(
  arrivalDongCodes: string[],
  filters: MobilityFilters = {},
): Promise<PageResponse<MobilityResponse>> {
  const res = await apiGet<ResponseDTO<PageResponse<MobilityResponse>>>(
    '/mobility/arrival/multi',
    {
      arrivalDongCodes: arrivalDongCodes.join(','),
      ...(filters as Record<string, string | number | undefined>),
    },
  )
  return res.data
}

// GeoJSON polygon coords → KakaoMap paths (LatLng[])
export function boundaryToPaths(b: BoundaryGeoJSON | undefined): LatLng[] | undefined {
  if (!b) return undefined
  const coords = b.geometry.coordinates as number[][][]
  // Polygon: outer ring at coords[0]; MultiPolygon: 첫 폴리곤 outer ring
  let outer: number[][]
  if (b.geometry.type === 'Polygon') {
    outer = coords[0]
  } else {
    // MultiPolygon — coords[0][0]
    outer = (coords as unknown as number[][][][])[0][0]
  }
  if (!outer || outer.length === 0) return undefined
  return outer.map(([lng, lat]) => ({ lat, lng }))
}

export function centerOfBoundary(b: BoundaryGeoJSON | undefined): LatLng | undefined {
  const paths = boundaryToPaths(b)
  if (!paths || paths.length === 0) return undefined
  let minLat = Infinity,
    maxLat = -Infinity,
    minLng = Infinity,
    maxLng = -Infinity
  for (const p of paths) {
    if (p.lat < minLat) minLat = p.lat
    if (p.lat > maxLat) maxLat = p.lat
    if (p.lng < minLng) minLng = p.lng
    if (p.lng > maxLng) maxLng = p.lng
  }
  return { lat: (minLat + maxLat) / 2, lng: (minLng + maxLng) / 2 }
}
