import { useState } from 'react'
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

// Dumb 컴포넌트 — page/filter 는 부모(ShopListPage) 가 보유, 본 컴포넌트는 props 만 받음.
// 내부 상태는 검색 입력 버퍼 + 좋아요 낙관 토글뿐.
export interface ShopListPanelProps {
  title?: string
  shops: ShopSummaryResponse[]
  currentPage: number
  totalPages: number
  totalElements: number
  onPageChange: (page: number) => void
  activeFilters: { recruiting: boolean; cafe: boolean; liked: boolean }
  onFilterToggle: (id: 'recruiting' | 'cafe' | 'liked') => void
  /** 현재 선택된 동 이름 — ResultSummary location 표시용 */
  locationLabel?: string
  onShopClick?: (id: number) => void
  onAdminDongChange?: (item: DongSuggestionItem) => void
  className?: string
}

const FILTERS: Array<{ id: 'recruiting' | 'cafe' | 'liked'; label: string }> = [
  { id: 'recruiting', label: '모집중' },
  { id: 'cafe', label: '카페, 디저트' },
  { id: 'liked', label: '찜' },
]

export function ShopListPanel({
  title = '동네 가게 추천',
  shops,
  currentPage,
  totalPages,
  totalElements,
  onPageChange,
  activeFilters,
  onFilterToggle,
  locationLabel,
  onShopClick,
  onAdminDongChange,
  className,
}: ShopListPanelProps) {
  // 검색 입력 버퍼 (자동완성용) — 자동완성 클릭 시 onAdminDongChange 로 부모에 전달
  const [search, setSearch] = useState('')
  const [focused, setFocused] = useState(false)
  const { data: suggestData } = useDongSuggestions(search)
  const { requireLogin, loginDialog } = useLoginGate()
  const qc = useQueryClient()
  // 좋아요 낙관적 토글 — refetch 이전까지 UI 즉시 반영
  const [likedOverrides, setLikedOverrides] = useState<Record<number, boolean>>({})

  const handleToggleLike = async (shopId: number) => {
    if (!requireLogin({ action: '좋아요' })) return
    const current =
      likedOverrides[shopId] ?? shops.find((s) => s.id === shopId)?.likedByCurrentUser ?? false
    setLikedOverrides((p) => ({ ...p, [shopId]: !current }))
    try {
      const res = await toggleStoreLike(shopId)
      setLikedOverrides((p) => ({ ...p, [shopId]: res.liked }))
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
    setFocused(false)
    onAdminDongChange?.(item)
  }

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
                  aria-selected={item.name === search}
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
          countLabel={`동네 전체 ${totalElements}개`}
          location={locationLabel || undefined}
        />
        <FilterChipRow
          filters={FILTERS.map((f) => ({ ...f, active: activeFilters[f.id] }))}
          onToggle={(id) => onFilterToggle(id as 'recruiting' | 'cafe' | 'liked')}
        />
        <div className="flex min-h-px w-full flex-1 flex-col items-center gap-lg overflow-y-auto py-xxs">
          {shops.length === 0 ? (
            <div className="flex w-full flex-1 flex-col items-center justify-center gap-xs py-2xl text-center">
              <p className="text-body-l font-bold text-text-primary">가게가 없어요</p>
              <p className="text-body font-normal text-text-tertiary">
                조건을 바꿔서 다시 검색해보세요
              </p>
            </div>
          ) : (
            shops.map((s, i) => (
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
        {totalPages > 1 && (
          <PageNavigation current={currentPage} total={totalPages} onChange={onPageChange} />
        )}
      </div>
      {loginDialog}
    </aside>
  )
}
