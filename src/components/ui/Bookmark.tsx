import { Bookmark as BookmarkIcon } from 'lucide-react'
import type { MouseEventHandler } from 'react'
import { cn } from '@/lib/cn'

export interface BookmarkProps {
  active?: boolean
  size?: number
  className?: string
  onClick?: MouseEventHandler<SVGSVGElement>
}

export function Bookmark({ active = false, size = 24, className, onClick }: BookmarkProps) {
  return (
    <BookmarkIcon
      size={size}
      onClick={onClick}
      className={cn(
        active ? 'fill-brand-primary text-brand-primary' : 'fill-transparent text-text-tertiary',
        onClick && 'cursor-pointer',
        className,
      )}
    />
  )
}
