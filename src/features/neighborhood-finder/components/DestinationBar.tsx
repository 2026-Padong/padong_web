import { Search } from 'lucide-react'

// Figma 1:1: Tile · DestinationBar (431:886) > DestinationBar COMPONENT
// w-[381px] border-2 border-brand-primary-hover flex items-center justify-between
// px-md py-xs rounded-md
// Placeholder: 14px Regular text-text-tertiary
// Search icon: 24x24
export interface DestinationBarProps {
  value?: string
  onChange?: (v: string) => void
  placeholder?: string
}

export function DestinationBar({
  value,
  onChange,
  placeholder = '목적지(출근지, 회사 등)의 지역명을 검색해보세요',
}: DestinationBarProps) {
  return (
    <div className="flex items-center justify-between rounded-md border-2 border-brand-primary-hover px-md py-xs">
      <input
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className="flex-1 bg-transparent text-body-l font-normal text-text-secondary outline-none placeholder:text-text-tertiary"
      />
      <Search size={24} className="shrink-0 text-text-tertiary" />
    </div>
  )
}
