import { Multi } from './Multi'
import { Single } from './Single'

// Figma 1:1: Tile · SearchToogle (431:868) > SearchToggle COMPONENT
// flex gap-xs items-center
// Single + Multi instances (Phase 2A에서 작성됨)
export interface SearchToggleProps {
  mode: 'single' | 'multi'
  onChange?: (mode: 'single' | 'multi') => void
}

export function SearchToggle({ mode, onChange }: SearchToggleProps) {
  return (
    <div className="inline-flex items-center gap-xs">
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
