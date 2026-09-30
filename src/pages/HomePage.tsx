import { useNavigate } from 'react-router'
import { HeaderNav } from '@/components/layout/HeaderNav'
import { useAuth } from '@/lib/auth'
import { BottomNav } from '@/components/layout/BottomNav'
import { HomeHero } from '@/features/home/components/HomeHero'
import { ShopCard } from '@/features/shop/components/ShopCard'
import { Skeleton } from '@/components/ui/Skeleton'
import { NewsCardHorizontal } from '@/features/home/components/NewsCardHorizontal'
import { PlaceCard } from '@/features/home/components/PlaceCard'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { DataCard } from '@/components/ui/DataCard'
import { AreaSectionTitle } from '@/components/ui/AreaSectionTitle'
import { TimePill } from '@/components/ui/TimePill'
import { DataMap } from '@/features/home/components/DataMap'
import { PageNavigation } from '@/components/ui/PageNavigation'
import { useRandomStores } from '@/api/queries/useRandomStores'
import { useShopList } from '@/api/queries/useShopList'
import { useRandomNews } from '@/api/queries/useNews'
import { useDistrictSummary, useDistrictHotplaces } from '@/api/queries/useDistrictRealtime'
import { kindFromStatus } from '@/components/ui/WeatherIcon'
import { hotplaceToPlaceCard } from '@/features/home/utils/hotplaceToPlaceCard'
import { useEffect, useState } from 'react'

// 네이버 뉴스 description 의 <b>...</b>, HTML 엔티티 stripping
function stripHtml(s: string): string {
  return s
    .replace(/<[^>]*>/g, '')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
}

// 백엔드 WeatherSummary 값 normalize — 백엔드가 단위(%·°C) 포함 여부 가변
const stripUnit = (v: string | undefined) => (v ?? '').replace(/[°℃%㎍/㎥\s]+$/g, '').trim()
// 숫자(소수 포함) 인 경우만 단위 부착. "정보 없음" 같은 placeholder 면 '-' 반환.
const isNumeric = (v: string | undefined) => {
  if (!v) return false
  return /^-?\d+(\.\d+)?$/.test(stripUnit(v))
}
const fmtPercent = (v: string | undefined) => (isNumeric(v) ? `${stripUnit(v)}%` : '-')
const fmtCelsius = (v: string | undefined) => (isNumeric(v) ? `${stripUnit(v)}°C` : '-')
const fmtDust = (v: string | undefined) => (isNumeric(v) ? `${stripUnit(v)} ㎍/㎥` : '-')

// Figma 1:1: Card · HomePage (899:3140)
// HeaderNav (1440×80) + MainContent (1440×1648)
//   LeftColumn (705×1286): HomeHero + GroupPurchaseSection + NewsSection
//   RightColumn (705×1578): CityDataSection + PlaceSection
export function HomePage() {
  const nav = useNavigate()
  const { user, logout } = useAuth()
  const [search, setSearch] = useState('')
  const [selectedDistrict, setSelectedDistrict] = useState('용산구')
  const { data: randomStores } = useRandomStores(3)
  // 검색어 입력 시 BE q 검색으로 전환, 아니면 랜덤 3개. enabled 로 불필요한 fetch 방지.
  const searchQuery = search.trim()
  const isSearching = searchQuery.length > 0
  const { data: searchResults } = useShopList(
    { q: searchQuery, size: 3 },
    { enabled: isSearching },
  )
  const recruiting = isSearching
    ? (searchResults?.content ?? [])
    : (randomStores ?? [])
  const { data: news, isPending: newsPending } = useRandomNews(3)
  const topNews = news ?? []
  // 날씨 4-카드
  const { data: summary } = useDistrictSummary(selectedDistrict)
  const weather = summary?.summary

  // 핫플레이스 — offset 페이징 + PageNavigation
  const [hotplacePage, setHotplacePage] = useState(1) // 1-based UI
  useEffect(() => setHotplacePage(1), [selectedDistrict])
  const { data: hotplacePage_data, isPending: hotplacesPending } = useDistrictHotplaces(
    selectedDistrict,
    hotplacePage - 1, // 백엔드는 0-based
    3,
  )
  const currentPageItems = (hotplacePage_data?.content ?? []).map(hotplaceToPlaceCard)
  const totalPages = hotplacePage_data?.totalPages ?? 1
  // 백엔드 핫플레이스 응답의 dataTime ("YYYY-MM-DD HH:mm" — Seoul Open API 측정 시각) 사용.
  // 페이지 첫 카드 기준 (한 응답 안에서 동일 시점일 가능성 높음).
  const updatedAtRaw = hotplacePage_data?.content?.[0]?.dataTime
  const updatedLabel = updatedAtRaw
    ? `${updatedAtRaw.slice(11, 16)} 기준`
    : ''

  return (
    <div className="flex min-h-screen flex-col bg-neutral-white pb-[56px] lg:pb-0">
      <HeaderNav
        activeType="Home"
        user={user ?? undefined}
        onAuthClick={() => nav('/login', { viewTransition: true })}
        onMyPage={() => nav('/mypage', { viewTransition: true })}
        onLogout={logout}
      />
      <main className="mx-auto w-full max-w-[1440px] px-2xl py-9">
        <div className="flex flex-col gap-3xl lg:grid lg:grid-cols-2 lg:gap-10">
          {/* LeftColumn */}
          <section className="flex flex-col gap-3xl">
            <HomeHero
              onPrimaryCta={() => nav('/finder/job', { viewTransition: true })}
              onSecondaryCta={() => nav('/finder/preference', { viewTransition: true })}
            />

            {/* GroupPurchaseSection */}
            <div className="flex w-full flex-col gap-md">
              <SectionHeader
                type="TitleSearch"
                title="소분 모임"
                searchValue={search}
                onSearchChange={setSearch}
              />
              <div className="flex flex-col gap-md">
                {recruiting.length > 0 ? (
                  recruiting.map((s) => (
                    <ShopCard
                      key={s.id}
                      id={s.id}
                      image={s.thumbnailUrl}
                      name={s.name}
                      category={s.categoryLabel}
                      description={s.description}
                      participantCurrent={s.participantCurrent}
                      participantTotal={s.participantTotal}
                      recruitmentStatus={s.recruitmentStatus}
                      liked={s.likedByCurrentUser}
                      onClick={() => nav(`/shops/${s.id}`, { viewTransition: true })}
                    />
                  ))
                ) : isSearching ? (
                  <p className="py-xl text-center text-body-l font-medium text-text-tertiary">
                    "{searchQuery}" 검색 결과가 없어요
                  </p>
                ) : (
                  <>
                    <Skeleton className="h-[131px] w-full" />
                    <Skeleton className="h-[131px] w-full" />
                    <Skeleton className="h-[131px] w-full" />
                  </>
                )}
              </div>
              <SectionHeader
                type="More"
                moreLabel="더보기"
                onMoreClick={() => nav('/shops', { viewTransition: true })}
              />
            </div>

            {/* NewsSection — 백엔드 GET /news/random?size=3 */}
            <div className="flex w-full flex-col gap-md">
              <SectionHeader type="Title" title="동네 뉴스" />
              <div className="flex flex-col gap-md">
                {newsPending ? (
                  <>
                    <Skeleton className="h-[142px] w-full" />
                    <Skeleton className="h-[142px] w-full" />
                    <Skeleton className="h-[142px] w-full" />
                  </>
                ) : topNews.length === 0 ? (
                  <p className="rounded-md bg-surface-subtle p-lg text-body font-normal text-text-tertiary">
                    최근 뉴스가 없어요
                  </p>
                ) : (
                  topNews.map((n, i) => (
                    <NewsCardHorizontal
                      key={`${n.originallink}-${i}`}
                      thumbnail={n.thumbnail}
                      title={stripHtml(n.title)}
                      summary={stripHtml(n.description)}
                      onClick={() => window.open(n.originallink, '_blank', 'noopener,noreferrer')}
                    />
                  ))
                )}
              </div>
              {topNews.length > 0 && (
                <SectionHeader
                  type="More"
                  moreLabel="더보기"
                  onMoreClick={() => nav('/news', { viewTransition: true })}
                />
              )}
            </div>
          </section>

          {/* RightColumn (705w) */}
          <section className="flex flex-col gap-[60px]">
            {/* CityDataSection */}
            <div className="flex flex-col gap-md">
              <SectionHeader type="Title" title="실시간 이 동네" />
              <DataMap selectedDistrict={selectedDistrict} onDistrictClick={setSelectedDistrict} />
              <div className="grid w-full grid-cols-2 gap-md md:grid-cols-4">
                <DataCard
                  type="Weather"
                  label="날씨"
                  value={weather?.weatherStatus ?? '-'}
                  sub={weather ? `강수 ${fmtPercent(weather.precipitationProbability)}` : '-'}
                  weatherKind={kindFromStatus(weather?.weatherStatus)}
                />
                <DataCard
                  type="Temp"
                  label="온도"
                  value={fmtCelsius(weather?.temperature)}
                  sub={weather ? `체감 ${fmtCelsius(weather.sensibleTemperature)}` : '-'}
                />
                <DataCard
                  type="Dust"
                  label="미세먼지"
                  value={weather?.fineDustStatus ?? '-'}
                  sub={fmtDust(weather?.fineDust)}
                />
                <DataCard
                  type="Rain"
                  label="강수확률"
                  value={fmtPercent(weather?.precipitationProbability)}
                  sub={weather ? `습도 ${fmtPercent(weather.humidity)}` : '-'}
                />
              </div>
            </div>

            {/* PlaceSection */}
            <div className="flex flex-col gap-md">
              <div className="flex items-center justify-between">
                <AreaSectionTitle>{selectedDistrict} 지역 정보</AreaSectionTitle>
                {updatedLabel && <TimePill>{updatedLabel}</TimePill>}
              </div>
              <div className="flex flex-col gap-lg">
                {hotplacesPending ? (
                  <>
                    <Skeleton className="h-[200px] w-full" />
                    <Skeleton className="h-[200px] w-full" />
                    <Skeleton className="h-[200px] w-full" />
                  </>
                ) : currentPageItems.length === 0 ? (
                  <p className="rounded-md bg-surface-subtle p-lg text-body font-normal text-text-tertiary">
                    {selectedDistrict} 실시간 데이터가 없어요
                  </p>
                ) : (
                  <>
                    {currentPageItems.map((p, i) => (
                      <PlaceCard
                        key={`${p.name}-${i}`}
                        image={p.image}
                        category={p.category}
                        event={p.event}
                        name={p.name}
                        address={p.address}
                        facilities={p.facilities}
                        data={p.data}
                      />
                    ))}
                    {totalPages > 1 && (
                      <div className="pt-sm">
                        <PageNavigation
                          current={hotplacePage}
                          total={totalPages}
                          onChange={setHotplacePage}
                        />
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </section>
        </div>
      </main>
      <BottomNav activeType="Commute" className="lg:hidden" />
    </div>
  )
}
