import { JobSearchTop, type JobSearchTopProps } from './JobSearchTop'
import {
  ResultListPanelExpanded,
  type ResultListPanelExpandedProps,
} from './ResultListPanelExpanded'

// Figma 1:1: Tile · SearchListPanel (432:859) > SearchListPanel COMPONENT
// w-[421px] h-[900px] flex flex-col items-center justify-between px-lg py-xl
// JobSearchTop + ResultListPanelExpanded
export interface SearchListPanelProps extends JobSearchTopProps, ResultListPanelExpandedProps {}

export function SearchListPanel({
  title,
  mode,
  onModeChange,
  destination,
  onDestinationChange,
  hint,
  ...listProps
}: SearchListPanelProps) {
  return (
    <aside className="flex h-[900px] w-[421px] flex-col items-center justify-between px-lg py-xl">
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
