import { Chip } from './Chip'

export interface FilterChipRowProps {
  filters: { id: string; label: string; active?: boolean }[]
  onToggle?: (id: string) => void
}

export function FilterChipRow({ filters, onToggle }: FilterChipRowProps) {
  return (
    <div className="flex flex-wrap gap-2xl">
      {filters.map((f) => (
        <Chip
          key={f.id}
          state={f.active ? 'active' : 'default'}
          onClick={() => onToggle?.(f.id)}
          className="cursor-pointer"
        >
          {f.label}
        </Chip>
      ))}
    </div>
  )
}
