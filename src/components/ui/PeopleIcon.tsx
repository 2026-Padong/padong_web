import { Users } from 'lucide-react'
import { cn } from '@/lib/cn'

// Figma 1:1: Tile · PeopleIcon (1739:4659) > PeopleIcon COMPONENT
// h-[14px] flex items-center justify-center overflow-clip
// Icon: 14x14 (Figma raster — lucide Users로 대체)
export interface PeopleIconProps {
  className?: string
}

export function PeopleIcon({ className }: PeopleIconProps) {
  return (
    <div
      className={cn(
        'flex h-[14px] items-center justify-center overflow-clip text-text-secondary',
        className,
      )}
    >
      <Users size={14} />
    </div>
  )
}
