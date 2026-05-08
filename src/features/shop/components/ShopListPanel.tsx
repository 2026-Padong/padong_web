import { useState } from 'react'
import { PageHeader } from '@/components/ui/PageHeader'
import { SearchInput } from '@/components/ui/SearchInput'
import { ResultSummary } from '@/components/ui/ResultSummary'
import { FilterChipRow } from '@/components/ui/FilterChipRow'
import { PageNavigation } from '@/components/ui/PageNavigation'
import { ShopCard } from './ShopCard'
import { cn } from '@/lib/cn'
import type { MockShop } from '@/data/mocks'

// Figma 1:1: Tile · ShopListPanel (598:1662) > ShopListPanel COMPONENT (1715:6842)
// 420x900 V gap-lg items-start px-lg py-xl bg-white
// PanelHeader: PageHeader type=Shop title="동네 가게 추천"
// SearchInput (full width)
// PanelBody (flex-1 V gap-md w-full):
//   ResultSummary + FilterChipRow + ShopList (flex-1) + PageNavigation
export interface ShopListPanelProps {
  title?: string
  shops: MockShop[]
  selectedId?: string
  location?: string
  onShopClick?: (id: string) => void
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
  selectedId,
  location = '연희동',
  onShopClick,
  className,
}: ShopListPanelProps) {
  const [search, setSearch] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, boolean>>({})
  const [page, setPage] = useState(1)
  const totalPages = Math.max(1, Math.ceil(shops.length / ITEMS_PER_PAGE))
  const start = (page - 1) * ITEMS_PER_PAGE
  const visibleShops = shops.slice(start, start + ITEMS_PER_PAGE)

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
      <SearchInput
        value={search}
        onChange={setSearch}
        placeholder="행정동 또는 지역명을 검색해보세요"
        className="w-full"
      />
      <div className="flex min-h-px w-full flex-1 flex-col items-start gap-md">
        <ResultSummary countLabel={`동네 전체 ${shops.length}개`} location={location} />
        <FilterChipRow
          filters={FILTERS.map((f) => ({ ...f, active: activeFilters[f.id] }))}
          onToggle={(id) => setActiveFilters((s) => ({ ...s, [id]: !s[id] }))}
        />
        <div className="flex min-h-px w-full flex-1 flex-col items-center gap-lg overflow-y-auto py-xxs">
          {visibleShops.map((s) => (
            <ShopCard
              key={s.id}
              id={s.id}
              image={s.image || undefined}
              name={s.name}
              category={s.category}
              description={s.description}
              participantCurrent={s.participantCurrent}
              participantTotal={s.participantTotal}
              status={s.status === 'closed' ? null : 'recruiting'}
              liked={s.id === selectedId ? true : s.liked}
              onClick={() => onShopClick?.(s.id)}
            />
          ))}
        </div>
        <PageNavigation current={page} total={totalPages} onChange={setPage} />
      </div>
    </aside>
  )
}
