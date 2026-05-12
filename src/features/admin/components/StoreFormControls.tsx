import { useEffect, useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchStoreCategories } from '@/api/stores'
import type { CategoryOption } from '@/api/contracts/shops'
import { DAYS } from '@/features/admin/utils/weekdays'

// 가게 정보 폼 공통 컨트롤 — AdminShopsPage / AdminShopNewPage 공유

// ─── CustomSelect — 디자인시스템 통일 dropdown ──────────────────────────
export function CustomSelect({
  value,
  options,
  onChange,
  placeholder,
  renderLabel,
}: {
  value: string
  options: string[]
  onChange: (v: string) => void
  placeholder?: string
  renderLabel?: (option: string) => string
}) {
  const label = (o: string) => (renderLabel ? renderLabel(o) : o)
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])
  return (
    <div ref={ref} className="relative w-full">
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="flex h-[34px] w-full cursor-pointer items-center justify-between gap-xs rounded-md border border-border-default bg-neutral-white px-sm text-body-l text-text-primary outline-none transition-colors hover:border-brand-primary focus:border-brand-primary"
      >
        <span className={value ? 'text-text-primary' : 'text-text-tertiary'}>
          {value ? label(value) : placeholder || '선택'}
        </span>
        <span aria-hidden className="text-text-tertiary">▾</span>
      </button>
      {open && (
        <ul
          role="listbox"
          className="absolute left-0 right-0 top-full z-20 mt-xxs max-h-[240px] overflow-y-auto rounded-md border border-border-default bg-neutral-white py-xxs shadow-[0px_8px_24px_rgba(45,78,130,0.14)]"
        >
          {options.map((o) => {
            const active = o === value
            return (
              <li key={o}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(o)
                    setOpen(false)
                  }}
                  className={`flex w-full cursor-pointer items-center px-sm py-xs text-body-l transition-colors ${
                    active
                      ? 'bg-brand-primary-tint font-bold text-brand-primary'
                      : 'text-text-secondary hover:bg-surface-subtle'
                  }`}
                >
                  {label(o)}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

// ─── CustomMultiSelect — 다중 선택 드롭다운 ──────────────────────────────
export function CustomMultiSelect({
  values,
  options,
  onToggle,
  placeholder,
  renderLabel,
}: {
  values: string[]
  options: string[]
  onToggle: (v: string) => void
  placeholder?: string
  renderLabel?: (option: string) => string
}) {
  const label = (o: string) => (renderLabel ? renderLabel(o) : o)
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])
  const display =
    values.length === 0
      ? placeholder || '선택'
      : values.length <= 2
        ? values.map(label).join(', ')
        : `${label(values[0])} 외 ${values.length - 1}건`
  return (
    <div ref={ref} className="relative w-full">
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="flex h-[34px] w-full cursor-pointer items-center justify-between gap-xs rounded-md border border-border-default bg-neutral-white px-sm text-body-l text-text-primary outline-none transition-colors hover:border-brand-primary focus:border-brand-primary"
      >
        <span className={values.length > 0 ? 'text-text-primary' : 'text-text-tertiary'}>
          {display}
        </span>
        <span aria-hidden className="text-text-tertiary">▾</span>
      </button>
      {open && (
        <ul
          role="listbox"
          className="absolute left-0 right-0 top-full z-20 mt-xxs max-h-[280px] overflow-y-auto rounded-md border border-border-default bg-neutral-white py-xxs shadow-[0px_8px_24px_rgba(45,78,130,0.14)]"
        >
          {options.map((o) => {
            const active = values.includes(o)
            return (
              <li key={o}>
                <button
                  type="button"
                  onClick={() => onToggle(o)}
                  className={`flex w-full cursor-pointer items-center gap-sm px-sm py-xs text-body-l transition-colors ${
                    active
                      ? 'bg-brand-primary-tint font-bold text-brand-primary'
                      : 'text-text-secondary hover:bg-surface-subtle'
                  }`}
                >
                  <span
                    className={
                      'flex size-[16px] shrink-0 items-center justify-center rounded-sm border ' +
                      (active
                        ? 'border-brand-primary bg-brand-primary text-neutral-white'
                        : 'border-border-default bg-neutral-white')
                    }
                    aria-hidden
                  >
                    {active && (
                      <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                        <path
                          d="M2.5 6.5l2.5 2.5 4.5-5"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </span>
                  {label(o)}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

// ─── CategorySelect — 백엔드 GET /stores/categories ────────────────────
export function CategorySelect({
  value,
  onChange,
}: {
  value: string
  onChange: (v: string) => void
}) {
  const { data: categories } = useQuery<CategoryOption[]>({
    queryKey: ['store-categories'],
    queryFn: fetchStoreCategories,
    staleTime: 5 * 60_000,
  })
  const list = Array.isArray(categories) ? categories : []
  const codes = list.map((c) => c.code)
  const labelMap = new Map(list.map((c) => [c.code, c.label]))
  const options = value && !codes.includes(value) ? [value, ...codes] : codes
  return (
    <CustomSelect
      value={value}
      options={options}
      onChange={onChange}
      placeholder="카테고리를 선택하세요"
      renderLabel={(code) => labelMap.get(code) ?? code}
    />
  )
}

// ─── TimeSelect — 시(0-23) + 분(0-59) 분리 dropdown ──────────────────
const HOUR_OPTIONS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'))
const MINUTE_OPTIONS = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'))

export function TimeSelect({
  value,
  onChange,
}: {
  value: string
  onChange: (v: string) => void
}) {
  const [hhRaw = '00', mmRaw = '00'] = (value || '').split(':')
  const hh = HOUR_OPTIONS.includes(hhRaw) ? hhRaw : '00'
  const mm = MINUTE_OPTIONS.includes(mmRaw) ? mmRaw : '00'
  return (
    <div className="flex items-center gap-xxs">
      <div className="w-[72px]">
        <CustomSelect value={hh} options={HOUR_OPTIONS} onChange={(h) => onChange(`${h}:${mm}`)} />
      </div>
      <span className="text-body-l font-bold text-text-tertiary">:</span>
      <div className="w-[72px]">
        <CustomSelect value={mm} options={MINUTE_OPTIONS} onChange={(m) => onChange(`${hh}:${m}`)} />
      </div>
    </div>
  )
}

// ─── DateTimeSelect — 날짜 + 시간 커스텀 dropdown ─────────────────────────
// value 형식: "YYYY-MM-DD HH:mm" (없으면 오늘 기준)
const today = new Date()
const YEAR_OPTIONS = Array.from({ length: 3 }, (_, i) => String(today.getFullYear() + i))
const MONTH_OPTIONS = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'))
function daysInMonth(year: number, month: number) {
  return new Date(year, month, 0).getDate()
}
function parseDateTime(value: string) {
  const m = (value || '').match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})/)
  if (m) {
    return { yyyy: m[1], MM: m[2], dd: m[3], HH: m[4], mm: m[5] }
  }
  const now = new Date()
  return {
    yyyy: String(now.getFullYear()),
    MM: String(now.getMonth() + 1).padStart(2, '0'),
    dd: String(now.getDate()).padStart(2, '0'),
    HH: '12',
    mm: '00',
  }
}

// ─── CalendarSelect — 단일 커스텀 캘린더 (YYYY-MM-DD) ─────────────────────
export function CalendarSelect({
  value,
  onChange,
  placeholder,
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const parsed = value.match(/^(\d{4})-(\d{2})-(\d{2})/)
  const selected = parsed ? new Date(Number(parsed[1]), Number(parsed[2]) - 1, Number(parsed[3])) : null
  const base = selected ?? new Date()
  const [cursor, setCursor] = useState({ y: base.getFullYear(), m: base.getMonth() })

  const dayCount = daysInMonth(cursor.y, cursor.m + 1)
  const firstDay = new Date(cursor.y, cursor.m, 1).getDay() // 0=Sun
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: dayCount }, (_, i) => i + 1),
  ]
  // 7로 떨어지게 패딩
  while (cells.length % 7 !== 0) cells.push(null)
  const weeks: (number | null)[][] = []
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7))

  const fmt = (y: number, m: number, d: number) =>
    `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
  const isSelected = (d: number) =>
    !!selected &&
    selected.getFullYear() === cursor.y &&
    selected.getMonth() === cursor.m &&
    selected.getDate() === d

  const display = selected
    ? `${selected.getFullYear()}년 ${selected.getMonth() + 1}월 ${selected.getDate()}일`
    : placeholder || '날짜 선택'

  const prevMonth = () => {
    setCursor((c) => (c.m === 0 ? { y: c.y - 1, m: 11 } : { y: c.y, m: c.m - 1 }))
  }
  const nextMonth = () => {
    setCursor((c) => (c.m === 11 ? { y: c.y + 1, m: 0 } : { y: c.y, m: c.m + 1 }))
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="flex h-[34px] min-w-[148px] cursor-pointer items-center justify-between gap-xs rounded-md border border-border-default bg-neutral-white px-sm text-body text-text-primary outline-none transition-colors hover:border-brand-primary focus:border-brand-primary"
      >
        <span className={selected ? 'text-text-primary' : 'text-text-tertiary'}>{display}</span>
        <span aria-hidden className="text-text-tertiary">▾</span>
      </button>
      {open && (
        <div className="absolute left-0 top-full z-20 mt-xxs w-[280px] rounded-md border border-border-default bg-neutral-white p-sm shadow-[0px_8px_24px_rgba(45,78,130,0.14)]">
          <div className="flex items-center justify-between pb-xs">
            <button
              type="button"
              onClick={prevMonth}
              aria-label="이전 달"
              className="cursor-pointer rounded-sm px-xs text-body-l text-text-secondary hover:bg-surface-subtle"
            >
              ‹
            </button>
            <span className="text-body-l font-bold text-text-primary">
              {cursor.y}년 {cursor.m + 1}월
            </span>
            <button
              type="button"
              onClick={nextMonth}
              aria-label="다음 달"
              className="cursor-pointer rounded-sm px-xs text-body-l text-text-secondary hover:bg-surface-subtle"
            >
              ›
            </button>
          </div>
          <div className="grid grid-cols-7 gap-xxs">
            {['일', '월', '화', '수', '목', '금', '토'].map((d) => (
              <span
                key={d}
                className="py-xxs text-center text-body-s font-medium text-text-tertiary"
              >
                {d}
              </span>
            ))}
            {weeks.flat().map((d, i) =>
              d == null ? (
                <span key={`e-${i}`} />
              ) : (
                <button
                  key={d}
                  type="button"
                  onClick={() => {
                    onChange(fmt(cursor.y, cursor.m, d))
                    setOpen(false)
                  }}
                  className={
                    'flex aspect-square cursor-pointer items-center justify-center rounded-sm text-body-l transition-colors ' +
                    (isSelected(d)
                      ? 'bg-brand-primary font-bold text-neutral-white'
                      : 'text-text-primary hover:bg-surface-subtle')
                  }
                >
                  {d}
                </button>
              ),
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── DateSelect — 날짜만 커스텀 dropdown (YYYY-MM-DD) ──────────────────────
export function DateSelect({
  value,
  onChange,
  placeholder,
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
}) {
  // value: "YYYY-MM-DD" 또는 빈 문자열
  const parsed = value.match(/^(\d{4})-(\d{2})-(\d{2})/)
  const yyyy = parsed?.[1] ?? ''
  const MM = parsed?.[2] ?? ''
  const dd = parsed?.[3] ?? ''
  const dayCount =
    yyyy && MM ? daysInMonth(Number(yyyy), Number(MM)) : 31
  const dayOptions = Array.from({ length: dayCount }, (_, i) => String(i + 1).padStart(2, '0'))
  const safeDd = dd && Number(dd) > dayCount ? String(dayCount).padStart(2, '0') : dd
  const emit = (parts: { yyyy?: string; MM?: string; dd?: string }) => {
    const next = { yyyy, MM, dd: safeDd, ...parts }
    if (next.yyyy && next.MM && next.dd) {
      onChange(`${next.yyyy}-${next.MM}-${next.dd}`)
    }
  }
  return (
    <div className="flex items-center gap-xxs">
      <div className="w-[88px]">
        <CustomSelect
          value={yyyy}
          options={YEAR_OPTIONS}
          onChange={(v) => emit({ yyyy: v })}
          placeholder={placeholder ? '연도' : undefined}
          renderLabel={(v) => `${v}년`}
        />
      </div>
      <div className="w-[72px]">
        <CustomSelect
          value={MM}
          options={MONTH_OPTIONS}
          onChange={(v) => emit({ MM: v })}
          placeholder={placeholder ? '월' : undefined}
          renderLabel={(v) => `${Number(v)}월`}
        />
      </div>
      <div className="w-[72px]">
        <CustomSelect
          value={safeDd}
          options={dayOptions}
          onChange={(v) => emit({ dd: v })}
          placeholder={placeholder ? '일' : undefined}
          renderLabel={(v) => `${Number(v)}일`}
        />
      </div>
    </div>
  )
}

export function DateTimeSelect({
  value,
  onChange,
}: {
  value: string
  onChange: (v: string) => void
}) {
  const { yyyy, MM, dd, HH, mm } = parseDateTime(value)
  const dayCount = daysInMonth(Number(yyyy), Number(MM))
  const dayOptions = Array.from({ length: dayCount }, (_, i) => String(i + 1).padStart(2, '0'))
  const safeDd = Number(dd) > dayCount ? String(dayCount).padStart(2, '0') : dd
  const emit = (parts: { yyyy?: string; MM?: string; dd?: string; HH?: string; mm?: string }) => {
    const next = { yyyy, MM, dd: safeDd, HH, mm, ...parts }
    onChange(`${next.yyyy}-${next.MM}-${next.dd} ${next.HH}:${next.mm}`)
  }
  return (
    <div className="flex flex-wrap items-center gap-xxs">
      <div className="w-[88px]">
        <CustomSelect
          value={yyyy}
          options={YEAR_OPTIONS}
          onChange={(v) => emit({ yyyy: v })}
          renderLabel={(v) => `${v}년`}
        />
      </div>
      <div className="w-[72px]">
        <CustomSelect
          value={MM}
          options={MONTH_OPTIONS}
          onChange={(v) => emit({ MM: v })}
          renderLabel={(v) => `${Number(v)}월`}
        />
      </div>
      <div className="w-[72px]">
        <CustomSelect
          value={safeDd}
          options={dayOptions}
          onChange={(v) => emit({ dd: v })}
          renderLabel={(v) => `${Number(v)}일`}
        />
      </div>
      <span className="px-xxs text-body-l font-normal text-text-tertiary">·</span>
      <div className="w-[72px]">
        <CustomSelect
          value={HH}
          options={HOUR_OPTIONS}
          onChange={(v) => emit({ HH: v })}
        />
      </div>
      <span className="text-body-l font-bold text-text-tertiary">:</span>
      <div className="w-[72px]">
        <CustomSelect
          value={mm}
          options={MINUTE_OPTIONS}
          onChange={(v) => emit({ mm: v })}
        />
      </div>
    </div>
  )
}

// ─── WeekdayToggle — 월~일 토글 7개 ─────────────────────────────────────
export function WeekdayToggle({
  value,
  onChange,
}: {
  value: boolean[]
  onChange: (v: boolean[]) => void
}) {
  const toggle = (i: number) =>
    onChange(value.map((v, idx) => (idx === i ? !v : v)))
  return (
    <div className="flex items-center gap-xxs">
      {DAYS.map((d, i) => (
        <button
          key={d}
          type="button"
          onClick={() => toggle(i)}
          className={`inline-flex size-[28px] cursor-pointer items-center justify-center rounded-full text-body-s font-bold transition-colors ${
            value[i]
              ? 'bg-brand-primary text-neutral-white'
              : 'bg-surface-subtle text-text-tertiary hover:bg-border-default/40'
          }`}
        >
          {d}
        </button>
      ))}
    </div>
  )
}

// ─── PhoneInput — 3분할 박스 (지역/국번/번호) ─────────────────────────────
// value 는 "02-794-7777" 형태로 join 되어 부모에게 emit
function splitPhone(raw: string): [string, string, string] {
  if (raw.includes('-')) {
    const a = raw.split('-')
    return [a[0] ?? '', a[1] ?? '', a[2] ?? '']
  }
  const d = raw.replace(/\D/g, '')
  if (!d) return ['', '', '']
  if (d.startsWith('02')) {
    return [d.slice(0, 2), d.slice(2, Math.max(2, d.length - 4)), d.slice(-4)]
  }
  return [d.slice(0, 3), d.slice(3, Math.max(3, d.length - 4)), d.slice(-4)]
}

export function PhoneInput({
  value,
  onChange,
}: {
  value: string
  onChange: (v: string) => void
}) {
  const [a, b, c] = splitPhone(value ?? '')
  const update = (idx: 0 | 1 | 2, raw: string) => {
    const digits = raw.replace(/\D/g, '')
    const parts: [string, string, string] = [a, b, c]
    parts[idx] = digits
    onChange(parts.filter(Boolean).join('-'))
  }
  const baseCls =
    'h-[34px] rounded-md border border-border-default bg-neutral-white px-sm text-body-l text-text-primary outline-none transition-colors placeholder:text-text-tertiary focus:border-brand-primary'
  return (
    <div className="flex items-center gap-xs">
      <input
        value={a}
        onChange={(e) => update(0, e.target.value)}
        inputMode="numeric"
        maxLength={4}
        placeholder="02"
        className={`${baseCls} w-[64px] text-center`}
      />
      <span className="text-body-l text-text-tertiary">-</span>
      <input
        value={b}
        onChange={(e) => update(1, e.target.value)}
        inputMode="numeric"
        maxLength={4}
        placeholder="0000"
        className={`${baseCls} w-[88px] text-center`}
      />
      <span className="text-body-l text-text-tertiary">-</span>
      <input
        value={c}
        onChange={(e) => update(2, e.target.value)}
        inputMode="numeric"
        maxLength={4}
        placeholder="0000"
        className={`${baseCls} w-[88px] text-center`}
      />
    </div>
  )
}
