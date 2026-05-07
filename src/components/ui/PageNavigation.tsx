import { PageButton } from './PageButton'

export interface PageNavigationProps {
  current: number
  total: number
  onChange?: (page: number) => void
}

export function PageNavigation({ current, total, onChange }: PageNavigationProps) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: total }, (_, i) => i + 1).map((p) => (
        <PageButton
          key={p}
          page={p}
          state={p === current ? 'active' : 'default'}
          onClick={() => onChange?.(p)}
        />
      ))}
    </div>
  )
}
