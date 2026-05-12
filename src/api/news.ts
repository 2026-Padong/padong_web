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

// GET /news/search?dongne={행정동 이름}
// dongne 는 행정동 한글명 (예: "연남동"). JWT 의 user.adminDongName 으로 호출
export async function fetchNewsByDong(dongne: string): Promise<News[]> {
  if (!dongne) return []
  const res = await apiGet<ResponseDTO<NewsResponse>>('/news/search', { dongne })
  return res.data.items ?? []
}

// GET /news/random?size=N — 메인페이지용 랜덤 뉴스 (로그인 필요)
export async function fetchRandomNews(size = 3): Promise<News[]> {
  const res = await apiGet<ResponseDTO<NewsResponse>>('/news/random', { size })
  return res.data.items ?? []
}
