import { Icon, ICON_NAMES, type IconName } from '@/components/ui/Icon'

// Phase 9.5 Day 0 — 모든 등록 아이콘 카탈로그
// 그룹별로 묶어서 시각 검증 + 누락/중복/사이즈 이상 한눈에 확인
const GROUPS: { title: string; prefix: string }[] = [
  { title: 'Bookmark / Heart', prefix: 'bookmark-|heart-' },
  { title: 'Home Hero', prefix: 'home-hero-' },
  { title: 'Generic icons (icon-*)', prefix: 'icon-' },
  { title: 'Kind (주거유형 / 교통수단)', prefix: 'kind-' },
  { title: 'NavIcon', prefix: 'navicon-' },
  { title: 'NavItem (SideNav variant)', prefix: 'navitem-' },
]

function inGroup(name: IconName, prefix: string) {
  const parts = prefix.split('|')
  return parts.some((p) => name.startsWith(p))
}

export function IconsPreview() {
  const total = ICON_NAMES.length

  return (
    <main className="min-h-screen bg-surface-subtle py-xl">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-2xl px-md">
        <header className="flex flex-col gap-xs">
          <h1 className="text-h1 font-bold text-text-primary">파동 — Icons Preview</h1>
          <p className="text-body-l text-text-secondary">
            Phase 9.5 — Icon 컴포넌트 + 레지스트리 카탈로그. 등록 아이콘 총{' '}
            <strong>{total}</strong>개.
          </p>
          <p className="text-body-s text-text-tertiary">
            사용: <code>{`<Icon name="icon-search" size={20} />`}</code> · 비례 스케일 &middot;
            intrinsic 크기 default
          </p>
        </header>

        {GROUPS.map((g) => {
          const items = ICON_NAMES.filter((n) => inGroup(n, g.prefix))
          if (items.length === 0) return null
          return (
            <section key={g.title} className="flex flex-col gap-md">
              <h2 className="text-h3 font-bold text-text-primary">
                {g.title} <span className="text-body text-text-tertiary">({items.length})</span>
              </h2>
              <ul className="grid grid-cols-2 gap-md md:grid-cols-3 lg:grid-cols-4">
                {items.map((name) => (
                  <li
                    key={name}
                    className="flex flex-col items-center gap-xs rounded-md border border-border-default bg-neutral-white p-md"
                  >
                    <div className="flex h-[60px] items-center justify-center">
                      {/* intrinsic 크기 그대로 */}
                      <Icon name={name} aria-hidden />
                    </div>
                    <code className="text-caption font-medium text-text-secondary text-center break-all">
                      {name}
                    </code>
                  </li>
                ))}
              </ul>
            </section>
          )
        })}

        {/* size prop 데모 */}
        <section className="flex flex-col gap-md">
          <h2 className="text-h3 font-bold text-text-primary">size prop — 비례 스케일 데모</h2>
          <p className="text-body-s text-text-tertiary">
            동일 아이콘 (icon-search 24×24, navitem-commute 16×19, home-hero-tag-pin 8×11.4286)
            여러 size로
          </p>
          <div className="flex flex-wrap gap-lg rounded-md border border-border-default bg-neutral-white p-md">
            {[16, 20, 24, 32, 48].map((s) => (
              <div key={s} className="flex flex-col items-center gap-xxs">
                <div className="flex h-[48px] items-center justify-center">
                  <Icon name="icon-search" size={s} />
                </div>
                <span className="text-caption text-text-tertiary">size={s}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-lg rounded-md bg-brand-primary p-md">
            {[16, 20, 24, 32, 48].map((s) => (
              <div key={s} className="flex flex-col items-center gap-xxs">
                <div className="flex h-[48px] items-center justify-center">
                  <Icon name="navitem-commute" size={s} />
                </div>
                <span className="text-caption text-neutral-white">size={s}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
