import { Multi } from './Multi'
import { Single } from './Single'

// Figma 1:1: Tile · SearchToogle (431:868) > SearchToggle COMPONENT
// w-full flex gap-xs items-center (Figma 381 FIXED — 부모 폭에 맞춰 fill)
// Single + Multi instances
export interface SearchToggleProps {
  mode: 'single' | 'multi'
  onChange?: (mode: 'single' | 'multi') => void
}

export function SearchToggle({ mode, onChange }: SearchToggleProps) {
  return (
    <div className="flex w-full items-center gap-xs">
      <Single
        state={mode === 'single' ? 'selected' : 'default'}
        onClick={() => onChange?.('single')}
      />
      <Multi
        state={mode === 'multi' ? 'selected' : 'default'}
        onClick={() => onChange?.('multi')}
      />
    </div>
  )
}
