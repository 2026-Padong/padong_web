import { Image as ImageIcon } from 'lucide-react'

// Figma 1:1: HomePage instance (1697:7392) > NewsCardHorizontal
// border-default rounded-lg p-md, H gap-lg items-center
// Thumbnail 120x90 rounded-md (bg #e8edf7)
// TextContent (V gap-[6px] items-start flex-1):
//   title 16px Bold text-text-primary w-full
//   summary 13px Regular text-text-tertiary w-full
export interface NewsCardHorizontalProps {
  thumbnail?: string
  title: string
  summary: string
  onClick?: () => void
}

export function NewsCardHorizontal({
  thumbnail,
  title,
  summary,
  onClick,
}: NewsCardHorizontalProps) {
  return (
    <article
      onClick={onClick}
      className="flex w-full cursor-pointer items-center gap-lg rounded-lg border border-border-default p-md"
    >
      <div className="flex h-[90px] w-[120px] shrink-0 items-center justify-center overflow-clip rounded-md bg-[#e8edf7]">
        {thumbnail ? (
          <img src={thumbnail} alt={title} className="h-full w-full object-cover" />
        ) : (
          <ImageIcon size={32} className="text-border-default" />
        )}
      </div>
      <div className="flex min-w-px flex-1 flex-col items-start gap-[6px] overflow-clip">
        <p className="w-full text-subhead font-bold text-text-primary">{title}</p>
        <p className="w-full text-body font-normal text-text-tertiary">{summary}</p>
      </div>
    </article>
  )
}
