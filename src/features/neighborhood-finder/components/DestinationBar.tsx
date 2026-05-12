import { Icon } from '@/components/ui/Icon'

// Figma 1:1: Tile · DestinationBar (431:886) > DestinationBar COMPONENT
// w-[381px] border-2 border-brand-primary-hover flex items-center justify-between
// px-md py-xs rounded-md
// Placeholder: 14px Regular text-text-tertiary
// Search icon: Figma SearchGlyph (= icon-search 24×24, 자체 SVG 재사용)
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
    <div className="group flex w-full items-center gap-xs rounded-md border-2 border-brand-primary-hover px-md py-xs transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out)] focus-within:border-brand-primary focus-within:shadow-[0_0_0_3px_var(--color-brand-primary-tint)] hover:border-brand-primary">
      <input
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className="flex-1 bg-transparent text-body font-normal text-text-secondary outline-none placeholder:text-text-tertiary"
      />
      <Icon
        name="icon-search"
        size={24}
        className="shrink-0 text-text-tertiary transition-colors duration-[var(--duration-fast)] group-focus-within:text-brand-primary"
        aria-hidden
      />
    </div>
  )
}
