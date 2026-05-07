import { PageButton } from './PageButton'

// Figma 1:1: Tile · PageNavigation (566:1461) > PageNavigation COMPONENT
// flex gap-xxs items-center justify-center w-[370px]
// 구조: ← (default) | 페이지 번호들 | → (default)
export interface PageNavigationProps {
  current: number
  total: number
  onChange?: (page: number) => void
}

export function PageNavigation({ current, total, onChange }: PageNavigationProps) {
  const goPrev = () => current > 1 && onChange?.(current - 1)
  const goNext = () => current < total && onChange?.(current + 1)

  return (
    <div className="flex items-center justify-center gap-xxs">
      <PageButton state="default" page="←" onClick={goPrev} />
      {Array.from({ length: total }, (_, i) => i + 1).map((p) => (
        <PageButton
          key={p}
          page={p}
          state={p === current ? 'active' : 'default'}
          onClick={() => onChange?.(p)}
        />
      ))}
      <PageButton state="default" page="→" onClick={goNext} />
    </div>
  )
}
