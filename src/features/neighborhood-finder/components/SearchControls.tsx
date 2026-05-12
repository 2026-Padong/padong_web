import { SearchToggle } from '@/components/ui/SearchToggle'
import { SearchDestinationBox } from './SearchDestinationBox'
import type { DongSuggestionItem } from '@/api/queries/useDongSuggestions'

// Figma 1:1: Tile · SearchHeader (431:892) > SearchControls COMPONENT
// w-[381px] flex flex-col gap-xs items-start
// SearchToggle + SearchDestinationBox
export interface SearchControlsProps {
  mode: 'single' | 'multi'
  onModeChange?: (m: 'single' | 'multi') => void
  destination?: string
  onDestinationChange?: (v: string) => void
  /** Enter 또는 자동완성 선택 시 호출 — item 전체 (name + adminDongCode) 전달 */
  onSubmitDestination?: (item: DongSuggestionItem) => void
  hint?: string
}

export function SearchControls({
  mode,
  onModeChange,
  destination,
  onDestinationChange,
  onSubmitDestination,
  hint,
}: SearchControlsProps) {
  return (
    <div className="flex w-full flex-col items-start gap-xs">
      <SearchToggle mode={mode} onChange={onModeChange} />
      <SearchDestinationBox
        value={destination}
        onChange={onDestinationChange}
        onSubmit={onSubmitDestination}
        hint={hint}
      />
    </div>
  )
}
