import { useEffect, useRef, useState, type ReactNode } from 'react'
import { cn } from '@/lib/cn'

// 시(00-23) + 분(00-59) 두 컬럼 커스텀 시간 선택기.
// native time input은 데스크탑/모바일 UX가 들쑥날쑥하고, 분 단위 step 제한도 있어 분이 자유로워야 하는 경우 부적합.
// 디자인 시스템 토큰 기반, 외부 클릭/ESC로 닫힘. 값은 'HH:mm'.
export interface TimePickerProps {
  label: ReactNode
  value: string
  onChange: (v: string) => void
  invalid?: boolean
  hint?: ReactNode
  placeholder?: string
  disabled?: boolean
  className?: string
}

const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'))
const MINUTES = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'))

export function TimePicker({
  label,
  value,
  onChange,
  invalid,
  hint,
  placeholder = '시간 선택',
  disabled,
  className,
}: TimePickerProps) {
  const [open, setOpen] = useState(false)
  const wrapRef = useRef<HTMLDivElement | null>(null)
  const hoursRef = useRef<HTMLDivElement | null>(null)
  const minutesRef = useRef<HTMLDivElement | null>(null)

  const [h, m] = value ? value.split(':') : ['', '']

  // 외부 클릭/ESC로 닫기
  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  // 열릴 때 선택된 항목 가운데로 스크롤
  useEffect(() => {
    if (!open) return
    const id = requestAnimationFrame(() => {
      hoursRef.current?.querySelector<HTMLButtonElement>('[data-selected]')?.scrollIntoView({
        block: 'center',
      })
      minutesRef.current?.querySelector<HTMLButtonElement>('[data-selected]')?.scrollIntoView({
        block: 'center',
      })
    })
    return () => cancelAnimationFrame(id)
  }, [open])

  const pickHour = (v: string) => onChange(`${v}:${m || '00'}`)
  const pickMin = (v: string) => onChange(`${h || '00'}:${v}`)

  return (
    <div ref={wrapRef} className={cn('relative flex w-full flex-col gap-xs', className)}>
      <span className="text-body font-normal text-text-secondary">{label}</span>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        disabled={disabled}
        aria-haspopup="dialog"
        aria-expanded={open}
        className={cn(
          'flex items-center justify-between rounded-md border bg-neutral-white px-md py-sm text-body-l outline-none transition-colors',
          'focus-visible:border-brand-primary focus-visible:shadow-[0px_2px_12px_color-mix(in_srgb,var(--color-brand-primary)_2%,transparent)]',
          'disabled:cursor-not-allowed disabled:opacity-50',
          !disabled && 'cursor-pointer hover:border-text-tertiary',
          open && 'border-brand-primary shadow-[0px_2px_12px_color-mix(in_srgb,var(--color-brand-primary)_2%,transparent)]',
          invalid ? 'border-status-critical' : 'border-border-default',
        )}
      >
        <span className={value ? 'text-text-primary' : 'text-text-tertiary'}>
          {value || placeholder}
        </span>
        <svg
          aria-hidden
          width="12"
          height="8"
          viewBox="0 0 12 8"
          fill="none"
          className={cn('text-text-tertiary transition-transform', open && 'rotate-180')}
        >
          <path
            d="M1 1.5L6 6.5L11 1.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open && (
        <div
          role="dialog"
          className="absolute top-full right-0 left-0 z-20 mt-xxs flex overflow-hidden rounded-md bg-neutral-white shadow-[0px_8px_24px_rgba(45,78,130,0.18)] ring-1 ring-border-default"
        >
          <div ref={hoursRef} className="max-h-[220px] w-1/2 overflow-y-auto py-xs">
            <ColumnHeader>시</ColumnHeader>
            {HOURS.map((v) => (
              <PickerOption
                key={v}
                value={v}
                selected={v === h}
                onPick={pickHour}
              />
            ))}
          </div>
          <div className="self-stretch w-px bg-border-default" />
          <div ref={minutesRef} className="max-h-[220px] w-1/2 overflow-y-auto py-xs">
            <ColumnHeader>분</ColumnHeader>
            {MINUTES.map((v) => (
              <PickerOption
                key={v}
                value={v}
                selected={v === m}
                onPick={pickMin}
              />
            ))}
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

function ColumnHeader({ children }: { children: ReactNode }) {
  return (
    <div className="sticky top-0 z-10 bg-neutral-white px-md pt-xxs pb-xxs text-center text-body font-medium text-text-tertiary">
      {children}
    </div>
  )
}

function PickerOption({
  value,
  selected,
  onPick,
}: {
  value: string
  selected: boolean
  onPick: (v: string) => void
}) {
  return (
    <button
      type="button"
      data-selected={selected || undefined}
      onClick={() => onPick(value)}
      className={cn(
        'block w-full px-md py-xs text-center text-body-l transition-colors',
        selected
          ? 'bg-brand-primary font-bold text-neutral-white'
          : 'text-text-primary hover:bg-surface-subtle',
      )}
    >
      {value}
    </button>
  )
}
