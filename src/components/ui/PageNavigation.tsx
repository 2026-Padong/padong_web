import { PageButton } from './PageButton'

// Figma 1:1: Tile · PageNavigation (566:1461) > PageNavigation COMPONENT
// 구조: ← (default) | 페이지 번호 (최대 5개 윈도우) | → (default)
// 윈도우 로직: 현재 페이지가 중앙(±2) 에 오도록. 양 끝에선 5개 채워 보임.
export interface PageNavigationProps {
  current: number
  total: number
  onChange?: (page: number) => void
}

const WINDOW = 5

function getPageWindow(current: number, total: number): number[] {
  if (total <= WINDOW) return Array.from({ length: total }, (_, i) => i + 1)
  const half = Math.floor(WINDOW / 2)
  let start = current - half
  let end = current + half
  if (start < 1) {
    start = 1
    end = WINDOW
  }
  if (end > total) {
    end = total
    start = total - WINDOW + 1
  }
  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
}

export function PageNavigation({ current, total, onChange }: PageNavigationProps) {
  const goPrev = () => current > 1 && onChange?.(current - 1)
  const goNext = () => current < total && onChange?.(current + 1)
  const pages = getPageWindow(current, total)

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
      {pages.map((p) => (
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
