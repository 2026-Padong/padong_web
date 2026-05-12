import { type InputHTMLAttributes, type ReactNode } from 'react'
import { cn } from '@/lib/cn'

// 일반 텍스트 입력 필드 — 라벨 + 인풋. 디자인 시스템 토큰 기반
// 인증 폼/회원가입/마이페이지 등 일반 폼에서 재사용
// 검색 전용은 SearchInput, 도착지 전용은 DestinationBar 사용
export interface TextFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  /** 인풋 위에 표시되는 라벨 */
  label: ReactNode
  /** 인풋 아래 보조 설명 / 에러 메시지 */
  hint?: ReactNode
  /** true면 hint를 critical 색으로 표시 (에러) */
  invalid?: boolean
  onChange?: (v: string) => void
}

export function TextField({
  label,
  hint,
  invalid,
  className,
  onChange,
  ...inputProps
}: TextFieldProps) {
  return (
    <label className={cn('flex w-full flex-col gap-xs', className)}>
      <span className="text-body font-normal text-text-secondary">{label}</span>
      <input
        {...inputProps}
        onChange={(e) => onChange?.(e.target.value)}
        className={cn(
          'rounded-md border bg-neutral-white px-md py-sm text-body-l text-text-primary outline-none transition-colors placeholder:text-text-tertiary',
          'focus:border-brand-primary focus:shadow-[0px_2px_12px_color-mix(in_srgb,var(--color-brand-primary)_2%,transparent)]',
          'disabled:cursor-not-allowed disabled:opacity-50',
          invalid ? 'border-status-critical' : 'border-border-default',
        )}
      />
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
    </label>
  )
}
