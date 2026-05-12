import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { fetchAdminDongTree } from '@/api/dongne'
import type { DistrictWithDongs } from '@/api/contracts/dongne'
import { Icon } from '@/components/ui/Icon'
import { cn } from '@/lib/cn'

// 필드 트리거 + 모달 형식의 행정동 선택기 — ProfilePage 등 폼에서 사용
// 회원가입의 인라인 2-pane(AdminDongSelect)과 달리 평소엔 1줄, 클릭 시 모달로 열림
export interface AdminDongPickerProps {
  label: string
  selectedDongId?: number
  onChange: (dongId: number) => void
  invalid?: boolean
  hint?: string
  placeholder?: string
  /** 마운트 즉시 모달 자동 오픈 (deep-link 진입 등) */
  defaultOpen?: boolean
}

export function AdminDongPicker({
  label,
  selectedDongId,
  onChange,
  invalid,
  hint,
  placeholder = '동네를 선택해주세요',
  defaultOpen = false,
}: AdminDongPickerProps) {
  const [tree, setTree] = useState<DistrictWithDongs[] | null>(null)
  const [open, setOpen] = useState(defaultOpen)

  useEffect(() => {
    let cancelled = false
    fetchAdminDongTree()
      .then((data) => {
        if (!cancelled) setTree(data)
      })
      .catch((e) => console.error('[AdminDongPicker] tree fetch failed:', e))
    return () => {
      cancelled = true
    }
  }, [])

  const selectedInfo = useMemo(() => {
    if (!tree || selectedDongId === undefined) return null
    for (const district of tree) {
      const dong = district.dongs.find((d) => d.id === selectedDongId)
      if (dong) return { guName: district.guName, dong }
    }
    return null
  }, [tree, selectedDongId])

  const triggerLabel = selectedInfo
    ? `${selectedInfo.guName} · ${selectedInfo.dong.name}`
    : placeholder

  return (
    <div className="flex w-full flex-col gap-xs">
      <span className="text-body font-normal text-text-secondary">{label}</span>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          'flex w-full cursor-pointer items-center justify-between gap-sm rounded-md border bg-neutral-white px-md py-sm text-left text-body-l outline-none transition-colors',
          'hover:border-border-medium focus:border-brand-primary focus:shadow-[0px_2px_12px_color-mix(in_srgb,var(--color-brand-primary)_2%,transparent)]',
          invalid ? 'border-status-critical' : 'border-border-default',
          selectedInfo ? 'text-text-primary' : 'text-text-tertiary',
        )}
      >
        <span>{triggerLabel}</span>
        <span aria-hidden className="text-text-tertiary">›</span>
      </button>
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

      {open && (
        <PickerModal
          tree={tree}
          selectedDongId={selectedDongId}
          onClose={() => setOpen(false)}
          onPick={(id) => {
            onChange(id)
            setOpen(false)
          }}
        />
      )}
    </div>
  )
}

function PickerModal({
  tree,
  selectedDongId,
  onClose,
  onPick,
}: {
  tree: DistrictWithDongs[] | null
  selectedDongId?: number
  onClose: () => void
  onPick: (dongId: number) => void
}) {
  // 선택된 동의 자치구를 초기값으로
  const initialGu = useMemo(() => {
    if (!tree || selectedDongId === undefined) return null
    for (const d of tree) {
      if (d.dongs.some((x) => x.id === selectedDongId)) return d.guName
    }
    return null
  }, [tree, selectedDongId])

  const [guName, setGuName] = useState<string | null>(initialGu)
  const [search, setSearch] = useState('')
  const inputRef = useRef<HTMLInputElement | null>(null)

  // tree 로드 후 초기 자치구 동기화 (트리 로드 전에 모달 열릴 수 있음)
  useEffect(() => {
    if (!guName && tree && tree.length > 0) {
      setGuName(initialGu ?? tree[0].guName)
    }
  }, [tree, initialGu, guName])

  useEffect(() => {
    inputRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [onClose])

  const trimmed = search.trim().toLowerCase()
  const isSearching = trimmed.length > 0

  // 검색 시엔 자치구 무관 전체 동에서 매칭
  const rightItems = useMemo<Array<{ id: number; name: string; guName: string }>>(() => {
    if (!tree) return []
    if (isSearching) {
      const result: Array<{ id: number; name: string; guName: string }> = []
      for (const d of tree) {
        const guMatched = d.guName.toLowerCase().includes(trimmed)
        for (const dong of d.dongs) {
          if (guMatched || dong.name.toLowerCase().includes(trimmed)) {
            result.push({ id: dong.id, name: dong.name, guName: d.guName })
          }
        }
      }
      return result.slice(0, 200)
    }
    const district = tree.find((d) => d.guName === guName)
    return district
      ? district.dongs.map((d) => ({ id: d.id, name: d.name, guName: district.guName }))
      : []
  }, [tree, guName, isSearching, trimmed])

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="dong-picker-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-md"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="flex w-full max-w-[520px] flex-col overflow-hidden rounded-2xl bg-neutral-white shadow-[0px_16px_40px_rgba(45,78,130,0.18)] max-h-[min(640px,85vh)]">
        {/* 헤더 */}
        <div className="flex items-center justify-between px-lg pt-lg pb-md">
          <h2 id="dong-picker-title" className="text-h4 font-bold text-text-primary">
            동네 선택
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="cursor-pointer rounded-full p-xxs text-text-tertiary transition-colors hover:bg-surface-subtle hover:text-text-primary"
          >
            ✕
          </button>
        </div>

        {/* 검색 */}
        <div className="px-lg pb-md">
          <div className="flex items-center gap-sm rounded-md bg-surface-subtle px-md py-sm">
            <Icon name="icon-search" size={18} className="shrink-0 text-text-tertiary" aria-hidden />
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="지역명으로 검색"
              className="flex-1 bg-transparent text-body-l text-text-primary outline-none placeholder:text-text-tertiary"
            />
            {search && (
              <button
                type="button"
                onClick={() => {
                  setSearch('')
                  inputRef.current?.focus()
                }}
                aria-label="검색어 지우기"
                className="cursor-pointer rounded-full p-xxs text-text-tertiary transition-colors hover:bg-neutral-white hover:text-text-primary"
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* 2-pane */}
        <div className="flex flex-1 overflow-hidden border-t border-border-default">
          {tree === null ? (
            <div className="flex flex-1 items-center justify-center text-body-l text-text-tertiary">
              불러오는 중...
            </div>
          ) : (
            <>
              {/* 자치구 — 검색 중엔 비활성 */}
              <div
                className={cn(
                  'flex w-[128px] shrink-0 flex-col bg-surface-subtle/50 transition-opacity',
                  isSearching && 'opacity-40',
                )}
              >
                <ul className="flex flex-1 flex-col overflow-y-auto py-xs">
                  {tree.map((d) => {
                    const active = !isSearching && d.guName === guName
                    return (
                      <li key={d.guName}>
                        <button
                          type="button"
                          disabled={isSearching}
                          onClick={() => {
                            setGuName(d.guName)
                          }}
                          className={cn(
                            'relative flex w-full cursor-pointer items-center px-md py-sm text-left text-body-l transition-colors',
                            active
                              ? 'bg-neutral-white font-bold text-brand-primary'
                              : 'text-text-secondary hover:bg-neutral-white/60 hover:text-text-primary',
                          )}
                        >
                          {active && (
                            <span
                              aria-hidden
                              className="absolute top-1/2 left-0 h-[60%] w-[3px] -translate-y-1/2 rounded-r-full bg-brand-primary"
                            />
                          )}
                          {d.guName}
                        </button>
                      </li>
                    )
                  })}
                </ul>
              </div>

              {/* 행정동 */}
              <div className="flex flex-1 flex-col overflow-hidden">
                <div className="flex items-baseline justify-between border-b border-border-default bg-neutral-white px-lg py-sm">
                  <span className="text-body font-bold text-text-primary">
                    {isSearching ? '검색 결과' : (guName ?? '')}
                  </span>
                  <span className="text-body font-normal text-text-tertiary">
                    {rightItems.length}개
                  </span>
                </div>
                <ul className="flex flex-1 flex-col overflow-y-auto py-xs">
                  {rightItems.length === 0 ? (
                    <li className="flex flex-1 flex-col items-center justify-center gap-xs px-md py-2xl text-center">
                      <p className="text-body-l font-bold text-text-primary">결과가 없어요</p>
                      <p className="text-body font-normal text-text-tertiary">
                        다른 검색어를 시도해보세요
                      </p>
                    </li>
                  ) : (
                    rightItems.map((dong) => {
                      const isPicked = selectedDongId === dong.id
                      return (
                        <li key={dong.id}>
                          <button
                            type="button"
                            onClick={() => onPick(dong.id)}
                            className={cn(
                              'flex w-full cursor-pointer items-center justify-between gap-sm px-lg py-sm text-left text-body-l transition-colors',
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
                                <span aria-hidden className="text-brand-primary">
                                  ✓
                                </span>
                              )}
                            </span>
                          </button>
                        </li>
                      )
                    })
                  )}
                </ul>
              </div>
            </>
          )}
        </div>
      </div>
    </div>,
    document.body,
  )
}
