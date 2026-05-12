import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import { HeaderNav } from '@/components/layout/HeaderNav'
import { EmptyState } from '@/components/ui/EmptyState'
import { useAuth } from '@/lib/auth'
import { fetchNewsByAdminDong, type News } from '@/api/news'
import { fetchAdminDongTree } from '@/api/dongne'
import type { DistrictWithDongs } from '@/api/contracts/dongne'
import { AdminDongPicker } from '@/features/auth/components/AdminDongPicker'

// 뉴스 페이지 (/news)
// 선택한 동네의 뉴스 (기본값: user.adminDongId, AdminDongPicker 로 변경 가능)
export function NewsPage() {
  const nav = useNavigate()
  const { user } = useAuth()
  // 선택된 동네 id — 기본값: user.adminDongId
  const [selectedDongId, setSelectedDongId] = useState<number | undefined>(user?.adminDongId)

  // adminDong tree → id ↔ name 매핑
  const treeQuery = useQuery({
    queryKey: ['admin-dong-tree'],
    queryFn: fetchAdminDongTree,
    staleTime: 30 * 60_000,
  })
  const tree = treeQuery.data ?? null
  const dongName = useMemo(
    () => resolveDongName(tree, selectedDongId) ?? user?.adminDongName ?? '',
    [tree, selectedDongId, user?.adminDongName],
  )

  // 사용자 우리 동네가 바뀌면 selectedDongId 도 따라감 (최초 마운트 후)
  useEffect(() => {
    if (selectedDongId === undefined && user?.adminDongId) {
      setSelectedDongId(user.adminDongId)
    }
  }, [user?.adminDongId, selectedDongId])

  const newsQuery = useQuery({
    queryKey: ['news', 'admin-dong', selectedDongId],
    queryFn: () => fetchNewsByAdminDong(selectedDongId!),
    enabled: !!selectedDongId,
    staleTime: 5 * 60_000,
  })
  const items = (newsQuery.data ?? []) as News[]

  return (
    <div className="flex min-h-screen flex-col bg-neutral-white">
      <HeaderNav
        user={user ?? undefined}
        activeType="News"
        onMyPage={() => nav('/mypage')}
      />
      <main className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col gap-lg px-2xl pt-md pb-9">
        <header className="flex flex-col gap-xxs">
          <h1 className="text-h2 font-bold text-text-primary">동네 뉴스</h1>
          <p className="text-body font-normal text-text-tertiary">
            동네 소식과 추천 뉴스를 한 눈에 확인하세요
          </p>
        </header>

        {/* 동네 라벨 + picker 같은 라인 */}
        <div className="flex flex-wrap items-center justify-between gap-md">
          <p className="text-h3 font-bold text-brand-primary">
            {dongName || '동네 미선택'}
          </p>
          <div className="w-[280px]">
            <AdminDongPicker
              label=""
              selectedDongId={selectedDongId}
              onChange={(id) => setSelectedDongId(id)}
              placeholder="동네를 선택해주세요"
            />
          </div>
        </div>

        {/* 본문 */}
        {!dongName ? (
          <EmptyState
            title="동네를 선택해주세요"
            message="우측 동네 선택기에서 보고 싶은 동네를 골라주세요"
          />
        ) : newsQuery.isLoading ? (
          <NewsListSkeleton />
        ) : newsQuery.error ? (
          <EmptyState title="오류" message="뉴스를 불러올 수 없어요" />
        ) : items.length === 0 ? (
          <EmptyState title="뉴스가 없어요" message={`${dongName} 관련 뉴스가 없어요`} />
        ) : (
          <ul className="grid grid-cols-1 gap-lg sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {items.map((n, i) => (
              <li key={`${n.title}-${i}`}>
                <NewsCard news={n} />
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  )
}

// ─── 헬퍼: tree 에서 dongId → 이름 ───────────────────────────────────────────

function resolveDongName(
  tree: DistrictWithDongs[] | null,
  dongId: number | undefined,
): string | null {
  if (!tree || dongId === undefined) return null
  for (const d of tree) {
    const found = d.dongs.find((x) => x.id === dongId)
    if (found) return found.name
  }
  return null
}

// ─── 뉴스 카드 ───────────────────────────────────────────────────────────────

function NewsCard({ news }: { news: News }) {
  const [imgBroken, setImgBroken] = useState(false)
  const handleOpen = () => {
    if (news.originallink) {
      window.open(news.originallink, '_blank', 'noopener,noreferrer')
    }
  }
  const cleanDesc = (news.description ?? '').replace(/<[^>]*>/g, '')
  const cleanTitle = (news.title ?? '').replace(/<[^>]*>/g, '')
  const hasImage = Boolean(news.thumbnail) && !imgBroken
  return (
    <article
      onClick={handleOpen}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          handleOpen()
        }
      }}
      role="button"
      tabIndex={0}
      className="group flex h-full cursor-pointer flex-col gap-sm overflow-hidden rounded-md bg-neutral-white ring-1 ring-border-default transition-shadow hover:shadow-[0px_8px_24px_rgba(45,78,130,0.10)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
    >
      <div className="aspect-[16/9] w-full overflow-hidden bg-surface-subtle">
        {hasImage ? (
          <img
            src={news.thumbnail!}
            alt=""
            className="size-full object-cover transition-transform duration-[var(--duration-base)] group-hover:scale-[1.03]"
            onError={() => setImgBroken(true)}
          />
        ) : (
          <div className="flex size-full items-center justify-center text-body font-normal text-text-tertiary">
            이미지 없음
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-xs p-md">
        <h3 className="line-clamp-2 text-body-l font-bold text-text-primary group-hover:text-brand-primary">
          {cleanTitle}
        </h3>
        <p className="line-clamp-3 text-body font-normal text-text-tertiary">{cleanDesc}</p>
      </div>
    </article>
  )
}

// ─── 스켈레톤 ───────────────────────────────────────────────────────────────

function NewsListSkeleton() {
  return (
    <ul className="grid grid-cols-1 gap-lg sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <li
          key={i}
          className="flex flex-col gap-sm overflow-hidden rounded-md bg-neutral-white ring-1 ring-border-default"
        >
          <div className="aspect-[16/9] w-full animate-pulse bg-surface-subtle" />
          <div className="flex flex-col gap-xs p-md">
            <div className="h-[20px] w-[80%] animate-pulse rounded-sm bg-surface-subtle" />
            <div className="h-[14px] w-full animate-pulse rounded-sm bg-surface-subtle" />
            <div className="h-[14px] w-[60%] animate-pulse rounded-sm bg-surface-subtle" />
          </div>
        </li>
      ))}
    </ul>
  )
}
