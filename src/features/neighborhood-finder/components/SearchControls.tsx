import { SearchToggle } from '@/components/ui/SearchToggle'
import { SearchDestinationBox } from './SearchDestinationBox'

// Figma 1:1: Tile · SearchHeader (431:892) > SearchControls COMPONENT
// w-[381px] flex flex-col gap-xs items-start
// SearchToggle + SearchDestinationBox
export interface SearchControlsProps {
  mode: 'single' | 'multi'
  onModeChange?: (m: 'single' | 'multi') => void
  destination?: string
  onDestinationChange?: (v: string) => void
  hint?: string
}

export function SearchControls({
  mode,
  onModeChange,
  destination,
  onDestinationChange,
  hint,
}: SearchControlsProps) {
  return (
    <div className="flex w-full flex-col items-start gap-xs">
      <SearchToggle mode={mode} onChange={onModeChange} />
      <SearchDestinationBox value={destination} onChange={onDestinationChange} hint={hint} />
    </div>
  )
}
