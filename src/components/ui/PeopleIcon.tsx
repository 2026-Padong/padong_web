import { Users } from 'lucide-react'
import { cn } from '@/lib/cn'

export interface PeopleIconProps {
  size?: number
  className?: string
}

export function PeopleIcon({ size = 24, className }: PeopleIconProps) {
  return <Users size={size} className={cn('text-brand-primary', className)} />
}
