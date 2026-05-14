import type { ReactNode } from 'react'
import { SearchInput } from './SearchInput'

// Figma 1:1: Tile · SectionHeader (878:3066) > SectionHeader COMPONENT_SET (3 variants)
// w-[635px] flex items-center
// Title: 섹션 제목 22px Bold brand-primary (justify-start)
// TitleSearch: 제목 + SearchInput (justify-between)
// More: "더보기 →" 12px Regular text-tertiary (justify-end)
export type SectionHeaderType = 'Title' | 'TitleSearch' | 'More'

export interface SectionHeaderProps {
  type: SectionHeaderType
  title?: string
  /** TitleSearch type용 search props */
  searchValue?: string
  onSearchChange?: (v: string) => void
  /** More type 라벨 */
  moreLabel?: string
  /** More type 클릭 핸들러 — 미지정 시 단순 span 으로 표시 */
  onMoreClick?: () => void
  trailing?: ReactNode
}

export function SectionHeader({
  type,
  title = '섹션 제목',
  searchValue,
  onSearchChange,
  moreLabel = '더보기 →',
  onMoreClick,
  trailing,
}: SectionHeaderProps) {
  if (type === 'More') {
    return (
      <div className="flex items-center justify-end">
        {onMoreClick ? (
          <button
            type="button"
            onClick={onMoreClick}
            className="cursor-pointer rounded-sm text-[12px] font-normal text-text-tertiary whitespace-nowrap transition-colors hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
          >
            {moreLabel}
          </button>
        ) : (
          <span className="text-[12px] font-normal text-text-tertiary whitespace-nowrap">
            {moreLabel}
          </span>
        )}
      </div>
    )
  }

  if (type === 'TitleSearch') {
    return (
      <div className="flex items-center justify-between gap-md">
        <h2 className="text-h3 font-bold text-brand-primary whitespace-nowrap">{title}</h2>
        <SearchInput
          value={searchValue}
          onChange={onSearchChange}
          className="w-[445px] shrink-0"
        />
      </div>
    )
  }

  // Title
  return (
    <div className="flex items-center">
      <h2 className="text-h3 font-bold text-brand-primary whitespace-nowrap">{title}</h2>
      {trailing}
    </div>
  )
}
