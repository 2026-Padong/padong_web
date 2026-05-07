import type { ReactNode } from 'react'
import { Bookmark } from '@/components/ui/Bookmark'
import { CategoryBadge } from '@/components/ui/CategoryBadge'
import { Chip } from '@/components/ui/Chip'
import { CityDataHeading } from '@/components/ui/CityDataHeading'
import { AreaSectionTitle } from '@/components/ui/AreaSectionTitle'
import { FacilityChip } from '@/components/ui/FacilityChip'
import { Heart } from '@/components/ui/Heart'
import { Icon } from '@/components/ui/Icon'
import { KindIcon } from '@/components/ui/KindIcon'
import { Multi } from '@/components/ui/Multi'
import { NavIcon } from '@/components/ui/NavIcon'
import { PeopleIcon } from '@/components/ui/PeopleIcon'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { ResultCardScore } from '@/components/ui/ResultCardScore'
import { SafetyBadge } from '@/components/ui/SafetyBadge'
import { ScoreBadgeLarge } from '@/components/ui/ScoreBadgeLarge'
import { ScoreBar } from '@/components/ui/ScoreBar'
import { Single } from '@/components/ui/Single'
import { StatCell } from '@/components/ui/StatCell'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { StatusPill } from '@/components/ui/StatusPill'
import { SubwayLineBadge } from '@/components/ui/SubwayLineBadge'
import { TimePill } from '@/components/ui/TimePill'
import { TrendPill } from '@/components/ui/TrendPill'

function Row({ name, children }: { name: string; children: ReactNode }) {
  return (
    <div className="flex items-center gap-md border-b border-border-default py-sm">
      <div className="w-44 flex-shrink-0 text-body-s text-text-tertiary">{name}</div>
      <div className="flex flex-wrap items-center gap-sm">{children}</div>
    </div>
  )
}

export function UiBasicsPreview() {
  return (
    <div className="space-y-2xl p-2xl">
      <header>
        <h1 className="text-h1 font-bold text-text-primary">UI Basics — Phase 2A</h1>
        <p className="mt-xs text-body text-text-tertiary">
          Foundations 5 + Atoms 19 = 24 components (`components/ui/`)
        </p>
      </header>

      <section>
        <h2 className="mb-md text-h2 font-bold text-text-primary">Foundations</h2>
        <Row name="Icon (7)">
          <Icon type="Store" />
          <Icon type="Search" />
          <Icon type="Back" />
          <Icon type="Home" />
          <Icon type="Info" />
          <Icon type="Location" />
          <Icon type="Storefront" />
        </Row>
        <Row name="NavIcon (6)">
          <NavIcon type="Store" />
          <NavIcon type="Home" />
          <NavIcon type="ShoppingBag" />
          <NavIcon type="Information" />
          <NavIcon type="User" />
          <NavIcon type="Book" />
        </Row>
        <Row name="KindIcon (7)">
          <KindIcon type="Bus" />
          <KindIcon type="Car" />
          <KindIcon type="Walk" />
          <KindIcon type="Apart" />
          <KindIcon type="Opistel" />
          <KindIcon type="Yeonlip" />
          <KindIcon type="Dandok" />
        </Row>
        <Row name="Heart">
          <Heart />
          <Heart active />
        </Row>
        <Row name="Bookmark">
          <Bookmark />
          <Bookmark active />
        </Row>
      </section>

      <section>
        <h2 className="mb-md text-h2 font-bold text-text-primary">Atoms — Simple</h2>
        <Row name="Chip">
          <Chip>안전 A</Chip>
          <Chip state="active">안전 A</Chip>
        </Row>
        <Row name="Single / Multi">
          <Single state="default" />
          <Single state="selected" />
          <Multi state="default" />
          <Multi state="selected" />
        </Row>
        <Row name="ScoreBar">
          <div className="w-80">
            <ScoreBar value={92} />
          </div>
          <div className="w-80">
            <ScoreBar value={45} />
          </div>
        </Row>
        <Row name="ProgressBar">
          <div className="w-80">
            <ProgressBar value={30} />
          </div>
          <div className="w-80">
            <ProgressBar value={75} />
          </div>
        </Row>
        <Row name="ScoreBadgeLarge">
          <ScoreBadgeLarge value={92} />
          <ScoreBadgeLarge value={45} />
        </Row>
        <Row name="SafetyBadge">
          <SafetyBadge category="생활" grade="A" />
          <SafetyBadge category="치안" grade="B" />
          <SafetyBadge category="교통" grade="A" />
        </Row>
        <Row name="StatCell">
          <StatCell label="출퇴근" value="35분" />
          <StatCell label="평균" value="42분" />
        </Row>
        <Row name="ResultCardScore">
          <ResultCardScore value={92} />
        </Row>
        <Row name="TimePill">
          <TimePill>19:15 기준</TimePill>
          <TimePill>방금 전</TimePill>
        </Row>
        <Row name="PeopleIcon">
          <PeopleIcon />
        </Row>
      </section>

      <section>
        <h2 className="mb-md text-h2 font-bold text-text-primary">Atoms — Variant matrix</h2>
        <Row name="StatusPill (12)">
          <StatusPill type="congest" level="여유" />
          <StatusPill type="congest" level="보통" />
          <StatusPill type="congest" level="약간 붐빔" />
          <StatusPill type="congest" level="붐빔" />
          <StatusPill type="road" level="원활" />
          <StatusPill type="road" level="서행" />
          <StatusPill type="road" level="지체" />
          <StatusPill type="road" level="정체" />
          <StatusPill type="commercial" level="한산한" />
          <StatusPill type="commercial" level="보통" />
          <StatusPill type="commercial" level="바쁜" />
          <StatusPill type="commercial" level="매우 바쁜" />
        </Row>
        <Row name="StatusBadge (4)">
          <StatusBadge state="positive">여유</StatusBadge>
          <StatusBadge state="neutral">보통</StatusBadge>
          <StatusBadge state="warning">약간 붐빔</StatusBadge>
          <StatusBadge state="critical">붐빔</StatusBadge>
        </Row>
        <Row name="CategoryBadge (5)">
          <CategoryBadge category="관광특구" />
          <CategoryBadge category="고궁·문화유산" />
          <CategoryBadge category="인구밀집지역" />
          <CategoryBadge category="발달상권" />
          <CategoryBadge category="공원" />
        </Row>
        <Row name="SubwayLineBadge (18)">
          <SubwayLineBadge line="1" />
          <SubwayLineBadge line="2" />
          <SubwayLineBadge line="3" />
          <SubwayLineBadge line="4" />
          <SubwayLineBadge line="5" />
          <SubwayLineBadge line="6" />
          <SubwayLineBadge line="7" />
          <SubwayLineBadge line="8" />
          <SubwayLineBadge line="9" />
          <SubwayLineBadge line="gyeongui-jungang" label="경의·중앙" />
          <SubwayLineBadge line="gyeongchun" label="경춘" />
          <SubwayLineBadge line="airport" label="공항" />
          <SubwayLineBadge line="suin-bundang" label="수인·분당" />
          <SubwayLineBadge line="shinbundang" label="신분당" />
          <SubwayLineBadge line="gtx-a" label="GTX-A" />
          <SubwayLineBadge line="uijeongbu-shinseol" label="우이신설" />
          <SubwayLineBadge line="seohae" label="서해" />
          <SubwayLineBadge line="gimpo-gold" label="김포골드" />
        </Row>
      </section>

      <section>
        <h2 className="mb-md text-h2 font-bold text-text-primary">Atoms — Foundation 사용</h2>
        <Row name="TrendPill (3)">
          <TrendPill trend="down" />
          <TrendPill trend="up" />
          <TrendPill trend="flat" />
        </Row>
        <Row name="FacilityChip (3)">
          <FacilityChip type="subway" />
          <FacilityChip type="bus" />
          <FacilityChip type="bike" />
        </Row>
      </section>

      <section>
        <h2 className="mb-md text-h2 font-bold text-text-primary">Atoms — 단순 텍스트</h2>
        <Row name="CityDataHeading">
          <CityDataHeading />
          <CityDataHeading>서울특별시 도시데이터</CityDataHeading>
        </Row>
        <Row name="AreaSectionTitle">
          <AreaSectionTitle>마포구 연남동</AreaSectionTitle>
        </Row>
      </section>
    </div>
  )
}
