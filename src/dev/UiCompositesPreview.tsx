import { useState, type ReactNode } from 'react'
import { BackButton } from '@/components/ui/BackButton'
import { DataCard } from '@/components/ui/DataCard'
import { FilterChipRow } from '@/components/ui/FilterChipRow'
import { LoadingFooter } from '@/components/ui/LoadingFooter'
import { LocationChip } from '@/components/ui/LocationChip'
import { MapPlaceholder } from '@/components/ui/MapPlaceholder'
import { PageButton } from '@/components/ui/PageButton'
import { PageHeader } from '@/components/ui/PageHeader'
import { PageNavigation } from '@/components/ui/PageNavigation'
import { ResultCard } from '@/components/ui/ResultCard'
import { ResultListSummary } from '@/components/ui/ResultListSummary'
import { ResultSummary } from '@/components/ui/ResultSummary'
import { SearchInput } from '@/components/ui/SearchInput'
import { SearchToggle } from '@/components/ui/SearchToggle'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { TabBar } from '@/components/ui/TabBar'
import { TabBarItem } from '@/components/ui/TabBarItem'
import { TitleBlock } from '@/components/ui/TitleBlock'

function Row({ name, children }: { name: string; children: ReactNode }) {
  return (
    <div className="flex items-start gap-md border-b border-border-default py-sm">
      <div className="w-44 flex-shrink-0 text-body-s text-text-tertiary">{name}</div>
      <div className="flex flex-1 flex-wrap items-center gap-sm">{children}</div>
    </div>
  )
}

export function UiCompositesPreview() {
  const [mode, setMode] = useState<'single' | 'multi'>('single')
  const [page, setPage] = useState(2)
  const [tab, setTab] = useState('menu')
  const [filters, setFilters] = useState<Record<string, boolean>>({ promo: true })

  return (
    <div className="space-y-2xl p-2xl">
      <header>
        <h1 className="text-h1 font-bold text-text-primary">UI Composites — Phase 2B</h1>
        <p className="mt-xs text-body text-text-tertiary">
          Molecules 17 + Organisms 공통 2 + Layout 4 = 23 components
        </p>
      </header>

      <section>
        <h2 className="mb-md text-h2 font-bold text-text-primary">G1. 검색 / 입력</h2>
        <Row name="SearchInput">
          <div className="w-[445px]">
            <SearchInput />
          </div>
        </Row>
        <Row name="SearchToggle">
          <SearchToggle mode={mode} onChange={setMode} />
        </Row>
        <Row name="LocationChip">
          <LocationChip name="연희동" />
          <LocationChip name="연남동" />
        </Row>
        <Row name="FilterChipRow">
          <FilterChipRow
            filters={[
              { id: 'open', label: '영업중', active: filters.open },
              { id: 'promo', label: '할인중', active: filters.promo },
              { id: 'near', label: '가까운순', active: filters.near },
            ]}
            onToggle={(id) => setFilters((f) => ({ ...f, [id]: !f[id] }))}
          />
        </Row>
      </section>

      <section>
        <h2 className="mb-md text-h2 font-bold text-text-primary">G2. 네비게이션</h2>
        <Row name="BackButton">
          <BackButton />
        </Row>
        <Row name="PageHeader">
          <PageHeader type="Search" title="동네 찾기" />
          <PageHeader type="Shop" title="우리 동네 가게" />
        </Row>
        <Row name="PageButton">
          <PageButton state="default" page={1} />
          <PageButton state="active" page={2} />
        </Row>
        <Row name="PageNavigation">
          <PageNavigation current={page} total={5} onChange={setPage} />
        </Row>
        <Row name="TabBarItem">
          <TabBarItem state="default" label="정보" />
          <TabBarItem state="active" label="메뉴" />
        </Row>
        <Row name="TabBar">
          <div className="w-[400px]">
            <TabBar
              tabs={[
                { id: 'menu', label: '메뉴' },
                { id: 'info', label: '정보' },
              ]}
              active={tab}
              onChange={setTab}
            />
          </div>
        </Row>
        <Row name="SectionTitle">
          <SectionTitle>월세</SectionTitle>
        </Row>
        <Row name="SectionHeader">
          <div className="w-[500px] space-y-sm">
            <SectionHeader type="Title" title="추천 동네" />
            <SectionHeader
              type="More"
              title="인기 가게"
              trailing={<span className="text-body text-brand-primary">더 보기</span>}
            />
          </div>
        </Row>
      </section>

      <section>
        <h2 className="mb-md text-h2 font-bold text-text-primary">G3. 데이터 / 결과</h2>
        <Row name="DataCard">
          <DataCard type="Weather" label="날씨" value="맑음" sub="21.3°C" />
          <DataCard type="Temp" label="온도" value="21.3°C" sub="체감 22.0°C" />
          <DataCard type="Dust" label="미세먼지" value="좋음" sub="18.0 µg/m³" />
          <DataCard type="Rain" label="강수확률" value="10%" sub="습도 55%" />
        </Row>
        <Row name="TitleBlock">
          <TitleBlock
            title={
              <>
                내 취향에 맞는 <span className="text-brand-primary">동네를 분석 중</span>이에요
              </>
            }
            body="응답을 바탕으로 가장 잘 맞는 동네를 찾고 있어요"
          />
        </Row>
        <Row name="LoadingFooter">
          <div className="w-[836px]">
            <LoadingFooter progress={45} message="결과 페이지로 곧 이동합니다" />
          </div>
        </Row>
        <Row name="ResultSummary">
          <div className="w-[445px]">
            <ResultSummary countLabel="동네 전체 12개" location="연희동" />
          </div>
        </Row>
        <Row name="ResultListSummary">
          <ResultListSummary resultCount={12} />
        </Row>
      </section>

      <section>
        <h2 className="mb-md text-h2 font-bold text-text-primary">G4. Organisms 공통</h2>
        <Row name="ResultCard">
          <div className="w-[381px] space-y-xs">
            <ResultCard
              state="selected"
              dong="연남동"
              fullAddress="서울특별시 마포구 연남동"
              liked={false}
              tags={['조용', '카페', '공원', '교통']}
            />
            <ResultCard
              state="default"
              dong="연희동"
              fullAddress="서울특별시 서대문구 연희동"
              liked
              tags={['주거', '안전', '학군']}
            />
          </div>
        </Row>
        <Row name="MapPlaceholder">
          <MapPlaceholder className="h-[300px] w-[400px]" />
        </Row>
      </section>

      <section>
        <h2 className="mb-md text-h2 font-bold text-text-primary">
          G5. Layout (별도 LayoutPreview에서 풀사이즈 확인)
        </h2>
        <p className="text-body text-text-tertiary">
          SideNav (112×900) / HeaderNav (1440×80) — 풀사이즈로 보려면 상단 토글에서 "Layout" 선택
        </p>
      </section>
    </div>
  )
}
