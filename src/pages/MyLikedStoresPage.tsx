import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { HeaderNav } from '@/components/layout/HeaderNav'
import { ShopCard } from '@/features/shop/components/ShopCard'
import { useAuth } from '@/lib/auth'
import { fetchMyLikedStores, type LikedStoreResponse } from '@/api/likes'

// 기존 ShopCard 재사용 — 가게 카드 패턴 통일
export function MyLikedStoresPage() {
  const nav = useNavigate()
  const { user } = useAuth()
  const [items, setItems] = useState<LikedStoreResponse[] | null>(null)
  const [total, setTotal] = useState(0)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      nav('/login', { replace: true })
      return
    }
    fetchMyLikedStores()
      .then((page) => {
        setItems(page.content)
        setTotal(page.totalElements)
      })
      .catch((e) => {
        console.error('[liked-stores] fetch failed:', e)
        setError('목록을 불러올 수 없어요')
      })
  }, [user, nav])

  return (
    <div className="flex min-h-screen flex-col bg-surface-subtle/40">
      <HeaderNav user={user ?? undefined} onMyPage={() => nav('/mypage')} />
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
          <h1 className="text-h2 font-bold text-text-primary">좋아요한 가게</h1>
          {items && (
            <span className="text-body font-normal text-text-tertiary">{total}개</span>
          )}
        </header>

        {error ? (
          <p className="rounded-2xl bg-neutral-white p-lg text-body-l text-status-critical ring-1 ring-border-default">
            {error}
          </p>
        ) : items === null ? (
          <p className="rounded-2xl bg-neutral-white p-lg text-body-l text-text-tertiary ring-1 ring-border-default">
            불러오는 중...
          </p>
        ) : items.length === 0 ? (
          <p className="rounded-2xl bg-neutral-white p-lg text-body-l text-text-tertiary ring-1 ring-border-default">
            아직 좋아요한 가게가 없어요.
          </p>
        ) : (
          <div className="flex flex-col gap-md">
            {items.map((s) => (
              <ShopCard
                key={s.likeId}
                id={String(s.storeId)}
                name={s.name}
                category={s.category}
                description={s.roadAddress}
                liked
                status={null}
                onClick={() => nav(`/shops/${s.storeId}`)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
