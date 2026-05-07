import type { CSSProperties, MouseEventHandler } from 'react'
import BookmarkDefault from '@/assets/icons/bookmark-default.svg?react'
import BookmarkActive from '@/assets/icons/bookmark-active.svg?react'

// Figma 1:1: Tile · Bookmark (858:3044) > Bookmark COMPONENT_SET (Default/Active)
// 24×24 wrapper, 내부 BookmarkShape: 14×18 absolute(left-[5px], top-[3px])
export interface BookmarkProps {
  active?: boolean
  size?: number
  className?: string
  onClick?: MouseEventHandler<HTMLButtonElement>
}

const BOOKMARK_STYLE: CSSProperties = {
  '--fill-0': '#2e58e4',
  '--stroke-0': '#2e58e4',
} as CSSProperties

export function Bookmark({ active = false, size = 24, className, onClick }: BookmarkProps) {
  const SvgComponent = active ? BookmarkActive : BookmarkDefault
  const Wrapper = onClick ? 'button' : 'span'
  return (
    <Wrapper
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      style={{ ...BOOKMARK_STYLE, width: size, height: size }}
      className={`relative inline-block ${onClick ? 'cursor-pointer' : ''} ${className ?? ''}`}
      aria-label={onClick ? (active ? '북마크 해제' : '북마크') : undefined}
      aria-pressed={onClick ? active : undefined}
    >
      <SvgComponent
        className="absolute"
        style={{ left: '5px', top: '3px', width: '14px', height: '18px' }}
        aria-hidden
      />
    </Wrapper>
  )
}
