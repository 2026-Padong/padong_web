import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import { useQueryClient, type InfiniteData } from '@tanstack/react-query'
import { HeaderNav } from '@/components/layout/HeaderNav'
import { SearchInput } from '@/components/ui/SearchInput'
import { ResultCard } from '@/components/ui/ResultCard'
import { ResultListSummary } from '@/components/ui/ResultListSummary'
import { Highlight } from '@/components/ui/Highlight'
import { useAuth } from '@/lib/auth'
import { useIntersection } from '@/lib/useIntersection'
import { useInfiniteMyLikedDongs } from '@/api/queries/useMyLikes'
import { toggleDongneLike } from '@/api/likes'
import type { LikedDongneResponse, CursorPageResponse } from '@/api/likes'

const SUGGEST_LIMIT = 6

// 좋아요한 동네 — JobFinderPage 결과 리스트와 동일한 레이아웃
// (ResultListSummary 헤더 + ResultListPanel 스타일 카드 + 무한 스크롤)
export function MyLikedDongsPage() {
  const nav = useNavigate()
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [debounced, setDebounced] = useState('')
  const [focused, setFocused] = useState(false)
  const [unliking, setUnliking] = useState<Set<string>>(new Set())

  useEffect(() => {
    const t = setTimeout(() => setDebounced(search.trim()), 250)
    return () => clearTimeout(t)
  }, [search])

  useEffect(() => {
    if (!user) nav('/login', { replace: true })
  }, [user, nav])

  const {
    data,
    isError,
    isPending,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteMyLikedDongs(debounced)

  const items = useMemo(
    () => data?.pages.flatMap((p) => p?.items ?? []).filter(Boolean) ?? [],
    [data],
  )
  const firstPageCount = data?.pages[0]?.items.length ?? 0
  const isSearching = debounced.length > 0
  const countLabel = `${items.length}${hasNextPage ? '+' : ''}개`
  const subtitle = isSearching ? `검색 결과 ${countLabel}` : `좋아요한 동네 ${countLabel}`
  const searchTrim = search.trim()
  // 자동완성 dropdown — /dongs/search 와 동일 규칙 (행정동명 + 자치구명 + 전체주소)
  const suggestions = useMemo(() => {
    if (!searchTrim) return []
    const q = searchTrim.toLowerCase()
    return items
      .filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.guName.toLowerCase().includes(q) ||
          (d.fullAddress?.toLowerCase().includes(q) ?? false),
      )
      .slice(0, SUGGEST_LIMIT)
  }, [items, searchTrim])
  const showSuggestions = focused && searchTrim.length > 0 && suggestions.length > 0

  const sentinelRef = useIntersection(
    () => {
      if (hasNextPage && !isFetchingNextPage) void fetchNextPage()
    },
    { enabled: hasNextPage && !isFetchingNextPage },
  )

  const handleUnlike = async (code: string) => {
    if (unliking.has(code)) return
    setUnliking((prev) => new Set(prev).add(code))
    type InfDongs = InfiniteData<CursorPageResponse<LikedDongneResponse>>
    const snapshots = queryClient.getQueriesData<InfDongs>({ queryKey: ['likes', 'dongs'] })
    queryClient.setQueriesData<InfDongs>({ queryKey: ['likes', 'dongs'] }, (old) => {
      if (!old) return old
      return {
        ...old,
        pages: old.pages.map((p) => ({
          ...p,
          items: p.items.filter((d) => d.adminDongCode !== code),
        })),
      }
    })
    try {
      await toggleDongneLike(code)
      void queryClient.invalidateQueries({ queryKey: ['likes', 'dongs'] })
    } catch (e) {
      console.error('[liked-dongs] unlike failed:', e)
      for (const [key, val] of snapshots) queryClient.setQueryData(key, val)
    } finally {
      setUnliking((p) => {
        const next = new Set(p)
        next.delete(code)
        return next
      })
    }
  }

  if (!user) return null

  return (
    <div className="flex min-h-screen flex-col bg-surface-subtle/40">
      <HeaderNav user={user} onMyPage={() => nav('/mypage')} />
      <main className="mx-auto flex w-full max-w-[640px] flex-1 flex-col gap-md px-md py-2xl">
        <header className="flex flex-col gap-xxs">
          <div className="flex items-center gap-sm">
            <button
              type="button"
              onClick={() => nav('/mypage')}
              aria-label="뒤로"
              className="cursor-pointer text-h3 text-text-tertiary hover:text-text-primary"
            >
              ←
            </button>
            <h1 className="text-h2 font-bold text-text-primary">좋아요 동네</h1>
          </div>
          {user.adminDongName && (
            <button
              type="button"
              onClick={() => nav('/mypage/admin-dong', { viewTransition: true })}
              className="group inline-flex w-fit cursor-pointer items-center gap-xxs text-left text-body font-normal text-text-secondary transition-colors hover:text-brand-primary"
            >
              <span>현재 설정한 동네: {user.adminDongName}</span>
              <span
                aria-hidden
                className="text-text-tertiary transition-transform group-hover:translate-x-[2px] group-hover:text-brand-primary"
              >
                ›
              </span>
            </button>
          )}
        </header>

        <div
          className="relative w-full"
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 120)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && suggestions.length > 0) {
              e.preventDefault()
              setSearch(suggestions[0].name)
              setFocused(false)
            }
            if (e.key === 'Escape') setFocused(false)
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
              aria-label="좋아요한 동네 자동완성"
              className="absolute left-0 right-0 top-full z-10 mt-xs flex w-full flex-col items-stretch overflow-clip rounded-md border border-border-default bg-neutral-white shadow-md"
            >
              {suggestions.map((d) => (
                <li key={d.adminDongCode}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={false}
                    onMouseDown={(e) => {
                      e.preventDefault()
                      setSearch(d.name)
                      setFocused(false)
                    }}
                    className="flex w-full flex-col items-start gap-xxs px-md py-sm text-left transition-colors hover:bg-surface-subtle"
                  >
                    <span className="text-body font-medium text-text-primary">
                      <Highlight text={d.name} match={searchTrim} />
                    </span>
                    <span className="text-body-s font-normal text-text-tertiary">
                      <Highlight
                        text={d.fullAddress ?? `서울특별시 ${d.guName} ${d.name}`}
                        match={searchTrim}
                      />
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {isError ? (
          <p className="rounded-md bg-neutral-white p-lg text-body-l text-status-critical ring-1 ring-border-default">
            목록을 불러올 수 없어요
          </p>
        ) : isPending ? (
          <p className="rounded-md bg-neutral-white p-lg text-body-l text-text-tertiary ring-1 ring-border-default">
            불러오는 중...
          </p>
        ) : items.length === 0 ? (
          isSearching ? (
            <p className="rounded-md bg-neutral-white p-lg text-body font-normal text-text-tertiary ring-1 ring-border-default">
              검색 결과가 없어요
            </p>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center gap-xs py-2xl text-center">
              <p className="text-body-l font-bold text-text-primary">좋아요한 동네가 없어요</p>
              <p className="text-body font-normal text-text-tertiary">
                취향에 맞는 동네를 찾아 하트를 눌러보세요
              </p>
              <button
                type="button"
                onClick={() => nav('/finder/preference', { viewTransition: true })}
                className="mt-sm cursor-pointer rounded-md bg-brand-primary px-md py-sm text-body-l font-bold text-neutral-white drop-shadow-[0px_4px_24px_rgba(37,88,232,0.14)] hover:bg-brand-primary-hover"
              >
                동네 찾기
              </button>
            </div>
          )
        ) : (
          <>
            <ResultListSummary
              resultCount={items.length}
              title={isSearching ? '검색 결과' : '좋아요 동네'}
              subtitle={subtitle}
            />
            <div className="flex w-full flex-col items-center gap-xs">
              {items.map((d, i) => (
                <div
                  key={d.likeId}
                  className={
                    i < firstPageCount
                      ? 'w-full animate-fade-in-up opacity-0'
                      : 'w-full'
                  }
                  style={
                    i < firstPageCount
                      ? { animationDelay: `${i * 60}ms`, animationFillMode: 'forwards' }
                      : undefined
                  }
                >
                  <ResultCard
                    id={d.adminDongCode}
                    dong={d.name}
                    fullAddress={d.fullAddress ?? `서울특별시 ${d.guName} ${d.name}`}
                    liked
                    tags={d.tags ?? [d.guName]}
                    onToggleLike={() => handleUnlike(d.adminDongCode)}
                  />
                </div>
              ))}
            </div>
            <div ref={sentinelRef} aria-hidden className="h-px w-full" />
            {isFetchingNextPage && (
              <p className="py-md text-center text-body font-normal text-text-tertiary">
                더 불러오는 중...
              </p>
            )}
          </>
        )}
      </main>
    </div>
  )
}
