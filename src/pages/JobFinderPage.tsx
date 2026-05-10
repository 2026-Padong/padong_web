import { useState } from 'react'
import { useSearchParams } from 'react-router'
import { SideNav } from '@/components/layout/SideNav'
import { BottomNav } from '@/components/layout/BottomNav'
import { JobSearchTop } from '@/features/neighborhood-finder/components/JobSearchTop'
import { ResultListPanelExpanded } from '@/features/neighborhood-finder/components/ResultListPanelExpanded'
import { DetailPanel } from '@/features/neighborhood-finder/components/DetailPanel'
import { KakaoMap } from '@/components/map/KakaoMap'
import { ErrorState } from '@/components/ui/ErrorState'
import { Skeleton } from '@/components/ui/Skeleton'
import { useResults } from '@/api/queries/useResults'
import type { ResultDto } from '@/api/contracts/results'

// 결과 카드 1개 → DetailPanel 표시용 풀 데이터로 변환 (mock — 일부는 tags 파싱, 일부는 sample)
function buildDetailProps(r: ResultDto) {
  const safetyGrade = (r.tags[0]?.match(/[A-E]/) ?? ['A'])[0]
  const commute = r.tags[1] ?? '35분'
  const rentTag = r.tags[2] ?? '월세 500/45'
  const flow = r.tags[3]?.replace(/[^0-9,]/g, '') || '8,920'
  // hash-based 변주 (id 기반 결정적 점수)
  const hash = [...r.id].reduce((a, c) => a + c.charCodeAt(0), 0)
  const grade = (offset: number) => ['A', 'A', 'B', 'B', 'C'][((hash + offset) % 5)]
  return {
    score: r.score,
    dong: r.dong,
    fullAddress: r.fullAddress,
    rows: [
      [
        { label: '출퇴근', value: commute },
        { label: '안전등급', value: safetyGrade },
      ],
      [
        { label: '인구밀도', value: '12,340' },
        { label: '유동인구', value: flow },
      ],
    ],
    badges: [
      { category: '생활', grade: grade(0) },
      { category: '교통', grade: grade(1) },
      { category: '화재', grade: grade(2) },
      { category: '범죄', grade: grade(3) },
    ],
    rents: [
      { iconType: 'Dandok' as const, title: '단독/다가구', meta: '월세 200/30 · 전세 8,000 만원 · 매매 18,000 만원' },
      { iconType: 'Yeonlip' as const, title: '연립/다세대', meta: '월세 250/32 · 전세 9,500 만원 · 매매 22,000 만원' },
      { iconType: 'Apart' as const, title: '아파트', meta: `${rentTag} · 전세 18,000 만원 · 매매 45,000 만원` },
      { iconType: 'Opistel' as const, title: '오피스텔', meta: '월세 300/38 · 전세 12,000 만원 · 매매 28,000 만원' },
    ],
    cells: [
      { type: 'transit' as const, value: commute },
      { type: 'car' as const, value: `${(parseInt(commute) * 0.7).toFixed(1)}분` },
      { type: 'walk' as const, value: `${(parseInt(commute) * 4).toFixed(1)}분` },
    ],
  }
}

export function JobFinderPage() {
  const [params, setParams] = useSearchParams()
  const isMulti = params.get('multi') === '1'
  // 통일된 패턴: input은 임시 버퍼, destinations는 자동완성 클릭으로만 추가됨
  const [destination, setDestination] = useState('')
  const [destinations, setDestinations] = useState<string[]>([])
  const [page, setPage] = useState(1)
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined)

  const MAX_DESTINATIONS = isMulti ? 5 : 1
  const primaryDestination = destinations[0] ?? ''
  const hasSearched = destinations.length > 0
  const { data, isLoading, error, refetch } = useResults({
    multi: isMulti,
    destination: primaryDestination || undefined,
    enabled: hasSearched,
  })

  const handleModeChange = (m: 'single' | 'multi') => {
    if (m === 'multi') setParams({ multi: '1' })
    else setParams({})
    setPage(1)
    // 모드 전환 시 destinations + input + selectedId 모두 초기화
    setDestinations([])
    setDestination('')
    setSelectedId(undefined)
  }

  const handleDestinationChange = (v: string) => {
    setDestination(v)
    setPage(1)
  }

  // 자동완성 클릭으로만 칩 추가 — 타이핑은 추가 안 함
  const handleAddDestination = (v: string) => {
    const trimmed = v.trim()
    if (!trimmed || destinations.includes(trimmed)) {
      setDestination('')
      return
    }
    if (destinations.length >= MAX_DESTINATIONS) {
      // 단일 모드: 1개 도달 시 새로 추가 → 기존 칩 교체
      if (!isMulti) {
        setDestinations([trimmed])
        setDestination('')
        setPage(1)
        setSelectedId(undefined) // 검색 변경 → 선택 초기화
      } else {
        setDestination('')
      }
      return
    }
    setDestinations((prev) => [...prev, trimmed])
    setDestination('')
    setPage(1)
    setSelectedId(undefined) // 검색 변경 → 선택 초기화
  }
  const handleRemoveDestination = (v: string) => {
    setDestinations((prev) => prev.filter((d) => d !== v))
    setPage(1)
    setSelectedId(undefined) // 검색 변경 → 선택 초기화
  }

  const ITEMS_PER_PAGE = 5
  const allItems = data?.items ?? []
  const total = data?.total ?? 0
  const totalPages = Math.max(1, Math.ceil(total / ITEMS_PER_PAGE))
  const start = (page - 1) * ITEMS_PER_PAGE
  const items = allItems.slice(start, start + ITEMS_PER_PAGE)
  // 자동 선택 X — 명시적 클릭 시에만 selected
  const effectiveSelectedId = selectedId
  const selectedResult = effectiveSelectedId
    ? allItems.find((r) => r.id === effectiveSelectedId)
    : undefined
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
                    key={d}
                    type="button"
                    onClick={() => handleRemoveDestination(d)}
                    className="inline-flex items-center gap-xxs rounded-full bg-brand-primary-tint px-sm py-xxs text-body font-normal text-brand-primary transition-colors hover:bg-brand-primary hover:text-neutral-white"
                    aria-label={`${d} 제외`}
                  >
                    <span>{d}</span>
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
                  onClick={() => handleRemoveDestination(destinations[0])}
                  className="inline-flex items-center gap-xxs rounded-full bg-brand-primary-tint px-sm py-xxs text-body font-normal text-brand-primary transition-colors hover:bg-brand-primary hover:text-neutral-white"
                  aria-label={`${destinations[0]} 제외`}
                >
                  <span>{destinations[0]}</span>
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
            }))}
            selectedId={effectiveSelectedId}
            onSelect={setSelectedId}
            resultCount={total}
            resultSubtitle={summarySubtitle}
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        )}
      </aside>
      {hasSearched && selectedResult && (
        <div className="hidden md:block">
          <DetailPanel
            onBack={() => setSelectedId(undefined)}
            {...buildDetailProps(selectedResult)}
          />
        </div>
      )}
      <div className="hidden min-w-0 flex-1 md:block">
        <KakaoMap
          // list와 동일 페이지 결과만 표시 + 선택 시 해당 동네로 중심 이동(panTo)
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
          onDongClick={setSelectedId}
        />
      </div>
      <BottomNav activeType="Commute" className="lg:hidden" />
    </div>
  )
}
