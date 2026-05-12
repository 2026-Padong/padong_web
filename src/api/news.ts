import { apiGet } from './client'
import type { ResponseDTO } from './contracts/auth'

// 백엔드 News DTO (swagger 일치)
export interface News {
  adminDongId: number
  title: string
  description: string
  originallink: string
  thumbnail: string
}

export interface NewsResponse {
  items: News[]
}

// 프론트는 동네 설정 구조와 동일하게 adminDongId 기반으로 요청
// (백엔드는 추후 ?adminDongId= 시그니처로 정합 예정 — 현재 swagger 는 ?dongne= name)
export async function fetchNewsByAdminDong(adminDongId: number): Promise<News[]> {
  if (!adminDongId) return []
  const res = await apiGet<ResponseDTO<NewsResponse>>('/news/search', { adminDongId })
  return res.data.items ?? []
}

// GET /news/random?size=N — 메인페이지용 랜덤 뉴스 (로그인 필요)
export async function fetchRandomNews(size = 3): Promise<News[]> {
  const res = await apiGet<ResponseDTO<NewsResponse>>('/news/random', { size })
  return res.data.items ?? []
}
