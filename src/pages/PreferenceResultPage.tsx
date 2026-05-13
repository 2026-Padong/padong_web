import { useEffect, useMemo, useState } from 'react'
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
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined)
  // DB(엔티티)에 저장된 답변 → 추천 결과를 항상 백엔드 기준으로 조회 (메모리 캐시 shortcut X)
  const recQuery = usePreferenceRecommendation()
  const rec = recQuery.data ?? undefined
  // 좋아요 optimistic update 를 위해 query key 직접 사용
  const PREFERENCE_REC_KEY = ['preference', 'recommendation'] as const
  const { requireLogin, loginDialog } = useLoginGate()
  const qc = useQueryClient()
  const track = useRecommendationTracking()

  // "다시 설문하기" — localStorage 폴백 비우고 캐시 정리 후 설문 페이지로.
  // PreferencePage 가 state.restart 를 보면 자동 redirect 우회.
  // 새 답변 제출 시 백엔드가 entity upsert 하므로 DB 답변도 자연스럽게 갱신됨.
  const handleRestart = () => {
    clearPreferenceAnswers()
    qc.removeQueries({ queryKey: ['preference', 'me', 'answers', 'check'] })
    qc.removeQueries({ queryKey: ['preference', 'recommendation'] })
    nav('/finder/preference', { state: { restart: true }, replace: true })
  }

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
    const prev = qc.getQueryData<DongneRecommendationResponse>(PREFERENCE_REC_KEY)
    if (!prev) return
    // optimistic
    qc.setQueryData<DongneRecommendationResponse>(PREFERENCE_REC_KEY, {
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
      qc.setQueryData<DongneRecommendationResponse>(PREFERENCE_REC_KEY, (old) =>
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
      qc.setQueryData(PREFERENCE_REC_KEY, prev)
    }
  }

  // 취향 추천 카드 — 안전·주거·인구 3 chip 으로 표기 (출퇴근/유동 X)
  const allItems = useMemo(() => {
    if (!rec) return []
    return rec.page.content.map((m) => mobilityToResultDtoForPreference(m))
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

  const userTypeMeta = resolveUserType(rec?.userType)
  const resultTitle = userTypeMeta.display
  const resultSubDescription = userTypeMeta.description

  // 디버그 — 결과 페이지 상태/응답 추적 (console.group 으로 라벨링)
  useEffect(() => {
    console.groupCollapsed(
      `[PreferenceResult] status=${recQuery.status} fetchStatus=${recQuery.fetchStatus} items=${allItems.length}`,
    )
    console.log('recQuery.isPending:', recQuery.isPending)
    console.log('recQuery.isFetching:', recQuery.isFetching)
    console.log('recQuery.isError:', recQuery.isError)
    if (recQuery.error) console.error('recQuery.error:', recQuery.error)
    console.log('recQuery.dataUpdatedAt:', recQuery.dataUpdatedAt && new Date(recQuery.dataUpdatedAt).toISOString())
    console.log('rec (data):', rec)
    console.log('  userType:', rec?.userType)
    console.log('  page.content.length:', rec?.page?.content?.length)
    console.log('  page.totalElements:', rec?.page?.totalElements)
    console.log('  first content item:', rec?.page?.content?.[0])
    console.log('allItems.length:', allItems.length)
    console.log('current pageItems:', pageItems.length, 'page=', page, '/', totalPages)
    console.log(
      'EmptyState branch:',
      recQuery.isPending ? 'LOADING' : !rec ? 'NO_ANSWERS' : allItems.length === 0 ? 'NO_RESULTS' : 'OK',
    )
    console.groupEnd()
  }, [
    recQuery.status,
    recQuery.fetchStatus,
    recQuery.isPending,
    recQuery.isFetching,
    recQuery.isError,
    recQuery.error,
    recQuery.dataUpdatedAt,
    rec,
    allItems.length,
    pageItems.length,
    page,
    totalPages,
  ])

  return (
    <div className="flex min-h-screen w-full pb-14 lg:pb-0">
      <SideNav activeType="Custom" />
      {recQuery.isPending ? (
        <div className="flex w-full items-center justify-center p-xl md:w-[420px] md:shrink-0 md:min-h-screen">
          <EmptyState title="추천 결과를 불러오는 중..." message="" />
        </div>
      ) : !rec ? (
        <div className="flex w-full items-center justify-center p-xl md:w-[420px] md:shrink-0 md:min-h-screen">
          <EmptyState
            title="추천 결과가 없어요"
            message="취향 설문을 먼저 진행해주세요"
          />
        </div>
      ) : allItems.length === 0 ? (
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
