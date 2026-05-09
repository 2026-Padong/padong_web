import { Link } from 'react-router'

interface Route {
  path: string
  label: string
  desc?: string
}

interface Section {
  title: string
  desc?: string
  routes: Route[]
}

const SECTIONS: Section[] = [
  {
    title: '실제 페이지',
    desc: '라우팅 + 인터랙션 검증용 (Phase 5~8 산출물)',
    routes: [
      { path: '/', label: 'Home', desc: '메인 (HeaderNav + 좌우 2열)' },
      {
        path: '/finder/preference?q=1',
        label: '동네찾기 — 취향 Q1',
        desc: '가로형 panel + active QHero + Q2 prefetch',
      },
      { path: '/finder/preference?q=5', label: '동네찾기 — 취향 Q5', desc: '중간 질문 (URL 상태)' },
      {
        path: '/finder/preference?q=10',
        label: '동네찾기 — 취향 Q10',
        desc: '마지막 (NavButton "분석 시작")',
      },
      {
        path: '/finder/preference/analyzing',
        label: '동네찾기 — 분석중',
        desc: '3초 후 결과로 자동 이동',
      },
      {
        path: '/finder/preference/result',
        label: '동네찾기 — 결과',
        desc: 'LifestyleResult panel + Map',
      },
      { path: '/finder/job', label: '동네찾기 — 직장 (단일)', desc: 'destination 1개' },
      {
        path: '/finder/job?multi=1',
        label: '동네찾기 — 직장 (다중)',
        desc: 'destination 3개 + summary suffix',
      },
      {
        path: '/shops',
        label: '우리동네가게 — 리스트',
        desc: 'ShopListPanel + Map (페이지네이션)',
      },
      {
        path: '/shops/yeonhui-bakery?tab=Menu',
        label: '가게 상세 — 메뉴',
        desc: '4단(xl): SideNav + List + Detail + Map',
      },
      {
        path: '/shops/yeonhui-bakery?tab=Info',
        label: '가게 상세 — 정보',
        desc: 'Info 탭 (영업/주소/전화)',
      },
    ],
  },
  {
    title: 'Phase 1~3 Preview',
    desc: '디자인 시스템 컴포넌트 카탈로그',
    routes: [
      { path: '/dev/tokens', label: 'Tokens', desc: 'Phase 1 — Color/Typography/Spacing' },
      { path: '/dev/ui-basics', label: 'UI Basics', desc: 'Phase 2A — Atom 컴포넌트' },
      { path: '/dev/ui-composites', label: 'UI Composites', desc: 'Phase 2B — Molecule 컴포넌트' },
      { path: '/dev/layout', label: 'Layout', desc: 'SideNav + HeaderNav' },
      { path: '/dev/home', label: 'Home Feature', desc: 'Phase 3 — HomeHero·DataMap 등' },
      {
        path: '/dev/interactions',
        label: 'Interactions',
        desc: 'Phase 9 Day 1 — hover/focus/active/disabled 검증',
      },
      {
        path: '/dev/icons',
        label: 'Icons',
        desc: 'Phase 9.5 Day 0 — Icon 레지스트리 카탈로그',
      },
    ],
  },
]

export function DevIndexPage() {
  return (
    <main className="min-h-screen bg-surface-subtle py-xl">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-2xl px-md">
        {/* Header */}
        <header className="flex flex-col gap-xs">
          <h1 className="text-h1 font-bold text-text-primary">파동 — Dev Index</h1>
          <p className="text-body-l text-text-secondary">
            모든 페이지·Preview 진입점. 브라우저 DevTools 기기 모드로 viewport 변경하며 검증.
          </p>
        </header>

        {/* Sections */}
        {SECTIONS.map((section) => (
          <section key={section.title} className="flex flex-col gap-md">
            <div className="flex flex-col gap-xxs">
              <h2 className="text-h3 font-bold text-text-primary">{section.title}</h2>
              {section.desc && <p className="text-body text-text-tertiary">{section.desc}</p>}
            </div>
            <ul className="grid grid-cols-1 gap-xs md:grid-cols-2">
              {section.routes.map((r) => (
                <li key={r.path}>
                  <Link
                    to={r.path}
                    className="flex flex-col gap-xxs rounded-md border border-border-default bg-neutral-white px-md py-sm transition-colors hover:bg-brand-primary-tint"
                  >
                    <div className="flex items-center justify-between gap-md">
                      <span className="text-body-l font-bold text-text-primary">{r.label}</span>
                      <code className="shrink-0 truncate rounded-sm bg-surface-subtle px-xs py-xxs text-caption font-medium text-text-secondary">
                        {r.path}
                      </code>
                    </div>
                    {r.desc && <span className="text-body-s text-text-tertiary">{r.desc}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}

        {/* Footer hint */}
        <footer className="rounded-md border border-border-default bg-neutral-white p-md">
          <p className="text-body font-bold text-text-primary">Viewport 검증 가이드</p>
          <ul className="mt-xs flex flex-col gap-xxs text-body-s text-text-secondary">
            <li>
              • <strong>모바일 (375)</strong> — BottomNav 표시, 단일 컬럼, Map hidden
            </li>
            <li>
              • <strong>태블릿 (768~1023)</strong> — Panel + Map 2단
            </li>
            <li>
              • <strong>데스크톱 lg (1024)</strong> — SideNav 등장 + Panel + Map (3단)
            </li>
            <li>
              • <strong>데스크톱 xl (1280+)</strong> — ShopDetail 4단 (List 사이드바 표시)
            </li>
            <li>
              • <strong>1440 (Figma 기준)</strong> — Phase 7 시각 회귀 점검
            </li>
          </ul>
        </footer>
      </div>
    </main>
  )
}
