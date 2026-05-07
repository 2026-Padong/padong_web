import { Multi } from './Multi'
import { Single } from './Single'

export interface SearchToggleProps {
  mode: 'single' | 'multi'
  onChange?: (mode: 'single' | 'multi') => void
}

export function SearchToggle({ mode, onChange }: SearchToggleProps) {
  return (
    <div className="inline-flex gap-xs">
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
