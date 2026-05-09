import { cn } from '@/lib/cn'
import { Icon } from './Icon'

// Figma 1:1: Tile · SearchInput (598:1647) > SearchInput COMPONENT
// h-[34px] w-[445px] bg-neutral-white border-[1.5px] border-border-default
// flex items-center justify-end px-md py-sm rounded-lg
// placeholder: Noto Sans KR Regular 14px text-text-tertiary
// Icon/Search: 24x24
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
        'flex h-[34px] items-center justify-end gap-0 rounded-lg border-[1.5px] border-border-default bg-neutral-white px-md py-sm',
        className,
      )}
    >
      <input
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className="flex-1 bg-transparent text-body-l font-normal text-text-secondary outline-none placeholder:text-text-tertiary"
      />
      <Icon name="icon-search" size={24} className="shrink-0 text-text-tertiary" aria-hidden />
    </div>
  )
}
