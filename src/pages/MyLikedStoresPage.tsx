import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import { useQueryClient, type InfiniteData } from '@tanstack/react-query'
import { HeaderNav } from '@/components/layout/HeaderNav'
import { SearchInput } from '@/components/ui/SearchInput'
import { Highlight } from '@/components/ui/Highlight'
import { ShopCard } from '@/features/shop/components/ShopCard'
import { useAuth } from '@/lib/auth'
import { useIntersection } from '@/lib/useIntersection'
import { useInfiniteMyLikedStores } from '@/api/queries/useMyLikes'
import { toggleStoreLike } from '@/api/stores'
import type { LikedStoreResponse, CursorPageResponse } from '@/api/likes'

const SUGGEST_LIMIT = 6

// 좋아요한 가게 — 서버사이드 검색(q) + 자동완성 dropdown + 무한 스크롤 + 즉시 좋아요 취소(낙관적)
export function MyLikedStoresPage() {
  const nav = useNavigate()
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [debounced, setDebounced] = useState('')
  const [focused, setFocused] = useState(false)
  const [unliking, setUnliking] = useState<Set<number>>(new Set())

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
  } = useInfiniteMyLikedStores(debounced)

  const items = useMemo(
    () => data?.pages.flatMap((p) => p?.items ?? []).filter(Boolean) ?? [],
    [data],
  )
  const isSearching = debounced.length > 0
  const searchTrim = search.trim()
  const suggestions = useMemo(() => {
    if (!searchTrim) return []
    const q = searchTrim.toLowerCase()
    // 가게 이름만 매칭 — placeholder 와 일치
    return items.filter((s) => s.name.toLowerCase().includes(q)).slice(0, SUGGEST_LIMIT)
  }, [items, searchTrim])
  const showSuggestions = focused && searchTrim.length > 0 && suggestions.length > 0

  const sentinelRef = useIntersection(
    () => {
      if (hasNextPage && !isFetchingNextPage) void fetchNextPage()
    },
    { enabled: hasNextPage && !isFetchingNextPage },
  )

  const handleUnlike = async (storeId: number) => {
    if (unliking.has(storeId)) return
    setUnliking((prev) => new Set(prev).add(storeId))
    type InfStores = InfiniteData<CursorPageResponse<LikedStoreResponse>>
    const snapshots = queryClient.getQueriesData<InfStores>({ queryKey: ['likes', 'stores'] })
    queryClient.setQueriesData<InfStores>({ queryKey: ['likes', 'stores'] }, (old) => {
      if (!old) return old
      return {
        ...old,
        pages: old.pages.map((p) => ({
          ...p,
          items: p.items.filter((s) => s.storeId !== storeId),
        })),
      }
    })
    try {
      await toggleStoreLike(storeId)
      void queryClient.invalidateQueries({ queryKey: ['likes', 'stores'] })
    } catch (e) {
      console.error('[liked-stores] unlike failed:', e)
      for (const [key, val] of snapshots) queryClient.setQueryData(key, val)
    } finally {
      setUnliking((p) => {
        const next = new Set(p)
        next.delete(storeId)
        return next
      })
    }
  }

  if (!user) return null

  return (
    <div className="flex min-h-screen flex-col bg-surface-subtle/40">
      <HeaderNav user={user} onMyPage={() => nav('/mypage')} />
      <main className="mx-auto flex w-full max-w-[640px] flex-1 flex-col gap-md px-md py-2xl">
        <header className="flex items-center gap-sm">
          <button
            type="button"
            onClick={() => nav('/mypage')}
            aria-label="뒤로"
            className="cursor-pointer text-h3 text-text-tertiary hover:text-text-primary"
          >
            ←
          </button>
          <h1 className="text-h2 font-bold text-text-primary">좋아요 가게</h1>
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
            placeholder="가게 이름을 검색해보세요"
            className="w-full"
          />
          {showSuggestions && (
            <ul
              role="listbox"
              aria-label="좋아요한 가게 자동완성"
              className="absolute left-0 right-0 top-full z-10 mt-xs flex w-full flex-col items-stretch overflow-clip rounded-md border border-border-default bg-neutral-white shadow-md"
            >
              {suggestions.map((s) => (
                <li key={s.likeId}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={false}
                    onMouseDown={(e) => {
                      e.preventDefault()
                      setSearch(s.name)
                      setFocused(false)
                    }}
                    className="flex w-full flex-col items-start gap-xxs px-md py-sm text-left transition-colors hover:bg-surface-subtle"
                  >
                    <span className="text-body font-medium text-text-primary">
                      <Highlight text={s.name} match={searchTrim} />
                    </span>
                    <span className="text-body-s font-normal text-text-tertiary">
                      {s.category}
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
              <p className="text-body-l font-bold text-text-primary">좋아요한 가게가 없어요</p>
              <p className="text-body font-normal text-text-tertiary">
                마음에 드는 가게에 하트를 눌러두면 여기서 모아 볼 수 있어요
              </p>
              <button
                type="button"
                onClick={() => nav('/shops', { viewTransition: true })}
                className="mt-sm cursor-pointer rounded-md bg-brand-primary px-md py-sm text-body-l font-bold text-neutral-white drop-shadow-[0px_4px_24px_rgba(37,88,232,0.14)] hover:bg-brand-primary-hover"
              >
                가게 둘러보기
              </button>
            </div>
          )
        ) : (
          <>
            <div className="flex flex-col gap-md">
              {items.map((s) => (
                <ShopCard
                  key={s.likeId}
                  id={String(s.storeId)}
                  image={s.imageUrl}
                  name={s.name}
                  category={s.category}
                  description={s.description ?? s.address}
                  status={s.status ?? null}
                  participantCurrent={s.participantCurrent}
                  participantTotal={s.participantTotal}
                  liked
                  onClick={() => nav(`/shops/${s.storeId}`, { viewTransition: true })}
                  onToggleLike={() => handleUnlike(s.storeId)}
                />
              ))}
            </div>
            {/* 무한 스크롤 sentinel */}
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
