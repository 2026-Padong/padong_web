import { useNavigate } from 'react-router'
import { HeaderNav } from '@/components/layout/HeaderNav'
import { HomeHero } from '@/features/home/components/HomeHero'
import { GroupPurchaseCardHorizontal } from '@/features/home/components/GroupPurchaseCardHorizontal'
import { NewsCardHorizontal } from '@/features/home/components/NewsCardHorizontal'
import { PlaceCard } from '@/features/home/components/PlaceCard'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { CityDataHeading } from '@/components/ui/CityDataHeading'
import { DataCard } from '@/components/ui/DataCard'
import { AreaSectionTitle } from '@/components/ui/AreaSectionTitle'
import { TimePill } from '@/components/ui/TimePill'
import { DataMap } from '@/features/home/components/DataMap'
import { useShopList } from '@/api/queries/useShopList'
import { MOCK_NEWS, MOCK_PLACES } from '@/data/mocks'
import { useState } from 'react'

// Figma 1:1: Card · HomePage (899:3140)
// HeaderNav (1440×80) + MainContent (1440×1648)
//   LeftColumn (705×1286): HomeHero + GroupPurchaseSection + NewsSection
//   RightColumn (705×1578): CityDataSection + PlaceSection
export function HomePage() {
  const nav = useNavigate()
  const [search, setSearch] = useState('')
  const { data: shopList } = useShopList()
  const recruiting = (shopList?.items ?? []).filter((s) => s.status === 'recruiting').slice(0, 2)

  return (
    <div className="flex min-h-screen flex-col bg-neutral-white">
      <HeaderNav activeType="Commute" />
      <main className="flex w-full justify-center">
        <div className="grid w-full max-w-[1440px] grid-cols-2 px-[15px] py-[35px]">
          {/* LeftColumn (705w) */}
          <section className="flex flex-col gap-[50px]">
            <HomeHero
              onPrimaryCta={() => nav('/finder/job')}
              onSecondaryCta={() => nav('/finder/preference')}
            />

            {/* GroupPurchaseSection */}
            <div className="flex w-[635px] flex-col gap-md self-center">
              <SectionHeader
                type="TitleSearch"
                title="공동구매"
                searchValue={search}
                onSearchChange={setSearch}
              />
              <div className="flex flex-col gap-[28px]">
                {recruiting.length > 0 ? (
                  recruiting.map((s) => (
                    <GroupPurchaseCardHorizontal
                      key={s.id}
                      thumbnail={s.image}
                      shopName={s.name}
                      category={s.category}
                      price={0}
                      participantCurrent={s.participantCurrent}
                      participantTotal={s.participantTotal}
                      onClick={() => nav(`/shops/${s.id}`)}
                    />
                  ))
                ) : (
                  // 로딩 시 placeholder 2개
                  <>
                    <GroupPurchaseCardHorizontal shopName="로딩 중..." category="-" price={0} />
                    <GroupPurchaseCardHorizontal shopName="로딩 중..." category="-" price={0} />
                  </>
                )}
              </div>
              <SectionHeader type="More" moreLabel="더보기" />
            </div>

            {/* NewsSection */}
            <div className="flex w-[635px] flex-col gap-md self-center">
              <SectionHeader type="Title" title="뉴스" />
              <div className="flex flex-col gap-[28px]">
                {MOCK_NEWS.slice(0, 2).map((n) => (
                  <NewsCardHorizontal
                    key={n.id}
                    thumbnail={n.thumbnail}
                    title={n.title}
                    summary={n.summary}
                  />
                ))}
              </div>
              <SectionHeader type="More" moreLabel="더보기" />
            </div>
          </section>

          {/* RightColumn (705w) */}
          <section className="flex flex-col gap-[60px]">
            {/* CityDataSection */}
            <div className="flex flex-col gap-md">
              <CityDataHeading />
              <DataMap />
              <div className="flex w-full justify-between">
                <DataCard type="Weather" label="날씨" value="맑음" sub="21.3°C" />
                <DataCard type="Temp" label="온도" value="21.3°C" sub="체감 22.0°C" />
                <DataCard type="Dust" label="미세먼지" value="좋음" sub="18.0 ㎍/㎥" />
                <DataCard type="Rain" label="강수확률" value="10%" sub="습도 55%" />
              </div>
            </div>

            {/* PlaceSection */}
            <div className="flex flex-col gap-md">
              <div className="flex items-center justify-between">
                <AreaSectionTitle>용산구 지역 정보</AreaSectionTitle>
                <TimePill>19:15 기준</TimePill>
              </div>
              <div className="flex flex-col gap-[18px]">
                {MOCK_PLACES.map((p) => (
                  <PlaceCard
                    key={p.id}
                    image={p.image}
                    category={p.category}
                    event={p.event}
                    name={p.name}
                    address={p.address}
                    facilities={p.facilities}
                    data={p.data}
                  />
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
