const COLORS_BRAND = [
  { name: 'brand-primary', hex: '#2e58e4' },
  { name: 'brand-primary-hover', hex: '#3d5ad7' },
  { name: 'brand-primary-light', hex: '#4a6cf7' },
  { name: 'brand-primary-soft', hex: '#4a6cdf' },
  { name: 'brand-primary-tint', hex: '#f0f5ff' },
]

const COLORS_NEUTRAL = [
  { name: 'neutral-white', hex: '#ffffff' },
  { name: 'neutral-black', hex: '#000000' },
  { name: 'surface-subtle', hex: '#f5f5fa' },
  { name: 'surface-cool', hex: '#e8edf0' },
  { name: 'border-default', hex: '#e0e0eb' },
  { name: 'border-medium', hex: '#bdbdbd' },
  { name: 'border-strong', hex: '#a3a3a3' },
  { name: 'text-primary', hex: '#262633' },
  { name: 'text-secondary', hex: '#585858' },
  { name: 'text-tertiary', hex: '#818181' },
]

const COLORS_TRANSIT = [
  { name: 'transit-line-1', hex: '#0052a4' },
  { name: 'transit-line-2', hex: '#00a84d' },
  { name: 'transit-line-3', hex: '#ef7c1c' },
  { name: 'transit-line-4', hex: '#00a4e3' },
  { name: 'transit-line-5', hex: '#996cac' },
  { name: 'transit-line-6', hex: '#cd7c2f' },
  { name: 'transit-line-7', hex: '#747f00' },
  { name: 'transit-line-8', hex: '#e6186c' },
  { name: 'transit-line-9', hex: '#bdb092' },
  { name: 'transit-gyeongui-jungang', hex: '#77c4a3' },
  { name: 'transit-gyeongchun', hex: '#0c8e72' },
  { name: 'transit-airport', hex: '#0090d2' },
  { name: 'transit-suin-bundang', hex: '#fabe00' },
  { name: 'transit-shinbundang', hex: '#d4003b' },
  { name: 'transit-gtx-a', hex: '#9a6344' },
  { name: 'transit-uijeongbu-shinseol', hex: '#b7c450' },
  { name: 'transit-seohae', hex: '#81a914' },
  { name: 'transit-gimpo-gold', hex: '#b6701d' },
]

const COLORS_STATUS = [
  { name: 'status-recruiting', hex: '#2457e8' },
  { name: 'status-recruiting-bg', hex: '#dbe5fc' },
  { name: 'status-closing', hex: '#f27f0d' },
  { name: 'status-closing-bg', hex: '#fff2db' },
  { name: 'status-closed', hex: '#808080' },
  { name: 'status-closed-bg', hex: '#e8e8ed' },
]

const SPACING = [
  { name: 'xxs', px: 4 },
  { name: 'xs', px: 8 },
  { name: 'sm', px: 12 },
  { name: 'md', px: 16 },
  { name: 'lg', px: 20 },
  { name: 'xl', px: 24 },
  { name: '2xl', px: 32 },
  { name: '3xl', px: 48 },
]

const RADIUS = [
  { name: 'sm', px: 4 },
  { name: 'md', px: 8 },
  { name: 'lg', px: 12 },
  { name: 'xl', px: 16 },
  { name: '2xl', px: 24 },
  { name: 'full', px: '9999' },
]

const TYPOGRAPHY = [
  { name: 'display', label: 'Display 64', cls: 'text-display font-bold' },
  { name: 'h1', label: 'Heading 1 32', cls: 'text-h1 font-bold' },
  { name: 'h2', label: 'Heading 2 28', cls: 'text-h2 font-bold' },
  { name: 'h3', label: 'Heading 3 22', cls: 'text-h3 font-bold' },
  { name: 'h4', label: 'Heading 4 18', cls: 'text-h4 font-bold' },
  { name: 'subhead', label: 'Subheading 16', cls: 'text-subhead font-bold' },
  { name: 'body-l', label: 'Body L 14', cls: 'text-body-l font-normal' },
  { name: 'body', label: 'Body 13', cls: 'text-body font-normal' },
  { name: 'body-s', label: 'Body S 11', cls: 'text-body-s font-normal' },
  { name: 'caption', label: 'Caption 10', cls: 'text-caption font-normal' },
]

function ColorSwatch({ name, hex }: { name: string; hex: string }) {
  return (
    <div className="min-w-0">
      <div className="h-20 rounded-lg border border-border-default" style={{ background: hex }} />
      <div className="mt-xs text-body-s text-text-secondary truncate">{name}</div>
      <div className="text-caption text-text-tertiary">{hex}</div>
    </div>
  )
}

export function TokensPreview() {
  return (
    <div className="p-2xl space-y-2xl">
      <header>
        <h1 className="text-h1 font-bold text-text-primary">Padong Design Tokens</h1>
        <p className="mt-xs text-body text-text-tertiary">
          Phase 1 — Figma Variables → Tailwind @theme 매핑 검증
        </p>
      </header>

      <section>
        <h2 className="text-h2 font-bold text-text-primary mb-md">Colors — Brand</h2>
        <div className="grid grid-cols-6 gap-md">
          {COLORS_BRAND.map((c) => (
            <ColorSwatch key={c.name} {...c} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-h2 font-bold text-text-primary mb-md">
          Colors — Neutral / Surface / Border / Text
        </h2>
        <div className="grid grid-cols-6 gap-md">
          {COLORS_NEUTRAL.map((c) => (
            <ColorSwatch key={c.name} {...c} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-h2 font-bold text-text-primary mb-md">Colors — Transit (지하철)</h2>
        <div className="grid grid-cols-6 gap-md">
          {COLORS_TRANSIT.map((c) => (
            <ColorSwatch key={c.name} {...c} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-h2 font-bold text-text-primary mb-md">Colors — Status</h2>
        <div className="grid grid-cols-6 gap-md">
          {COLORS_STATUS.map((c) => (
            <ColorSwatch key={c.name} {...c} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-h2 font-bold text-text-primary mb-md">Spacing</h2>
        <div className="flex flex-col gap-sm">
          {SPACING.map((s) => (
            <div key={s.name} className="flex items-center gap-md">
              <div className="w-20 text-body-s text-text-tertiary">space-{s.name}</div>
              <div className="h-4 bg-brand-primary" style={{ width: `${s.px}px` }} />
              <div className="text-body-s text-text-tertiary">{s.px}px</div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-h2 font-bold text-text-primary mb-md">Radius</h2>
        <div className="flex gap-md">
          {RADIUS.map((r) => (
            <div key={r.name} className="text-center">
              <div
                className="h-20 w-20 bg-brand-primary-tint border border-brand-primary"
                style={{ borderRadius: `${r.px}${typeof r.px === 'number' ? 'px' : 'px'}` }}
              />
              <div className="mt-xs text-body-s text-text-secondary">rounded-{r.name}</div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-h2 font-bold text-text-primary mb-md">Typography</h2>
        <div className="space-y-md">
          {TYPOGRAPHY.map((t) => (
            <div
              key={t.name}
              className="flex items-baseline gap-md border-b border-border-default pb-sm"
            >
              <div className="w-32 text-body-s text-text-tertiary flex-shrink-0">{t.label}</div>
              <div className={t.cls}>파동 · Padong — 동네 데이터 서비스</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
