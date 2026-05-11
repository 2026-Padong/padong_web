import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { HeaderNav } from '@/components/layout/HeaderNav'
import { ResultCard } from '@/components/ui/ResultCard'
import { useAuth } from '@/lib/auth'
import { fetchMyLikedDongs, type LikedDongneResponse } from '@/api/likes'

// 기존 ResultCard 재사용 — 동네 카드 패턴 통일
export function MyLikedDongsPage() {
  const nav = useNavigate()
  const { user } = useAuth()
  const [items, setItems] = useState<LikedDongneResponse[] | null>(null)
  const [total, setTotal] = useState(0)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      nav('/login', { replace: true })
      return
    }
    fetchMyLikedDongs()
      .then((page) => {
        setItems(page.content)
        setTotal(page.totalElements)
      })
      .catch((e) => {
        console.error('[liked-dongs] fetch failed:', e)
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
          <h1 className="text-h2 font-bold text-text-primary">좋아요한 동네</h1>
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
            아직 좋아요한 동네가 없어요.
          </p>
        ) : (
          <div className="flex flex-col gap-xs">
            {items.map((d) => (
              <ResultCard
                key={d.likeId}
                id={d.adminDongCode}
                dong={d.name}
                fullAddress={`서울특별시 ${d.guName} ${d.name}`}
                liked
                tags={[d.guName]}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
