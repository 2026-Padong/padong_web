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
          features/home/components/ (4 components)
        </p>
      </header>

      <section>
        <h2 className="mb-md text-h2 font-bold text-text-primary">Atoms</h2>
        <Row name="HomeHeroCTA">
          <HomeHeroCTA>동네 찾기 시작</HomeHeroCTA>
        </Row>
        <Row name="HomeHeroTag">
          <div className="flex gap-xs">
            <HomeHeroTag>AI</HomeHeroTag>
            <HomeHeroTag>데이터</HomeHeroTag>
            <HomeHeroTag>지도</HomeHeroTag>
          </div>
        </Row>
      </section>

      <section>
        <h2 className="mb-md text-h2 font-bold text-text-primary">Organisms</h2>
        <Row name="HomeHero (614x411)">
          <div className="rounded-lg border border-border-default p-md">
            <HomeHero
              title="파동"
              subtitle="동네 데이터로 찾는 나의 동네"
              ctaLabel="동네 찾기 시작"
              tags={['AI', '데이터', '지도']}
            />
          </div>
        </Row>
        <Row name="DataMap (600x493)">
          <DataMap />
        </Row>
      </section>
    </div>
  )
}
