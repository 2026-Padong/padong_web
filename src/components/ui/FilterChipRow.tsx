import { Chip } from './Chip'

// Figma 1:1: Tile · FilterChipRow (598:1656) > FilterChipRow COMPONENT
// flex gap-2xl items-center justify-center w-[445px]
// Multiple Chip instances (default = surface-subtle, active = brand-primary)
export interface FilterChipRowProps {
  filters: { id: string; label: string; active?: boolean }[]
  onToggle?: (id: string) => void
}

export function FilterChipRow({ filters, onToggle }: FilterChipRowProps) {
  return (
    <div className="flex items-center justify-center gap-2xl">
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
