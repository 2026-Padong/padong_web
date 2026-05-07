import { useState } from 'react'
import { HomePreview } from '@/dev/HomePreview'
import { LayoutPreview } from '@/dev/LayoutPreview'
import { TokensPreview } from '@/dev/TokensPreview'
import { UiBasicsPreview } from '@/dev/UiBasicsPreview'
import { UiCompositesPreview } from '@/dev/UiCompositesPreview'

type DevPage = 'tokens' | 'ui-basics' | 'ui-composites' | 'layout' | 'home'

const PAGES: { id: DevPage; label: string }[] = [
  { id: 'home', label: 'Home (3)' },
  { id: 'ui-composites', label: 'UI Composites (2B)' },
  { id: 'layout', label: 'Layout (2B)' },
  { id: 'ui-basics', label: 'UI Basics (2A)' },
  { id: 'tokens', label: 'Tokens (1)' },
]

export default function App() {
  const [page, setPage] = useState<DevPage>('home')

  return (
    <div>
      <nav className="sticky top-0 z-10 flex gap-xs border-b border-border-default bg-neutral-white px-md py-xs">
        {PAGES.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setPage(p.id)}
            className={
              page === p.id
                ? 'rounded-md bg-brand-primary px-md py-xs text-body-l font-bold text-neutral-white'
                : 'rounded-md px-md py-xs text-body-l text-text-secondary hover:bg-surface-subtle'
            }
          >
            {p.label}
          </button>
        ))}
      </nav>
      {page === 'tokens' && <TokensPreview />}
      {page === 'ui-basics' && <UiBasicsPreview />}
      {page === 'ui-composites' && <UiCompositesPreview />}
      {page === 'layout' && <LayoutPreview />}
      {page === 'home' && <HomePreview />}
    </div>
  )
}
