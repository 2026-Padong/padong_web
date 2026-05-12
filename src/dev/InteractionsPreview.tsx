import { useState } from 'react'
import { NavItem, type NavItemType } from '@/components/layout/NavItem'
import { ResultCard } from '@/components/ui/ResultCard'
import { Heart } from '@/components/ui/Heart'
import { PageButton } from '@/components/ui/PageButton'
import { TabBarItem } from '@/components/ui/TabBarItem'
import { BackButton } from '@/components/ui/BackButton'
import { NavButton } from '@/features/neighborhood-finder/components/NavButton'
import { ActionButton } from '@/features/shop/components/ActionButton'
import { RadioOption } from '@/features/neighborhood-finder/components/RadioOption'

// Phase 9 Day 1 산출물 검증용
// hover / focus-visible / active / disabled 상태를 한 화면에서 점검
export function InteractionsPreview() {
  const [activeNavType, setActiveNavType] = useState<NavItemType>('Commute')
  const [liked, setLiked] = useState(false)
  const [page, setPage] = useState(1)
  const [tab, setTab] = useState<'Menu' | 'Info'>('Menu')
  const [radio, setRadio] = useState(3)

  return (
    <main className="min-h-screen bg-surface-subtle py-xl">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-2xl px-md">
        {/* Header */}
        <header className="flex flex-col gap-xs">
          <h1 className="text-h1 font-bold text-text-primary">파동 — Interactions Preview</h1>
          <p className="text-body-l text-text-secondary">
            Phase 9 Day 1 (G1+G2) 산출물. Hover, Tab(focus-visible), Click(active) 시도하며 시각 검증.
          </p>
          <p className="text-body-s text-text-tertiary">
            Tab 키로 순회 — focus ring 일관성 점검. Touch device는 :hover 미지원이라 desktop에서 검증.
          </p>
        </header>

        {/* G2 Transition tokens 안내 */}
        <section className="flex flex-col gap-md rounded-lg border border-border-default bg-neutral-white p-lg">
          <h2 className="text-h3 font-bold text-text-primary">Transition tokens (G2)</h2>
          <dl className="grid grid-cols-2 gap-md text-body">
            <div>
              <dt className="font-bold text-text-secondary">--duration-fast</dt>
              <dd className="text-text-tertiary">120ms — hover/focus 색</dd>
            </div>
            <div>
              <dt className="font-bold text-text-secondary">--duration-base</dt>
              <dd className="text-text-tertiary">200ms — transform, 일반</dd>
            </div>
            <div>
              <dt className="font-bold text-text-secondary">--duration-slow</dt>
              <dd className="text-text-tertiary">320ms — panel slide</dd>
            </div>
            <div>
              <dt className="font-bold text-text-secondary">--duration-slower</dt>
              <dd className="text-text-tertiary">500ms — 페이지 전환</dd>
            </div>
            <div>
              <dt className="font-bold text-text-secondary">--ease-out</dt>
              <dd className="text-text-tertiary">cubic-bezier(0.16, 1, 0.3, 1)</dd>
            </div>
            <div>
              <dt className="font-bold text-text-secondary">--ease-spring</dt>
              <dd className="text-text-tertiary">약한 bounce (Heart pop 등)</dd>
            </div>
          </dl>
        </section>

        {/* NavItem */}
        <section className="flex flex-col gap-md">
          <h2 className="text-h3 font-bold text-text-primary">NavItem (SideNav 항목)</h2>
          <p className="text-body-s text-text-tertiary">
            현재 active: <strong>{activeNavType}</strong> · default = opacity-60 → hover bg-white/10 → click 시 bg-white/15 (active)
          </p>
          <div className="flex w-fit flex-col gap-xs rounded-md bg-brand-primary p-xs">
            {(['Commute', 'Custom', 'LocalShop', 'News', 'MyPage', 'Guide'] as NavItemType[]).map(
              (t) => (
                <NavItem
                  key={t}
                  type={t}
                  active={t === activeNavType}
                  onClick={() => setActiveNavType(t)}
                />
              ),
            )}
          </div>
        </section>

        {/* ResultCard */}
        <section className="flex flex-col gap-md">
          <h2 className="text-h3 font-bold text-text-primary">ResultCard / ShopCard / PlaceCard</h2>
          <p className="text-body-s text-text-tertiary">
            hover: -translate-y-0.5 + shadow + border-medium · focus-visible: ring (Tab 키)
          </p>
          <div className="flex w-full max-w-md flex-col gap-sm">
            <ResultCard
              dong="연남동"
              fullAddress="서울특별시 마포구 연남동"
              tags={['안전 A', '35분', '월세 500/45', '유동인구 8,920']}
              score={87}
              liked={liked}
              onClick={() => alert('카드 클릭')}
              onToggleLike={() => setLiked((v) => !v)}
            />
            <ResultCard
              dong="망원동 (selected)"
              fullAddress="서울특별시 마포구 망원동"
              state="selected"
              tags={['안전 A', '32분', '월세 550/40', '유동인구 9,210']}
              score={92}
              liked={false}
            />
          </div>
        </section>

        {/* Heart */}
        <section className="flex flex-col gap-md">
          <h2 className="text-h3 font-bold text-text-primary">Heart (toggle 버튼)</h2>
          <p className="text-body-s text-text-tertiary">
            hover: scale-110 · active: scale-95 · click 시 default ↔ active 토글
          </p>
          <div className="flex items-center gap-lg">
            <div className="flex items-center gap-sm">
              <Heart active={liked} onClick={() => setLiked((v) => !v)} />
              <span className="text-body text-text-tertiary">
                Heart {liked ? '(active)' : '(default)'}
              </span>
            </div>
          </div>
        </section>

        {/* PageButton */}
        <section className="flex flex-col gap-md">
          <h2 className="text-h3 font-bold text-text-primary">Pagination (PageButton)</h2>
          <p className="text-body-s text-text-tertiary">
            active: bg-brand-primary → hover bg-brand-primary-hover · default: hover bg-surface-subtle
          </p>
          <div className="flex items-center gap-xs">
            {[1, 2, 3, 4, 5].map((p) => (
              <PageButton
                key={p}
                state={p === page ? 'active' : 'default'}
                page={p}
                onClick={() => setPage(p)}
              />
            ))}
          </div>
        </section>

        {/* TabBarItem */}
        <section className="flex flex-col gap-md">
          <h2 className="text-h3 font-bold text-text-primary">TabBarItem</h2>
          <p className="text-body-s text-text-tertiary">
            default: text-tertiary → hover text-secondary · active: text-brand-primary
          </p>
          <div className="flex border-b border-border-default" role="tablist">
            <TabBarItem
              state={tab === 'Menu' ? 'active' : 'default'}
              label="메뉴"
              onClick={() => setTab('Menu')}
            />
            <TabBarItem
              state={tab === 'Info' ? 'active' : 'default'}
              label="정보"
              onClick={() => setTab('Info')}
            />
          </div>
        </section>

        {/* NavButton */}
        <section className="flex flex-col gap-md">
          <h2 className="text-h3 font-bold text-text-primary">NavButton (이전 / 다음)</h2>
          <p className="text-body-s text-text-tertiary">
            active: scale-0.97 · disabled: opacity-50, scale 잠금, cursor-not-allowed
          </p>
          <div className="flex flex-wrap items-center gap-md">
            <NavButton type="prev" />
            <NavButton type="next" />
            <NavButton type="next" label="분석 시작" />
            <NavButton type="next" disabled label="비활성" />
          </div>
        </section>

        {/* ActionButton */}
        <section className="flex flex-col gap-md">
          <h2 className="text-h3 font-bold text-text-primary">ActionButton</h2>
          <p className="text-body-s text-text-tertiary">
            기본: bg-brand-primary → hover bg-brand-primary-hover · active scale-0.98 · disabled 잠금
          </p>
          <div className="flex w-full max-w-sm flex-col gap-sm">
            <ActionButton onClick={() => alert('clicked')}>주문하기</ActionButton>
            <ActionButton disabled>비활성 상태</ActionButton>
          </div>
        </section>

        {/* RadioOption */}
        <section className="flex flex-col gap-md">
          <h2 className="text-h3 font-bold text-text-primary">RadioOption (Likert)</h2>
          <p className="text-body-s text-text-tertiary">
            현재 선택: <strong>{radio}</strong> · hover: bg-brand/10 · active: scale-95 · role=radio + aria-checked
          </p>
          <div className="flex items-center gap-sm" role="radiogroup">
            {[1, 2, 3, 4, 5].map((n) => (
              <RadioOption
                key={n}
                state={n === radio ? 'selected' : 'default'}
                number={n}
                onClick={() => setRadio(n)}
              />
            ))}
          </div>
        </section>

        {/* BackButton */}
        <section className="flex flex-col gap-md">
          <h2 className="text-h3 font-bold text-text-primary">BackButton</h2>
          <p className="text-body-s text-text-tertiary">hover: text-brand-primary-hover</p>
          <BackButton onClick={() => alert('뒤로')} />
        </section>

        {/* a11y / reduced-motion 안내 */}
        <section className="flex flex-col gap-sm rounded-lg border border-border-default bg-neutral-white p-lg">
          <h2 className="text-h3 font-bold text-text-primary">접근성 / Reduced motion</h2>
          <ul className="flex flex-col gap-xs text-body-s text-text-secondary">
            <li>
              • Tab 키로 모든 인터랙티브 요소 순회 가능 (focus ring 표시되어야 함)
            </li>
            <li>
              • DevTools → Rendering → "Emulate CSS prefers-reduced-motion: reduce" 활성 시 모든 애니메이션 즉시 완료 검증
            </li>
            <li>
              • Heart / Bookmark / RadioOption: aria-pressed / aria-checked 속성 검증 (DevTools Accessibility)
            </li>
            <li>
              • TabBarItem: role=tab + aria-selected
            </li>
          </ul>
        </section>
      </div>
    </main>
  )
}
