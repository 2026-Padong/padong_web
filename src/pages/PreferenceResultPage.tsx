import { useMemo, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { SideNav } from '@/components/layout/SideNav'
import { BottomNav } from '@/components/layout/BottomNav'
import { LifestyleResultPanel } from '@/features/neighborhood-finder/components/LifestyleResultPanel'
import { RESULTS_PAGE_SIZE } from '@/features/neighborhood-finder/components/ResultListPanel'
import { DetailPanel } from '@/features/neighborhood-finder/components/DetailPanel'
import { KakaoMap } from '@/components/map/KakaoMap'
import { buildDetailProps, buildDetailPropsFromApi } from '@/features/neighborhood-finder/utils/buildDetailProps'
import { mobilityToResultDto } from '@/features/neighborhood-finder/utils/mobilityToResult'
import { EmptyState } from '@/components/ui/EmptyState'
import {
  recommendationKey,
  useRecommendation,
  type DongneRecommendationResponse,
} from '@/api/queries/useResults'
import { useDongDetail } from '@/api/queries/useDongDetail'
import { toggleDongneLike } from '@/api/likes'
import { useLoginGate } from '@/lib/useLoginGate'
import { useRecommendationTracking } from '@/lib/useRecommendationTracking'

export function PreferenceResultPage() {
  const [page, setPage] = useState(1)
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined)
  // useAnalyze 가 캐시에 넣어둔 백엔드 응답 ({userType, page: PageResponse<MobilityResponse>})
  const rec = useRecommendation()
  const { requireLogin, loginDialog } = useLoginGate()
  const qc = useQueryClient()
  const track = useRecommendationTracking()

  const handleSelect = (adminDongCode: string) => {
    setSelectedId(adminDongCode)
    track.onCardClick(adminDongCode)
  }
  const handleDeselect = () => {
    setSelectedId(undefined)
    track.onDetailClose()
  }

  const handleToggleLike = async (adminDongCode: string) => {
    if (!requireLogin({ action: '좋아요' })) return
    const prev = qc.getQueryData<DongneRecommendationResponse>(recommendationKey)
    if (!prev) return
    // optimistic
    qc.setQueryData<DongneRecommendationResponse>(recommendationKey, {
      ...prev,
      page: {
        ...prev.page,
        content: prev.page.content.map((m) =>
          m.departureDong.adminDongCode === adminDongCode
            ? {
                ...m,
                likedByCurrentUser: !m.likedByCurrentUser,
                likeCount: m.likeCount + (m.likedByCurrentUser ? -1 : 1),
              }
            : m,
        ),
      },
    })
    try {
      const result = await toggleDongneLike(adminDongCode)
      qc.setQueryData<DongneRecommendationResponse>(recommendationKey, (old) =>
        !old
          ? old
          : {
              ...old,
              page: {
                ...old.page,
                content: old.page.content.map((m) =>
                  m.departureDong.adminDongCode === adminDongCode
                    ? { ...m, likedByCurrentUser: result.liked, likeCount: result.likeCount }
                    : m,
                ),
              },
            },
      )
      track.onCardLike(adminDongCode, result.liked)
    } catch {
      qc.setQueryData(recommendationKey, prev)
    }
  }

  // 출퇴근과 동일하게 MobilityResponse → ResultDto (mobilityToResultDto 재사용)
  const allItems = useMemo(() => {
    if (!rec) return []
    return rec.page.content.map((m) => mobilityToResultDto(m))
  }, [rec])

  const total = allItems.length
  const totalPages = Math.max(1, Math.ceil(total / RESULTS_PAGE_SIZE))
  const start = (page - 1) * RESULTS_PAGE_SIZE
  const pageItems = allItems.slice(start, start + RESULTS_PAGE_SIZE)
  const selectedResult = selectedId ? allItems.find((r) => r.id === selectedId) : undefined
  const selectedRank = selectedResult
    ? allItems.findIndex((r) => r.id === selectedResult.id) + 1
    : 0
  const detailQuery = useDongDetail(selectedResult?.id)
  const detailProps = useMemo(() => {
    if (!selectedResult) return null
    return detailQuery.data
      ? buildDetailPropsFromApi(selectedResult, detailQuery.data)
      : buildDetailProps(selectedResult)
  }, [selectedResult, detailQuery.data])

  const resultTitle = rec?.userType ?? '내 취향 분석'

  return (
    <div className="flex min-h-screen w-full pb-14 lg:pb-0">
      <SideNav activeType="Custom" />
      {!rec || allItems.length === 0 ? (
        <div className="flex w-full items-center justify-center p-xl md:w-[420px] md:shrink-0 md:min-h-screen">
          <EmptyState
            title="추천 결과가 없어요"
            message="취향 설문을 먼저 진행해주세요"
          />
        </div>
      ) : (
        <LifestyleResultPanel
          title="내 취향 기반"
          resultTitle={resultTitle}
          resultDescription={`${total}개 동네를 추천했어요`}
          recommendedCount={total}
          cards={pageItems.map((r) => ({
            id: r.id,
            dong: r.dong,
            fullAddress: r.fullAddress,
            liked: r.liked,
            tags: r.tags,
            score: r.score,
            onToggleLike: () => handleToggleLike(r.id),
          }))}
          selectedId={selectedId}
          onSelect={handleSelect}
          currentPage={page}
          totalPages={totalPages}
          onPageChange={(p) => {
            setPage(p)
            handleDeselect()
          }}
        />
      )}
      {selectedResult && detailProps && (
        <div className="hidden md:block">
          <DetailPanel
            onBack={handleDeselect}
            {...detailProps}
            score={selectedRank}
          />
        </div>
      )}
      <div className="hidden min-w-0 flex-1 md:block">
        <KakaoMap
          center={selectedResult?.center}
          level={selectedResult ? 6 : 7}
          dongs={pageItems
            .filter((r) => r.geometry && r.geometry.length > 0)
            .map((r) => ({ id: r.id, name: r.dong, paths: r.geometry! }))}
          markers={pageItems
            .filter((r) => r.center)
            .map((r) => ({
              id: r.id,
              position: r.center!,
              label: r.dong,
              selected: r.id === selectedId,
            }))}
          selectedId={selectedId}
          onDongClick={handleSelect}
        />
      </div>
      <BottomNav activeType="Custom" className="lg:hidden" />
      {loginDialog}
    </div>
  )
}
