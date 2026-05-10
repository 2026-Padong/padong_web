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
    <nav
      className="flex w-full items-center justify-center gap-xxs"
      role="navigation"
      aria-label="페이지네이션"
    >
      <PageButton
        state="default"
        page="←"
        onClick={goPrev}
        ariaLabel="이전 페이지"
        disabled={current === 1}
      />
      {Array.from({ length: total }, (_, i) => i + 1).map((p) => (
        <PageButton
          key={p}
          page={p}
          state={p === current ? 'active' : 'default'}
          onClick={() => onChange?.(p)}
          ariaLabel={p === current ? `현재 페이지 ${p}` : `${p} 페이지로 이동`}
          ariaCurrent={p === current ? 'page' : undefined}
        />
      ))}
      <PageButton
        state="default"
        page="→"
        onClick={goNext}
        ariaLabel="다음 페이지"
        disabled={current === total}
      />
    </nav>
  )
}
