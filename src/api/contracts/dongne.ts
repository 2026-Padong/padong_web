// 행정동 트리 — 자치구별로 그룹화된 행정동 목록
// 회원가입 시 거주/관리 행정동 선택용
export interface AdminDongItem {
  id: number
  name: string
  adminDongCode?: string
}

export interface DistrictWithDongs {
  guName: string
  dongs: AdminDongItem[]
}
