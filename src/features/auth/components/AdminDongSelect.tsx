import { useEffect, useMemo, useState } from 'react'
import { fetchAdminDongTree } from '@/api/dongne'
import type { DistrictWithDongs, AdminDongItem } from '@/api/contracts/dongne'
import { Icon } from '@/components/ui/Icon'
import { cn } from '@/lib/cn'

// 인라인 2-pane — 검색바 + 좌측 자치구 + 우측 행정동
export interface AdminDongSelectProps {
  label: string
  selectedDongId?: number
  onChange: (dongId: number | undefined) => void
  invalid?: boolean
  hint?: string
}

export function AdminDongSelect({
  label,
  selectedDongId,
  onChange,
  invalid,
  hint,
}: AdminDongSelectProps) {
  const [tree, setTree] = useState<DistrictWithDongs[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [guName, setGuName] = useState<string>('')
  const [search, setSearch] = useState('')

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    fetchAdminDongTree()
      .then((data) => {
        if (cancelled) return
        setTree(data)
        if (selectedDongId !== undefined) {
          for (const d of data) {
            if (d.dongs.some((x) => x.id === selectedDongId)) {
              setGuName(d.guName)
              return
            }
          }
        }
        setGuName(data[0]?.guName ?? '')
        setError(null)
      })
      .catch((e) => {
        console.error('[AdminDongSelect] tree fetch failed:', e)
        if (!cancelled) setError('행정동 목록을 불러올 수 없어요')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const trimmed = search.trim()
  const isSearching = trimmed.length > 0

  const rightItems = useMemo<Array<AdminDongItem & { guName: string }>>(() => {
    if (!tree) return []
    if (isSearching) {
      const lower = trimmed.toLowerCase()
      const result: Array<AdminDongItem & { guName: string }> = []
      for (const d of tree) {
        for (const dong of d.dongs) {
          if (dong.name.toLowerCase().includes(lower) || d.guName.toLowerCase().includes(lower)) {
            result.push({ ...dong, guName: d.guName })
          }
        }
      }
      return result.slice(0, 100)
    }
    const district = tree.find((d) => d.guName === guName)
    return district ? district.dongs.map((d) => ({ ...d, guName })) : []
  }, [tree, guName, isSearching, trimmed])

  const selectedInfo = useMemo(() => {
    if (!tree || selectedDongId === undefined) return null
    for (const district of tree) {
      const dong = district.dongs.find((d) => d.id === selectedDongId)
      if (dong) return { guName: district.guName, dong }
    }
    return null
  }, [tree, selectedDongId])

  return (
    <div className="flex w-full flex-col gap-sm">
      <div className="flex items-center justify-between">
        <span className="text-body font-normal text-text-secondary">{label}</span>
        {selectedInfo && (
          <span className="inline-flex items-center gap-xxs rounded-full bg-brand-primary-tint px-sm py-xxs text-body font-bold text-brand-primary">
            <span className="size-[6px] rounded-full bg-brand-primary" aria-hidden />
            {selectedInfo.guName} · {selectedInfo.dong.name}
          </span>
        )}
      </div>

      {loading ? (
        <div className="flex h-[360px] items-center justify-center rounded-2xl bg-surface-subtle text-body-l text-text-tertiary">
          행정동 목록 불러오는 중...
        </div>
      ) : error || !tree ? (
        <div className="flex h-[360px] items-center justify-center rounded-2xl border border-status-critical bg-neutral-white text-body-l text-status-critical">
          {error ?? '데이터 없음'}
        </div>
      ) : (
        <div
          className={cn(
            'flex h-[400px] w-full flex-col overflow-hidden rounded-2xl bg-neutral-white shadow-[0px_8px_32px_rgba(45,78,130,0.08)] ring-1 transition-shadow',
            invalid ? 'ring-status-critical' : 'ring-border-default',
          )}
        >
          {/* 검색바 */}
          <div className="flex items-center gap-sm border-b border-border-default bg-surface-subtle/30 px-lg py-md">
            <Icon name="icon-search" size={18} className="shrink-0 text-text-tertiary" aria-hidden />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="지역명으로 검색"
              className="flex-1 bg-transparent text-body-l text-text-primary outline-none placeholder:text-text-tertiary"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                aria-label="검색어 지우기"
                className="cursor-pointer rounded-full p-xxs text-text-tertiary transition-colors hover:bg-neutral-white hover:text-text-primary"
              >
                ×
              </button>
            )}
          </div>

          {/* 2-pane */}
          <div className="flex flex-1 overflow-hidden">
            {/* 자치구 — 검색 중엔 dim */}
            <div
              className={cn(
                'flex w-[120px] shrink-0 flex-col bg-surface-subtle/40 transition-opacity',
                isSearching && 'opacity-40',
              )}
            >
              <ul className="flex flex-1 flex-col gap-xxs overflow-y-auto p-xs">
                {tree.map((d) => {
                  const active = !isSearching && d.guName === guName
                  return (
                    <li key={d.guName}>
                      <button
                        type="button"
                        onClick={() => {
                          setGuName(d.guName)
                          setSearch('')
                        }}
                        className={cn(
                          'relative flex w-full cursor-pointer items-center rounded-lg px-md py-sm text-left text-body-l transition-all',
                          active
                            ? 'bg-neutral-white font-bold text-brand-primary shadow-[0px_2px_8px_rgba(45,78,130,0.06)]'
                            : 'text-text-secondary hover:bg-neutral-white/60 hover:text-text-primary',
                        )}
                      >
                        {active && (
                          <span
                            aria-hidden
                            className="absolute left-xs top-1/2 h-[50%] w-[3px] -translate-y-1/2 rounded-full bg-brand-primary"
                          />
                        )}
                        <span className={active ? 'pl-xs' : ''}>{d.guName}</span>
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>

            {/* 행정동 */}
            <div className="flex flex-1 flex-col overflow-hidden">
              <div className="sticky top-0 z-10 flex items-baseline justify-between border-b border-border-default bg-neutral-white px-lg py-sm">
                <span className="text-body font-bold text-text-primary">
                  {isSearching ? '검색 결과' : guName}
                </span>
                <span className="text-body font-normal text-text-tertiary">
                  {rightItems.length}개
                </span>
              </div>
              <ul className="flex flex-1 flex-col overflow-y-auto py-xs">
                {rightItems.length === 0 ? (
                  <li className="flex flex-1 items-center justify-center text-body-l text-text-tertiary">
                    결과 없음
                  </li>
                ) : (
                  rightItems.map((dong) => {
                    const isPicked = selectedDongId === dong.id
                    return (
                      <li key={dong.id}>
                        <button
                          type="button"
                          onClick={() => onChange(dong.id)}
                          className={cn(
                            'flex w-full cursor-pointer items-center justify-between px-lg py-sm text-left text-body-l transition-colors',
                            isPicked
                              ? 'bg-brand-primary-tint font-bold text-brand-primary'
                              : 'text-text-primary hover:bg-surface-subtle',
                          )}
                        >
                          <span>{dong.name}</span>
                          <span className="flex items-center gap-xs">
                            {isSearching && (
                              <span
                                className={cn(
                                  'text-body font-normal',
                                  isPicked ? 'text-brand-primary/70' : 'text-text-tertiary',
                                )}
                              >
                                {dong.guName}
                              </span>
                            )}
                            {isPicked && (
                              <span aria-hidden className="text-brand-primary">✓</span>
                            )}
                          </span>
                        </button>
                      </li>
                    )
                  })
                )}
              </ul>
            </div>
          </div>
        </div>
      )}

      {hint && (
        <span
          className={cn(
            'text-body font-normal',
            invalid ? 'text-status-critical' : 'text-text-tertiary',
          )}
        >
          {hint}
        </span>
      )}
    </div>
  )
}
