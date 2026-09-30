import { apiGet } from './client'
import type { DistrictWithDongs } from './contracts/dongne'
import type { ResponseDTO } from './contracts/auth'

// 자치구별 행정동 트리 조회 — 회원가입 행정동 선택 cascading용
export async function fetchAdminDongTree(): Promise<DistrictWithDongs[]> {
  const res = await apiGet<ResponseDTO<DistrictWithDongs[]>>('/dongne/admin-dongs')
  return res.data
}
