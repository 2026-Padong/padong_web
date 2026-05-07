import { Chip } from '@/components/ui/Chip'

// Figma 1:1: Tile · ResultCardTagRaw (431:853) > ResultCardTags COMPONENT
// flex gap-xs items-start w-[345px] overflow-clip
// 4개 active Chip (bg-brand-primary)
export interface ResultCardTagsProps {
  tags: string[]
}

export function ResultCardTags({ tags }: ResultCardTagsProps) {
  return (
    <div className="flex items-start gap-xs overflow-clip">
      {tags.map((t) => (
        <Chip key={t} state="active">
          {t}
        </Chip>
      ))}
    </div>
  )
}
