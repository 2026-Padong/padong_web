import { cn } from '@/lib/cn'
import { Icon } from './Icon'

// Figma 1:1: Tile · PeopleIcon (1739:4659) > PeopleIcon COMPONENT
// h-[14px] flex items-center justify-center overflow-clip
// Icon: 14×14 자체 SVG (`people`)
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
      <Icon name="people" size={14} aria-hidden />
    </div>
  )
}
