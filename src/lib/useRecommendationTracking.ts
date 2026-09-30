import { useEffect, useRef } from 'react'
import { useAuth } from '@/lib/auth'
import {
  logRecommendationClick,
  logRecommendationDwellTime,
  logRecommendationLike,
} from '@/api/recommendationLog'

// 추천 결과 UX 인스트루멘트 — best-effort (실패 무시)
// JobFinder / PreferenceResult 양쪽 공통
export function useRecommendationTracking() {
  const { user } = useAuth()
  const userId = user?.userId
  // dwell 측정: detail 열린 동 코드 + 시작 시각
  const dwellRef = useRef<{ code: string; at: number } | null>(null)

  const flushDwell = () => {
    const cur = dwellRef.current
    if (!cur || !userId) return
    const sec = Math.round((Date.now() - cur.at) / 1000)
    dwellRef.current = null
    if (sec <= 0) return
    logRecommendationDwellTime(userId, cur.code, sec).catch(() => {})
  }

  // 페이지 unmount 시 마지막 dwell flush
  useEffect(() => {
    return () => {
      flushDwell()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return {
    /** 카드 클릭 (DetailPanel 열림) */
    onCardClick: (adminDongCode: string) => {
      if (!userId) return
      logRecommendationClick(userId, adminDongCode).catch(() => {})
      flushDwell()
      dwellRef.current = { code: adminDongCode, at: Date.now() }
    },
    /** 카드 좋아요 토글 — 백엔드 토글 결과 (liked: true/false) 함께 */
    onCardLike: (adminDongCode: string, liked: boolean) => {
      if (!userId) return
      logRecommendationLike(userId, adminDongCode, liked).catch(() => {})
    },
    /** DetailPanel 닫힘 (다른 카드 클릭 X, 명시적 close) */
    onDetailClose: () => {
      flushDwell()
    },
  }
}
