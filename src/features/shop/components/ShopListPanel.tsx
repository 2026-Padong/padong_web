import { useState } from 'react'
import { useSearchParams } from 'react-router'
import { useQueryClient } from '@tanstack/react-query'
import { PageHeader } from '@/components/ui/PageHeader'
import { SearchInput } from '@/components/ui/SearchInput'
import { ResultSummary } from '@/components/ui/ResultSummary'
import { FilterChipRow } from '@/components/ui/FilterChipRow'
import { PageNavigation } from '@/components/ui/PageNavigation'
import { ShopCard } from './ShopCard'
import { cn } from '@/lib/cn'
import type { ShopSummaryResponse } from '@/api/contracts/shops'
import { useDongSuggestions, type DongSuggestionItem } from '@/api/queries/useDongSuggestions'
import { Highlight } from '@/components/ui/Highlight'
import { toggleStoreLike } from '@/api/stores'
import { useLoginGate } from '@/lib/useLoginGate'

// Figma 1:1: Tile · ShopListPanel (598:1662) > ShopListPanel COMPONENT (1715:6842)
// 420x900 V gap-lg items-start px-lg py-xl bg-white
// PanelHeader: PageHeader type=Shop title="동네 가게 추천"
// SearchInput (full width)
// PanelBody (flex-1 V gap-md w-full):
//   ResultSummary + FilterChipRow + ShopList (flex-1) + PageNavigation
export interface ShopListPanelProps {
  title?: string
  shops: ShopSummaryResponse[]
  onShopClick?: (id: number) => void
  /** 자동완성에서 동 선택 시 — 부모가 adminDongCode 받아 useShopList 파라미터로 전달 (서버 필터) */
  onAdminDongChange?: (item: DongSuggestionItem) => void
  className?: string
}

const FILTERS = [
  { id: 'recruiting', label: '모집중' },
  { id: 'cafe', label: '카페, 디저트' },
  { id: 'liked', label: '찜' },
]

const ITEMS_PER_PAGE = 4

export function ShopListPanel({
  title = '동네 가게 추천',
  shops,
  onShopClick,
  onAdminDongChange,
  className,
}: ShopListPanelProps) {
  // 통일된 패턴 (JobFinder): search = 입력 버퍼, query = 제출된 검색어
  // 자동완성 클릭 또는 Enter 로만 query 업데이트 → 그때만 리스트 필터 발동
  const [search, setSearch] = useState('')
  const [query, setQuery] = useState('')
  const [focused, setFocused] = useState(false)
  const { data: suggestData } = useDongSuggestions(search)
  const { requireLogin, loginDialog } = useLoginGate()
  const qc = useQueryClient()
  // 좋아요 낙관적 토글 — refetch 이전까지 UI 즉시 반영
  const [likedOverrides, setLikedOverrides] = useState<Record<number, boolean>>({})

  const handleToggleLike = async (shopId: number) => {
    if (!requireLogin({ action: '좋아요' })) return
    const current = likedOverrides[shopId] ?? shops.find((s) => s.id === shopId)?.likedByCurrentUser ?? false
    setLikedOverrides((p) => ({ ...p, [shopId]: !current }))
    try {
      const res = await toggleStoreLike(shopId)
      setLikedOverrides((p) => ({ ...p, [shopId]: res.liked }))
      // 내가 찜한 가게/목록 쿼리 갱신
      qc.invalidateQueries({ queryKey: ['stores'] })
      qc.invalidateQueries({ queryKey: ['likes', 'stores'] })
    } catch (e) {
      console.error('[shop-list:like-toggle] failed:', e)
      setLikedOverrides((p) => ({ ...p, [shopId]: current }))
    }
  }
  const suggestions = suggestData?.items ?? []
  const showSuggestions = focused && search.trim().length > 0 && suggestions.length > 0

  const submit = (item: DongSuggestionItem) => {
    setSearch(item.name)
    setQuery(item.name)
    setFocused(false)
    onAdminDongChange?.(item) // 부모가 adminDongCode 받아 useShopList 파라미터로 → 서버 필터
  }

  const [activeFilters, setActiveFilters] = useState<Record<string, boolean>>({})
  // page 는 URL 에 저장 (?page=N) — 상세 → 뒤로가기 시 위치 복원.
  const [searchParams, setSearchParams] = useSearchParams()
  const page = Math.max(1, Number(searchParams.get('page')) || 1)
  const setPage = (next: number) => {
    setSearchParams(
      (prev) => {
        const sp = new URLSearchParams(prev)
        if (next <= 1) sp.delete('page')
        else sp.set('page', String(next))
        return sp
      },
      { replace: false },
    )
  }

  // 클라이언트 필터는 칩 (status/category/liked) 만 — 동 필터는 백엔드가 adminDongCode 로 처리
  const filtered = shops.filter((s) => {
    if (activeFilters['recruiting'] && s.recruitmentStatus !== 'RECRUITING') return false
    const cat = s.categoryLabel
    if (activeFilters['cafe'] && !cat.includes('카페')) return false
    if (activeFilters['liked'] && !s.likedByCurrentUser) return false
    return true
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE))
  // 검색·필터 변경 시 page 가 totalPages 초과면 1로 리셋
  const safePage = Math.min(page, totalPages)
  const start = (safePage - 1) * ITEMS_PER_PAGE
  const visibleShops = filtered.slice(start, start + ITEMS_PER_PAGE)

  return (
    <aside
      className={cn(
        'flex w-full flex-col items-start gap-lg bg-neutral-white px-lg py-xl md:w-[420px] md:shrink-0 md:min-h-screen',
        className,
      )}
    >
      <div className="flex w-full items-center gap-xs">
        <PageHeader type="Shop" title={title} />
      </div>
      {/* 검색 + 자동완성 (JobFinder 와 동일 패턴) */}
      <div
        className="relative w-full"
        onFocus={() => setFocused(true)}
        onBlur={() => setTimeout(() => setFocused(false), 120)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && suggestions.length > 0) {
            e.preventDefault()
            submit(suggestions[0])
          }
        }}
      >
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="행정동 또는 지역명을 검색해보세요"
          className="w-full"
        />
        {showSuggestions && (
          <ul
            role="listbox"
            aria-label="행정동 자동완성"
            className="absolute left-0 right-0 top-full z-10 mt-xs flex w-full flex-col items-stretch overflow-clip rounded-md border border-border-default bg-neutral-white shadow-md"
          >
            {suggestions.map((item) => (
              <li key={item.adminDongCode}>
                <button
                  type="button"
                  role="option"
                  aria-selected={item.name === query}
                  onMouseDown={(e) => {
                    e.preventDefault()
                    submit(item)
                  }}
                  className="flex w-full flex-col items-start gap-xxs px-md py-sm text-left transition-colors hover:bg-surface-subtle"
                >
                  <span className="text-body font-medium text-text-primary">
                    <Highlight text={item.name} match={search.trim()} />
                  </span>
                  <span className="text-body-s font-normal text-text-tertiary">
                    <Highlight text={item.fullAddress} match={search.trim()} />
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="flex min-h-px w-full flex-1 flex-col items-start gap-md">
        <ResultSummary
          countLabel={`동네 전체 ${filtered.length}개`}
          location={query || undefined}
        />
        <FilterChipRow
          filters={FILTERS.map((f) => ({ ...f, active: activeFilters[f.id] }))}
          onToggle={(id) => setActiveFilters((s) => ({ ...s, [id]: !s[id] }))}
        />
        <div className="flex min-h-px w-full flex-1 flex-col items-center gap-lg overflow-y-auto py-xxs">
          {visibleShops.length === 0 ? (
            <div className="flex w-full flex-1 flex-col items-center justify-center gap-xs py-2xl text-center">
              <p className="text-body-l font-bold text-text-primary">가게가 없어요</p>
              <p className="text-body font-normal text-text-tertiary">
                조건을 바꿔서 다시 검색해보세요
              </p>
            </div>
          ) : (
            visibleShops.map((s, i) => (
              <div
                key={s.id}
                className="w-full animate-fade-in-up opacity-0"
                style={{ animationDelay: `${i * 60}ms`, animationFillMode: 'forwards' }}
              >
                <ShopCard
                  id={s.id}
                  image={s.thumbnailUrl || undefined}
                  name={s.name}
                  category={s.categoryLabel}
                  description={s.description}
                  participantCurrent={s.participantCurrent}
                  participantTotal={s.participantTotal}
                  recruitmentStatus={s.recruitmentStatus}
                  liked={likedOverrides[s.id] ?? s.likedByCurrentUser}
                  onClick={() => onShopClick?.(s.id)}
                  onToggleLike={() => handleToggleLike(s.id)}
                />
              </div>
            ))
          )}
        </div>
        {visibleShops.length > 0 && (
          <PageNavigation current={page} total={totalPages} onChange={setPage} />
        )}
      </div>
      {loginDialog}
    </aside>
  )
}
