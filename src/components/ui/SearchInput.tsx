import { cn } from '@/lib/cn'
import { Icon } from './Icon'

// Figma 1:1: Tile · SearchInput (598:1647) > SearchInput COMPONENT
// 기존 h-[34px] → TextField/AdminDongPicker 와 동일한 폼 높이로 통일 (px-md py-sm, ~40px)
export interface SearchInputProps {
  value?: string
  onChange?: (v: string) => void
  placeholder?: string
  className?: string
}

export function SearchInput({
  value,
  onChange,
  placeholder = '행정동 또는 지역명을 검색해보세요',
  className,
}: SearchInputProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-sm rounded-md border border-border-default bg-neutral-white px-md py-sm transition-colors focus-within:border-brand-primary',
        className,
      )}
    >
      <input
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className="flex-1 bg-transparent text-body-l font-normal text-text-primary outline-none placeholder:text-text-tertiary"
      />
      <Icon name="icon-search" size={20} className="shrink-0 text-text-tertiary" aria-hidden />
    </div>
  )
}
