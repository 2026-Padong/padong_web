import { Heart as HeartIcon } from 'lucide-react'
import type { MouseEventHandler } from 'react'
import { cn } from '@/lib/cn'

export interface HeartProps {
  active?: boolean
  size?: number
  className?: string
  onClick?: MouseEventHandler<SVGSVGElement>
}

export function Heart({ active = false, size = 24, className, onClick }: HeartProps) {
  return (
    <HeartIcon
      size={size}
      onClick={onClick}
      className={cn(
        active
          ? 'fill-brand-primary text-brand-primary'
          : 'fill-transparent text-brand-primary-light',
        onClick && 'cursor-pointer',
        className,
      )}
    />
  )
}
