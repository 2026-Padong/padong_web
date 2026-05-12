// HeaderNav 로그인 버튼 — H 스타일 (닉네임 + caret) 변형 비교
import type { ReactNode } from 'react'

const NAV_LABELS = ['홈', '출퇴근 동네 찾기', '맞춤 동네 찾기', '우리 동네 가게', '뉴스', '마이페이지', '가이드']

function MockNav() {
  return (
    <nav className="hidden items-start justify-center gap-xl overflow-clip md:flex">
      {NAV_LABELS.map((l, i) => (
        <span key={l} className="flex flex-col items-center">
          <span
            className={
              i === 0
                ? 'text-body-l font-bold text-neutral-white whitespace-nowrap'
                : 'text-body-l font-normal text-white/50 whitespace-nowrap'
            }
          >
            {l}
          </span>
          {i === 0 && <span className="mt-xs h-[2px] w-[16px] bg-neutral-white" />}
        </span>
      ))}
    </nav>
  )
}

function HeaderShell({ label, children }: { label: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-sm">
      <h3 className="text-body-l font-bold text-text-primary">{label}</h3>
      <header className="relative w-full bg-brand-primary">
        <div className="flex w-full items-center px-md lg:px-2xl">
          <div className="flex h-full items-center justify-center py-sm">
            <div className="size-[42px] rounded bg-white/20" aria-label="logo placeholder" />
          </div>
          <div className="flex flex-1 items-baseline justify-end gap-3xl">
            <MockNav />
            {children}
          </div>
        </div>
      </header>
    </section>
  )
}

export function HeaderAuthPreview() {
  return (
    <main className="mx-auto flex w-full max-w-screen-xl flex-col gap-2xl p-xl">
      <header className="flex flex-col gap-xs">
        <h1 className="text-h2 font-bold text-text-primary">HeaderNav · 로그인 H 스타일 비교</h1>
        <p className="text-body font-normal text-text-tertiary">
          H 패턴 (텍스트 + caret + hover bg) 안에서 미세 변형. 로그아웃/로그인 상태 + 폰트 굵기/패딩 조정.
        </p>
      </header>

      {/* H1: 로그아웃 */}
      <HeaderShell label="H1. 로그아웃 — 텍스트만">
        <button
          type="button"
          className="shrink-0 cursor-pointer text-body-l font-normal whitespace-nowrap text-neutral-white transition-opacity hover:opacity-80"
        >
          로그인
        </button>
      </HeaderShell>

      {/* H2: 로그인 — 일반 */}
      <HeaderShell label="H2. 로그인 — kims99 (white)">
        <button
          type="button"
          className="shrink-0 cursor-pointer text-body-l font-normal whitespace-nowrap text-neutral-white transition-opacity hover:opacity-80"
        >
          kims99 님
        </button>
      </HeaderShell>

      {/* H2 + 로그아웃 인라인 (실제 적용된 패턴) */}
      <HeaderShell label="H2 + 로그아웃 인라인 — 실제 HeaderNav 적용본">
        <div className="flex shrink-0 items-baseline gap-md">
          <button
            type="button"
            className="cursor-pointer text-body-l font-normal whitespace-nowrap text-neutral-white transition-opacity hover:opacity-80"
          >
            kims99 님
          </button>
          <span className="text-body-l text-white/40" aria-hidden>·</span>
          <button
            type="button"
            className="cursor-pointer text-body-l font-normal whitespace-nowrap text-white/70 transition-colors hover:text-neutral-white"
          >
            로그아웃
          </button>
        </div>
      </HeaderShell>

      {/* H3: 로그인 bold */}
      <HeaderShell label="H3. 로그인 — kims99 (bold)">
        <button
          type="button"
          className="shrink-0 cursor-pointer text-body-l font-bold whitespace-nowrap text-neutral-white transition-opacity hover:opacity-80"
        >
          kims99 님
        </button>
      </HeaderShell>

      {/* H4: muted (white/80) */}
      <HeaderShell label="H4. muted — kims99 (white/80, hover full)">
        <button
          type="button"
          className="shrink-0 cursor-pointer text-body-l font-normal whitespace-nowrap text-white/80 transition-colors hover:text-neutral-white"
        >
          kims99 님
        </button>
      </HeaderShell>

      {/* H5: underline 항상 표시 — 홈 active 스타일 */}
      <HeaderShell label="H5. 항상 underline — '홈' active와 동일">
        <button type="button" className="group shrink-0 cursor-pointer">
          <span className="flex flex-col items-center">
            <span className="text-body-l font-bold text-neutral-white whitespace-nowrap">kims99 님</span>
            <span className="mt-xs h-[2px] w-full bg-neutral-white" />
          </span>
        </button>
      </HeaderShell>

      {/* H6: hover 시에만 underline */}
      <HeaderShell label="H6. hover 시 underline — subtle CTA">
        <button type="button" className="group shrink-0 cursor-pointer">
          <span className="flex flex-col items-center">
            <span className="text-body-l font-normal text-neutral-white whitespace-nowrap">kims99 님</span>
            <span className="mt-xs h-[2px] w-full scale-x-0 bg-neutral-white transition-transform duration-[var(--duration-fast)] group-hover:scale-x-100" />
          </span>
        </button>
      </HeaderShell>

      {/* H7: H6 + hover 드롭다운 (마이페이지 / 로그아웃) */}
      <HeaderShell label="H7. H6 + hover 드롭다운 (마이페이지 / 로그아웃)">
        <div className="group relative shrink-0">
          {/* 트리거 + 아래쪽 hover 영역 확장 (드롭다운까지 마우스 이동 끊김 방지) */}
          <button
            type="button"
            className="block cursor-pointer pb-sm"
            aria-haspopup="menu"
          >
            <span className="flex flex-col items-center">
              <span className="text-body-l font-normal text-neutral-white whitespace-nowrap">
                kims99 님
              </span>
              <span className="mt-xs h-[2px] w-full scale-x-0 bg-neutral-white transition-transform duration-[var(--duration-fast)] group-hover:scale-x-100" />
            </span>
          </button>
          {/* 드롭다운 — 헤더와 시각적으로 분리되어 카드처럼 떠있음 */}
          <div className="invisible absolute right-0 top-full z-10 flex w-[180px] flex-col overflow-clip rounded-lg border border-border-default bg-neutral-white opacity-0 shadow-[0px_8px_24px_rgba(45,78,130,0.18)] transition-all duration-[var(--duration-fast)] group-hover:visible group-hover:opacity-100">
            <button
              type="button"
              role="menuitem"
              className="block cursor-pointer px-md py-sm text-left text-body-l font-normal text-text-primary transition-colors hover:bg-surface-subtle"
            >
              마이페이지
            </button>
            <div className="h-px bg-border-default" aria-hidden />
            <button
              type="button"
              role="menuitem"
              className="block cursor-pointer px-md py-sm text-left text-body-l font-normal text-text-secondary transition-colors hover:bg-surface-subtle hover:text-status-critical"
            >
              로그아웃
            </button>
          </div>
        </div>
      </HeaderShell>
    </main>
  )
}
