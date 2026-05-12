import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router'
import { SideNav } from '@/components/layout/SideNav'
import { BottomNav } from '@/components/layout/BottomNav'
import { JobSearchTop } from '@/features/neighborhood-finder/components/JobSearchTop'
import { ResultListPanelExpanded } from '@/features/neighborhood-finder/components/ResultListPanelExpanded'
import { RESULTS_PAGE_SIZE } from '@/features/neighborhood-finder/components/ResultListPanel'
import { DetailPanel } from '@/features/neighborhood-finder/components/DetailPanel'
import { KakaoMap } from '@/components/map/KakaoMap'
import { ErrorState } from '@/components/ui/ErrorState'
import { Skeleton } from '@/components/ui/Skeleton'
import { useMobilityArrival, useMobilityArrivalMulti } from '@/api/queries/useMobility'
import { useDongDetail } from '@/api/queries/useDongDetail'
import { mobilityToResultDto } from '@/features/neighborhood-finder/utils/mobilityToResult'
import { buildDetailProps, buildDetailPropsFromApi } from '@/features/neighborhood-finder/utils/buildDetailProps'
import { useLoginGate } from '@/lib/useLoginGate'
import { toggleDongneLike, type PageResponse } from '@/api/likes'
import { useQueryClient } from '@tanstack/react-query'
import type { MobilityResponse } from '@/api/mobility'
import type { DongSuggestionItem } from '@/api/queries/useDongSuggestions'
import { useRecommendationTracking } from '@/lib/useRecommendationTracking'

export function JobFinderPage() {
  const [params, setParams] = useSearchParams()
  const isMulti = params.get('multi') === '1'
  // 통일된 패턴: input은 임시 버퍼, destinations는 자동완성 클릭으로만 추가됨
  // 백엔드 mobility API 가 adminDongCode 필요 → DongSuggestionItem 전체 보관
  const [destination, setDestination] = useState('')
  const [destinations, setDestinations] = useState<DongSuggestionItem[]>([])
  const [page, setPage] = useState(1)
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined)
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

  // 좋아요 토글 — mobility 쿼리 캐시 낙관적 업데이트 + 백엔드 sync
  const handleToggleLike = async (adminDongCode: string) => {
    if (!requireLogin({ action: '좋아요' })) return
    const queries = qc.getQueriesData<PageResponse<MobilityResponse>>({ queryKey: ['mobility'] })
    const snapshots = queries.map(([key, data]) => [key, data] as const)
    // optimistic
    queries.forEach(([key, data]) => {
      if (!data) return
      qc.setQueryData<PageResponse<MobilityResponse>>(key, {
        ...data,
        content: data.content.map((m) =>
          m.departureDong.adminDongCode === adminDongCode
            ? {
                ...m,
                likedByCurrentUser: !m.likedByCurrentUser,
                likeCount: m.likeCount + (m.likedByCurrentUser ? -1 : 1),
              }
            : m,
        ),
      })
    })
    try {
      const result = await toggleDongneLike(adminDongCode)
      // server-authoritative 값으로 재동기화
      queries.forEach(([key]) => {
        qc.setQueryData<PageResponse<MobilityResponse>>(key, (old) =>
          !old
            ? old
            : {
                ...old,
                content: old.content.map((m) =>
                  m.departureDong.adminDongCode === adminDongCode
                    ? { ...m, likedByCurrentUser: result.liked, likeCount: result.likeCount }
                    : m,
                ),
              },
        )
      })
      track.onCardLike(adminDongCode, result.liked)
    } catch {
      // rollback
      snapshots.forEach(([key, data]) => qc.setQueryData(key, data))
    }
  }

  const MAX_DESTINATIONS = isMulti ? 5 : 1
  const hasSearched = destinations.length > 0
  // multi 는 2개 이상이어야 결과 조회 가능
  const multiNeedsMore = isMulti && destinations.length < 2

  // 백엔드 mobility API 호출 (single / multi 분기)
  const singleQuery = useMobilityArrival(
    !isMulti && destinations.length > 0 ? destinations[0].adminDongCode : undefined,
  )
  // multi 는 2개 이상일 때만 호출 (백엔드 spec: < 2 면 400)
  const multiQuery = useMobilityArrivalMulti(
    isMulti && destinations.length >= 2 ? destinations.map((d) => d.adminDongCode) : [],
  )

  const isLoading = isMulti ? multiQuery.isLoading : singleQuery.isLoading
  const error = isMulti ? multiQuery.error : singleQuery.error
  const refetch = isMulti ? multiQuery.refetch : singleQuery.refetch

  // PageResponse<MobilityResponse> → ResultDto[] 매핑
  // single / multi 둘 다 PageResponse 동일 shape
  // 검색어 비어있거나 multi 가 부족(<2) 이면 결과 비움 (placeholderData stale 데이터 무시)
  const rawMobility = useMemo(() => {
    if (destinations.length === 0) return []
    if (isMulti && destinations.length < 2) return []
    const d = isMulti ? multiQuery.data : singleQuery.data
    return d?.content ?? []
  }, [isMulti, multiQuery.data, singleQuery.data, destinations.length])

  const allItems = useMemo(
    () => rawMobility.map((m) => mobilityToResultDto(m)),
    [rawMobility],
  )
  const total = allItems.length
  const totalPages = Math.max(1, Math.ceil(total / RESULTS_PAGE_SIZE))
  const start = (page - 1) * RESULTS_PAGE_SIZE
  const items = allItems.slice(start, start + RESULTS_PAGE_SIZE)
  const effectiveSelectedId = selectedId
  const selectedResult = effectiveSelectedId
    ? allItems.find((r) => r.id === effectiveSelectedId)
    : undefined
  const selectedRank = selectedResult
    ? allItems.findIndex((r) => r.id === selectedResult.id) + 1
    : 0

  // 선택된 동네 상세 — 백엔드 /dongne/detail
  // arrivalAdminDongCode 는 사용자가 입력한 직장 (single 모드의 첫 도착지)
  const detailQuery = useDongDetail(
    selectedResult?.id,
    !isMulti && destinations.length > 0 ? destinations[0].adminDongCode : undefined,
  )
  const detailProps = useMemo(() => {
    if (!selectedResult) return null
    return detailQuery.data
      ? buildDetailPropsFromApi(selectedResult, detailQuery.data)
      : buildDetailProps(selectedResult)
  }, [selectedResult, detailQuery.data])

  const handleModeChange = (m: 'single' | 'multi') => {
    if (m === 'multi') setParams({ multi: '1' })
    else setParams({})
    setPage(1)
    setDestinations([])
    setDestination('')
    setSelectedId(undefined)
  }

  const handleDestinationChange = (v: string) => {
    setDestination(v)
    setPage(1)
  }

  // 자동완성 클릭으로만 칩 추가 — 타이핑은 추가 안 함
  const handleAddDestination = (item: DongSuggestionItem) => {
    if (destinations.some((d) => d.adminDongCode === item.adminDongCode)) {
      setDestination('')
      return
    }
    if (destinations.length >= MAX_DESTINATIONS) {
      // 단일 모드: 1개 도달 시 새로 추가 → 기존 칩 교체
      if (!isMulti) {
        setDestinations([item])
        setDestination('')
        setPage(1)
        setSelectedId(undefined)
      } else {
        setDestination('')
      }
      return
    }
    setDestinations((prev) => [...prev, item])
    setDestination('')
    setPage(1)
    setSelectedId(undefined)
  }
  const handleRemoveDestination = (adminDongCode: string) => {
    setDestinations((prev) => prev.filter((d) => d.adminDongCode !== adminDongCode))
    setPage(1)
    setSelectedId(undefined)
  }
  // hint: 단일은 없음 / 다중은 0개일 때만 안내
  const hint = isMulti && destinations.length === 0
    ? `최대 ${MAX_DESTINATIONS}개 선택 가능`
    : undefined
  const summarySubtitle = isMulti
    ? `추천 동네 ${total}개 · ${destinations.length}개 직장 종합`
    : `추천 동네 ${total}개`

  return (
    <div className="flex h-screen overflow-hidden">
      <SideNav activeType="Commute" />
      <aside className="flex w-full flex-col items-center gap-sm px-lg py-xl md:w-[421px] md:shrink-0 md:min-h-screen">
        <JobSearchTop
          title="직장 위치 기반"
          mode={isMulti ? 'multi' : 'single'}
          onModeChange={handleModeChange}
          destination={destination}
          onDestinationChange={handleDestinationChange}
          onSubmitDestination={handleAddDestination}
          hint={hint}
        />
        {isMulti
          ? destinations.length > 0 && (
              <div className="flex w-full flex-wrap items-center gap-xs">
                {destinations.map((d) => (
                  <button
                    key={d.adminDongCode}
                    type="button"
                    onClick={() => handleRemoveDestination(d.adminDongCode)}
                    className="inline-flex items-center gap-xxs rounded-full bg-brand-primary-tint px-sm py-xxs text-body font-normal text-brand-primary transition-colors hover:bg-brand-primary hover:text-neutral-white"
                    aria-label={`${d.name} 제외`}
                  >
                    <span>{d.name}</span>
                    <span aria-hidden>×</span>
                  </button>
                ))}
                <span
                  className={`ml-auto text-body font-normal ${
                    destinations.length >= MAX_DESTINATIONS
                      ? 'text-status-warning'
                      : 'text-text-tertiary'
                  }`}
                  aria-live="polite"
                >
                  {destinations.length} / {MAX_DESTINATIONS}
                </span>
              </div>
            )
          : destinations.length > 0 && (
              <div className="flex w-full items-center gap-xs">
                <button
                  type="button"
                  onClick={() => handleRemoveDestination(destinations[0].adminDongCode)}
                  className="inline-flex items-center gap-xxs rounded-full bg-brand-primary-tint px-sm py-xxs text-body font-normal text-brand-primary transition-colors hover:bg-brand-primary hover:text-neutral-white"
                  aria-label={`${destinations[0].name} 제외`}
                >
                  <span>{destinations[0].name}</span>
                  <span aria-hidden>×</span>
                </button>
                <span
                  className="ml-auto text-body font-normal text-text-tertiary"
                  aria-live="polite"
                >
                  1 / 1
                </span>
              </div>
            )}
        {!hasSearched ? (
          <div
            className="flex flex-1 flex-col items-center justify-center gap-xs px-md py-2xl text-center"
            aria-live="polite"
          >
            <p className="text-subhead font-bold text-text-secondary">
              직장 위치를 입력해주세요
            </p>
            <p className="text-body-l font-normal text-text-tertiary">
              출퇴근 시간 기반으로 동네를 추천해드려요
            </p>
          </div>
        ) : multiNeedsMore ? (
          <div
            className="flex flex-1 flex-col items-center justify-center gap-xs px-md py-2xl text-center"
            aria-live="polite"
          >
            <p className="text-subhead font-bold text-text-secondary">
              직장 위치를 1개 더 입력해주세요
            </p>
            <p className="text-body-l font-normal text-text-tertiary">
              다중 모드는 2개 이상 직장의 공통 추천을 보여드려요
            </p>
          </div>
        ) : isLoading ? (
          <div
            className="flex w-full flex-col gap-md"
            aria-busy="true"
            aria-live="polite"
            aria-label="결과 불러오는 중"
          >
            <Skeleton className="h-[34px] w-full" />
            {[0, 1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-[100px] w-full" />
            ))}
          </div>
        ) : error ? (
          <div className="flex flex-1 items-center justify-center">
            <ErrorState onRetry={() => refetch()} />
          </div>
        ) : (
          <ResultListPanelExpanded
            results={items.map((r) => ({
              id: r.id,
              dong: r.dong,
              fullAddress: r.fullAddress,
              liked: r.liked,
              tags: r.tags,
              score: r.score,
              onToggleLike: () => handleToggleLike(r.id),
            }))}
            selectedId={effectiveSelectedId}
            onSelect={handleSelect}
            resultCount={total}
            resultSubtitle={summarySubtitle}
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        )}
      </aside>
      {hasSearched && selectedResult && detailProps && (
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
          dongs={items
            .filter((r) => r.geometry && r.geometry.length > 0)
            .map((r) => ({ id: r.id, name: r.dong, paths: r.geometry! }))}
          markers={items
            .filter((r) => r.center)
            .map((r) => ({
              id: r.id,
              position: r.center!,
              label: r.dong,
              selected: r.id === effectiveSelectedId,
            }))}
          selectedId={effectiveSelectedId}
          onDongClick={handleSelect}
          // 검색 변경 / 페이지 변경 시 강제 fitBounds (사용자 수동 줌 상태 리셋)
          fitBoundsKey={`${isMulti ? 'm' : 's'}:${destinations.map((d) => d.adminDongCode).join(',')}:${page}`}
        />
      </div>
      <BottomNav activeType="Commute" className="lg:hidden" />
      {loginDialog}
    </div>
  )
}
