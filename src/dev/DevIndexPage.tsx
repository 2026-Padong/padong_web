import { Link } from 'react-router'

const ROUTES: { path: string; label: string; phase: string }[] = [
  { path: '/', label: 'Home', phase: '실제 페이지' },
  { path: '/finder/preference', label: '동네찾기 - 취향 Q1~Q10', phase: '실제 페이지' },
  { path: '/finder/preference/analyzing', label: '동네찾기 - 분석중', phase: '실제 페이지' },
  { path: '/finder/preference/result', label: '동네찾기 - 결과', phase: '실제 페이지' },
  { path: '/finder/job', label: '동네찾기 - 직장', phase: '실제 페이지' },
  { path: '/finder/job?multi=1', label: '동네찾기 - 직장 (다중)', phase: '실제 페이지' },
  { path: '/shops', label: '우리동네가게 - 리스트', phase: '실제 페이지' },
  { path: '/shops/paris-baguette-yeonhui', label: '우리동네가게 - 상세', phase: '실제 페이지' },
  { path: '/dev/tokens', label: 'Tokens', phase: 'Phase 1' },
  { path: '/dev/ui-basics', label: 'UI Basics', phase: 'Phase 2A' },
  { path: '/dev/ui-composites', label: 'UI Composites', phase: 'Phase 2B' },
  { path: '/dev/layout', label: 'Layout (SideNav, HeaderNav)', phase: 'Phase 2B' },
  { path: '/dev/home', label: 'Home Feature', phase: 'Phase 3' },
]

export function DevIndexPage() {
  return (
    <main className="min-h-screen bg-surface-subtle p-xl">
      <div className="mx-auto flex max-w-3xl flex-col gap-lg">
        <div className="flex flex-col gap-xs">
          <h1 className="text-h1 font-bold text-text-primary">파동 — Dev Index</h1>
          <p className="text-body-l text-text-secondary">
            모든 페이지/Preview 진입점. 실제 페이지는 라우팅 + 인터랙션 검증용.
          </p>
        </div>
        <ul className="flex flex-col gap-xs">
          {ROUTES.map((r) => (
            <li key={r.path}>
              <Link
                to={r.path}
                className="flex items-center justify-between rounded-md border border-border-default bg-neutral-white px-md py-sm hover:bg-brand-primary-tint"
              >
                <span className="flex flex-col">
                  <span className="text-body-l font-bold text-text-primary">{r.label}</span>
                  <span className="text-body-s text-text-tertiary">{r.path}</span>
                </span>
                <span className="text-body-s text-text-tertiary">{r.phase}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  )
}
