import { apiGet } from './client'
import type { ResponseDTO } from './contracts/auth'
import type { BoundaryGeoJSON } from './mobility'

// GET /dongne/detail?adminDongCode=&arrivalAdminDongCode=&userId=
// 스웨거 components/schemas/DongneDetailResponse 그대로 미러

// DongneSummaryResponse
export interface DongRef {
  adminDongCode: string
  cityName: string
  districtName: string
  adminDongName: string
  address: string
  latitude: number
  longitude: number
}

// DongneMobilityResponse
export interface DongMobility {
  totalMobility: number | null
  avgTime: number | null
  startMonth: string | null
  endMonth: string | null
}

// SafetyIndexResponse
export interface SafetyIndex {
  overallScore: string         // 종합 안전지수 등급 (A~E)
  lifeSafetyGrade: string      // 생활안전
  trafficAccidentGrade: string // 교통사고
  fireGrade: string            // 화재
  crimeGrade: string           // 범죄
}

// ResidenceBuildingTypeResponse
export interface BuildingType {
  buildingTypeCode: 'APARTMENT' | 'OFFICETEL' | 'ROW_MULTIFAMILY' | 'DETACHED_MULTIFAMILY' | string
  buildingTypeLabel: string
}

// AdminDongRentPriceBuildingTypeResponse
export interface RentBuildingTypeEntry {
  buildingType: BuildingType
  sale: { amount: number | null }
  jeonse: { amount: number | null }
  monthlyRent: { deposit: number | null; monthlyRent: number | null }
}

// AdminDongRentPriceDetailResponse
export interface RentPrice {
  adminDongCode: string
  periodLabel: string
  contractPeriodStart: string
  contractPeriodEnd: string
  excludedCancelledSales: boolean
  dominantBuildingType: BuildingType | null
  buildingTypes: RentBuildingTypeEntry[]
}

// PathSummary
export interface PathSummary {
  totalTime: number | null
  totalDistance: number | null
  source: string | null
}

// Paths
export interface DongPaths {
  transit?: PathSummary
  car?: PathSummary
  pedestrian?: PathSummary
}

// DongneDetailResponse
export interface DongDetailResponse {
  departureDong: DongRef
  arrivalDong: DongRef | null
  mobility: DongMobility | null
  totalPopulation: number | null
  density: number | null
  safety: SafetyIndex | null
  rentPrice: RentPrice | null
  paths: DongPaths | null
  likeCount: number
  likedByCurrentUser: boolean
  boundary?: BoundaryGeoJSON
}

export async function fetchDongDetail(
  adminDongCode: string,
  arrivalAdminDongCode?: string,
): Promise<DongDetailResponse> {
  const res = await apiGet<ResponseDTO<DongDetailResponse>>('/dongne/detail', {
    adminDongCode,
    arrivalAdminDongCode,
  })
  return res.data
}
