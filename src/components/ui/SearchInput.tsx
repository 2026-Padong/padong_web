import { Search } from 'lucide-react'
import { cn } from '@/lib/cn'

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
        'flex items-center gap-sm rounded-lg border border-border-default bg-neutral-white px-md py-sm',
        className,
      )}
    >
      <input
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className="flex-1 bg-transparent text-body-l outline-none placeholder:text-text-tertiary"
      />
      <Search size={24} className="text-text-tertiary" />
    </div>
  )
}
