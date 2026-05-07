import type { ReactNode } from 'react'
import { DataMap } from '@/features/home/components/DataMap'
import { HomeHero } from '@/features/home/components/HomeHero'
import { HomeHeroCTA } from '@/features/home/components/HomeHeroCTA'
import { HomeHeroTag } from '@/features/home/components/HomeHeroTag'

function Row({ name, children }: { name: string; children: ReactNode }) {
  return (
    <div className="border-b border-border-default py-md">
      <div className="mb-sm text-body-s text-text-tertiary">{name}</div>
      <div>{children}</div>
    </div>
  )
}

export function HomePreview() {
  return (
    <div className="space-y-2xl p-2xl">
      <header>
        <h1 className="text-h1 font-bold text-text-primary">Home Feature — Phase 3</h1>
        <p className="mt-xs text-body text-text-tertiary">
          features/home/components/ (4 components, 1:1 Figma)
        </p>
      </header>

      <section>
        <h2 className="mb-md text-h2 font-bold text-text-primary">Atoms</h2>
        <Row name="HomeHeroCTA (Primary/Secondary)">
          <div className="flex gap-md">
            <HomeHeroCTA type="Primary" />
            <HomeHeroCTA type="Secondary" />
          </div>
        </Row>
        <Row name="HomeHeroTag">
          <HomeHeroTag />
        </Row>
      </section>

      <section>
        <h2 className="mb-md text-h2 font-bold text-text-primary">Organisms</h2>
        <Row name="HomeHero (Banner 520x237 + 좌측 텍스트)">
          <HomeHero />
        </Row>
        <Row name="DataMap (600x493 — Leaflet 인터랙티브 지도)">
          <DataMap />
        </Row>
      </section>
    </div>
  )
}
