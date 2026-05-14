import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useQueryClient } from '@tanstack/react-query'
import { clearPreferenceAnswers } from '@/lib/preferenceStorage'
import { SideNav } from '@/components/layout/SideNav'
import { BottomNav } from '@/components/layout/BottomNav'
import { LifestyleResultPanel } from '@/features/neighborhood-finder/components/LifestyleResultPanel'
import { RESULTS_PAGE_SIZE } from '@/features/neighborhood-finder/components/ResultListPanel'
import { DetailPanel } from '@/features/neighborhood-finder/components/DetailPanel'
import { KakaoMap } from '@/components/map/KakaoMap'
import { buildDetailProps, buildDetailPropsFromApi } from '@/features/neighborhood-finder/utils/buildDetailProps'
import { mobilityToResultDtoForPreference } from '@/features/neighborhood-finder/utils/mobilityToResult'
import type { ResultDto } from '@/api/contracts/results'
import { EmptyState } from '@/components/ui/EmptyState'
import { Chip } from '@/components/ui/Chip'
import {
  usePreferenceRecommendation,
  type DongneRecommendationResponse,
} from '@/api/queries/useResults'
import { useDongDetail } from '@/api/queries/useDongDetail'
import { toggleDongneLike } from '@/api/likes'
import { useLoginGate } from '@/lib/useLoginGate'
import { useRecommendationTracking } from '@/lib/useRecommendationTracking'
import { resolveUserType } from '@/features/neighborhood-finder/utils/userTypeMap'

export function PreferenceResultPage() {
  const nav = useNavigate()
  const [page, setPage] = useState(1)
  // 다른 페이지로 넘어가도 detail 패널 유지하려고 id 가 아닌 ResultDto 객체 보관.
  const [selectedItem, setSelectedItem] = useState<ResultDto | undefined>(undefined)

  // BE 페이징 직결 — page-1 (0-based), size=5
  const recQuery = usePreferenceRecommendation(page - 1, RESULTS_PAGE_SIZE)
  const rec = recQuery.data ?? undefined

  const { requireLogin, loginDialog } = useLoginGate()
  const qc = useQueryClient()
  const track = useRecommendationTracking()

  const handleRestart = () => {
    clearPreferenceAnswers()
    qc.removeQueries({ queryKey: ['preference', 'me', 'answers', 'check'] })
    qc.removeQueries({ queryKey: ['preference', 'recommendation'] })
    nav('/finder/preference', { state: { restart: true }, replace: true })
  }

  const handleSelect = (item: ResultDto) => {
    setSelectedItem(item)
    track.onCardClick(item.id)
  }
  const handleDeselect = () => {
    setSelectedItem(undefined)
    track.onDetailClose()
  }

  // 현재 페이지의 캐시만 optimistic update. 다른 페이지는 invalidate 로 refetch.
  const currentPageKey = ['preference', 'recommendation', page - 1, RESULTS_PAGE_SIZE] as const
  const handleToggleLike = async (adminDongCode: string) => {
    if (!requireLogin({ action: '좋아요' })) return
    const prev = qc.getQueryData<DongneRecommendationResponse>(currentPageKey)
    if (!prev) return
    qc.setQueryData<DongneRecommendationResponse>(currentPageKey, {
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
      // server-authoritative — 모든 페이지 캐시 갱신
      qc.invalidateQueries({ queryKey: ['preference', 'recommendation'] })
      track.onCardLike(adminDongCode, result.liked)
    } catch {
      qc.setQueryData(currentPageKey, prev)
    }
  }

  // 현재 페이지 카드들
  const pageItems = rec?.page.content.map((m) => mobilityToResultDtoForPreference(m)) ?? []
  const totalPages = Math.max(1, rec?.page.totalPages ?? 1)
  const totalElements = rec?.page.totalElements ?? 0

  // 선택된 가게 — pageItems 에 있으면 최신, 없으면 selectedItem 그대로 (다른 페이지일 때)
  const selectedResult =
    selectedItem &&
    (pageItems.find((r) => r.id === selectedItem.id) ?? selectedItem)
  // selectedRank — 서버 전체 기준 인덱스 추정. 페이지를 가로지를 땐 정확치 않으므로
  // 현재 페이지 내 순위만 표시. (BE 가 절대 순위 반환하면 그걸 사용)
  const selectedRank = selectedResult
    ? pageItems.findIndex((r) => r.id === selectedResult.id) + 1 + (page - 1) * RESULTS_PAGE_SIZE
    : 0

  const detailQuery = useDongDetail(selectedResult?.id)
  const detailProps = selectedResult
    ? detailQuery.data
      ? buildDetailPropsFromApi(selectedResult, detailQuery.data)
      : buildDetailProps(selectedResult)
    : null

  const userTypeMeta = resolveUserType(rec?.userType)
  const resultTitle = userTypeMeta.display
  const resultSubDescription = userTypeMeta.description

  return (
    <div className="flex min-h-screen w-full pb-14 lg:pb-0">
      <SideNav activeType="Custom" />
      {recQuery.isPending ? (
        <div className="flex w-full items-center justify-center p-xl md:w-[420px] md:shrink-0 md:min-h-screen">
          <EmptyState title="추천 결과를 불러오는 중..." message="" />
        </div>
      ) : !rec ? (
        <div className="flex w-full items-center justify-center p-xl md:w-[420px] md:shrink-0 md:min-h-screen">
          <EmptyState title="추천 결과가 없어요" message="취향 설문을 먼저 진행해주세요" />
        </div>
      ) : totalElements === 0 ? (
        <div className="flex w-full items-center justify-center p-xl md:w-[420px] md:shrink-0 md:min-h-screen">
          <EmptyState
            title="조건에 맞는 동네가 없어요"
            message="다른 답변으로 다시 시도해보세요"
          />
        </div>
      ) : (
        <LifestyleResultPanel
          title="내 취향 기반"
          resultTitle={resultTitle}
          resultDescription={resultSubDescription}
          onRestart={handleRestart}
          filterSlot={
            <div className="flex flex-wrap items-center justify-end gap-xs">
              {['자치구', '주거'].map((label) => (
                <Chip key={label} state="default" className="cursor-pointer whitespace-nowrap">
                  {label} ▾
                </Chip>
              ))}
            </div>
          }
          cards={pageItems.map((r) => ({
            id: r.id,
            dong: r.dong,
            fullAddress: r.fullAddress,
            liked: r.liked,
            tags: r.tags,
            score: r.score,
            onToggleLike: () => handleToggleLike(r.id),
          }))}
          selectedId={selectedResult?.id}
          onSelect={(id) => {
            const item = pageItems.find((r) => r.id === id)
            if (item) handleSelect(item)
          }}
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
            hideMobility
            placeImageUrl={
              detailQuery.data?.images?.[0]
              ?? `https://picsum.photos/seed/dong-${encodeURIComponent(selectedResult.id)}/640/400`
            }
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
              selected: r.id === selectedResult?.id,
            }))}
          selectedId={selectedResult?.id}
          onDongClick={(id) => {
            const item = pageItems.find((r) => r.id === id)
            if (item) handleSelect(item)
          }}
        />
      </div>
      <BottomNav activeType="Custom" className="lg:hidden" />
      {loginDialog}
    </div>
  )
}
