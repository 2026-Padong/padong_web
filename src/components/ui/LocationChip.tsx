import { MapPin } from 'lucide-react'

export interface LocationChipProps {
  name: string
}

export function LocationChip({ name }: LocationChipProps) {
  return (
    <span className="inline-flex items-center gap-1 rounded-lg bg-neutral-white px-1">
      <MapPin size={14} className="text-brand-primary" />
      <span className="text-subhead font-bold text-brand-primary">{name}</span>
    </span>
  )
}
