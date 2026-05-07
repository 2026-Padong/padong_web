import { Chip } from '@/components/ui/Chip'

// Figma 1:1: Tile · MenuChipsRow (838:3094) > MenuChipList COMPONENT
// H gap-xs overflow-x-auto, 카테고리 chip 행
export interface MenuChipListProps {
  categories: string[]
  active?: string
  onChange?: (category: string) => void
}

export function MenuChipList({ categories, active, onChange }: MenuChipListProps) {
  return (
    <div className="flex gap-xs overflow-x-auto">
      {categories.map((c) => (
        <Chip
          key={c}
          state={c === active ? 'active' : 'default'}
          onClick={() => onChange?.(c)}
          className="cursor-pointer"
        >
          {c}
        </Chip>
      ))}
    </div>
  )
}
