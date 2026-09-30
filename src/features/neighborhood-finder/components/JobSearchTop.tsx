import { PageHeader } from '@/components/ui/PageHeader'
import { SearchControls, type SearchControlsProps } from './SearchControls'

// Figma 1:1: Tile · SearchHeaderBox (431:895) > JobSearchTop COMPONENT
// w-[381px] flex flex-col gap-xl items-start
// PageHeader (Search type, "내 취향 기반") + SearchControls
export interface JobSearchTopProps extends SearchControlsProps {
  title?: string
}

export function JobSearchTop({ title = '내 취향 기반', ...controls }: JobSearchTopProps) {
  return (
    <div className="flex w-full flex-col items-start gap-xl">
      <PageHeader type="Search" title={title} />
      <SearchControls {...controls} />
    </div>
  )
}
