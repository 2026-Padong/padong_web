import { JobSearchTop, type JobSearchTopProps } from './JobSearchTop'
import {
  ResultListPanelExpanded,
  type ResultListPanelExpandedProps,
} from './ResultListPanelExpanded'
import { cn } from '@/lib/cn'

// Figma 1:1: Tile · SearchListPanel (432:859) > SearchListPanel COMPONENT
// 421×900 (Figma 의도) — 모바일 풀폭, md+ 고정
// JobSearchTop + ResultListPanelExpanded
export interface SearchListPanelProps extends JobSearchTopProps, ResultListPanelExpandedProps {
  className?: string
}

export function SearchListPanel({
  title,
  mode,
  onModeChange,
  destination,
  onDestinationChange,
  hint,
  className,
  ...listProps
}: SearchListPanelProps) {
  return (
    <aside
      className={cn(
        'flex w-full flex-col items-center gap-xl px-lg py-xl md:w-[421px] md:shrink-0 md:min-h-screen',
        className,
      )}
    >
      <JobSearchTop
        title={title}
        mode={mode}
        onModeChange={onModeChange}
        destination={destination}
        onDestinationChange={onDestinationChange}
        hint={hint}
      />
      <ResultListPanelExpanded {...listProps} />
    </aside>
  )
}
