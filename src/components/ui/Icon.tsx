// Phase 9.5 — Icon 컴포넌트 + 레지스트리 패턴
// `src/assets/icons/` 의 모든 svgr import를 한 곳에서 관리.
// 사용처: <Icon name="icon-search" size={20} />
// 비square 아이콘은 size 안 주면 intrinsic 크기로 렌더 (Figma 1:1 기본값).

import BookmarkActive from '@/assets/icons/bookmark-active.svg?react'
import BookmarkDefault from '@/assets/icons/bookmark-default.svg?react'
import FacilityBike from '@/assets/icons/facility-bike.svg?react'
import FacilityBus from '@/assets/icons/facility-bus.svg?react'
import FacilitySubway from '@/assets/icons/facility-subway.svg?react'
import HeartActive from '@/assets/icons/heart-active.svg?react'
import HeartDefault from '@/assets/icons/heart-default.svg?react'
import HomeHeroCtaBag from '@/assets/icons/home-hero-cta-bag.svg?react'
import HomeHeroCtaHeart from '@/assets/icons/home-hero-cta-heart.svg?react'
import HomeHeroFeatureBag from '@/assets/icons/home-hero-feature-bag.svg?react'
import HomeHeroFeatureBook from '@/assets/icons/home-hero-feature-book.svg?react'
import HomeHeroFeatureHouse from '@/assets/icons/home-hero-feature-house.svg?react'
import HomeHeroSeparator from '@/assets/icons/home-hero-separator.svg?react'
import HomeHeroTagPin from '@/assets/icons/home-hero-tag-pin.svg?react'
import HomeHeroUnderline from '@/assets/icons/home-hero-underline.svg?react'
import IconBack from '@/assets/icons/icon-back.svg?react'
import IconHome from '@/assets/icons/icon-home.svg?react'
import IconInfo from '@/assets/icons/icon-info.svg?react'
import IconLocation from '@/assets/icons/icon-location.svg?react'
import IconSearch from '@/assets/icons/icon-search.svg?react'
import IconStore from '@/assets/icons/icon-store.svg?react'
import IconStorefront from '@/assets/icons/icon-storefront.svg?react'
import KindApart from '@/assets/icons/kind-apart.svg?react'
import KindBus from '@/assets/icons/kind-bus.svg?react'
import KindCar from '@/assets/icons/kind-car.svg?react'
import KindDandok from '@/assets/icons/kind-dandok.svg?react'
import KindOpistel from '@/assets/icons/kind-opistel.svg?react'
import KindWalk from '@/assets/icons/kind-walk.svg?react'
import KindYeonlip from '@/assets/icons/kind-yeonlip.svg?react'
import People from '@/assets/icons/people.svg?react'
import PlaceDataAge from '@/assets/icons/place-data-age.svg?react'
import PlaceDataComposition from '@/assets/icons/place-data-composition.svg?react'
import PlaceDataPopulation from '@/assets/icons/place-data-population.svg?react'
import PlaceDataRoad from '@/assets/icons/place-data-road.svg?react'
import PlaceEventSparkles from '@/assets/icons/place-event-sparkles.svg?react'
import ShopDetailClock from '@/assets/icons/shop-detail-clock.svg?react'
import ShopDetailDoc from '@/assets/icons/shop-detail-doc.svg?react'
import ShopDetailPhone from '@/assets/icons/shop-detail-phone.svg?react'
import StepperMinus from '@/assets/icons/stepper-minus.svg?react'
import TrendDown from '@/assets/icons/trend-down.svg?react'
import TrendFlat from '@/assets/icons/trend-flat.svg?react'
import TrendUp from '@/assets/icons/trend-up.svg?react'
import StepperPlus from '@/assets/icons/stepper-plus.svg?react'
import NaviconBook from '@/assets/icons/navicon-book.svg?react'
import NaviconHome from '@/assets/icons/navicon-home.svg?react'
import NaviconInformation from '@/assets/icons/navicon-information.svg?react'
import NaviconShoppingBag from '@/assets/icons/navicon-shopping-bag.svg?react'
import NaviconStore from '@/assets/icons/navicon-store.svg?react'
import NaviconUser from '@/assets/icons/navicon-user.svg?react'
import NavitemCommute from '@/assets/icons/navitem-commute.svg?react'
import NavitemCustom from '@/assets/icons/navitem-custom.svg?react'
import NavitemGuide from '@/assets/icons/navitem-guide.svg?react'
import NavitemLocalshop from '@/assets/icons/navitem-localshop.svg?react'
import NavitemMypage from '@/assets/icons/navitem-mypage.svg?react'
import NavitemNews from '@/assets/icons/navitem-news.svg?react'

type SvgComponent = React.FC<React.SVGProps<SVGSVGElement>>

interface IconSpec {
  Component: SvgComponent
  /** Figma viewBox 기준 intrinsic width */
  width: number
  /** Figma viewBox 기준 intrinsic height */
  height: number
}

// 모든 등록 아이콘 — Phase 9.5 진행 중 신규 자산은 여기 추가
const ICONS = {
  // Bookmark / Heart
  'bookmark-active': { Component: BookmarkActive, width: 14, height: 18 },
  'bookmark-default': { Component: BookmarkDefault, width: 14, height: 18 },
  'heart-active': { Component: HeartActive, width: 13, height: 12 },
  'heart-default': { Component: HeartDefault, width: 14.5, height: 13.5 },

  // Facility chip (11×11 작은 그리드)
  'facility-bike': { Component: FacilityBike, width: 11, height: 11 },
  'facility-bus': { Component: FacilityBus, width: 11, height: 11 },
  'facility-subway': { Component: FacilitySubway, width: 11, height: 11 },

  // Home hero
  'home-hero-cta-bag': { Component: HomeHeroCtaBag, width: 20, height: 15 },
  'home-hero-cta-heart': { Component: HomeHeroCtaHeart, width: 19.3333, height: 11.8895 },
  'home-hero-feature-bag': { Component: HomeHeroFeatureBag, width: 15, height: 14.6563 },
  'home-hero-feature-book': { Component: HomeHeroFeatureBook, width: 15, height: 14 },
  'home-hero-feature-house': { Component: HomeHeroFeatureHouse, width: 15, height: 14 },
  'home-hero-separator': { Component: HomeHeroSeparator, width: 2, height: 36 },
  'home-hero-tag-pin': { Component: HomeHeroTagPin, width: 8, height: 11.4286 },
  'home-hero-underline': { Component: HomeHeroUnderline, width: 91.5, height: 4.5 },

  // Generic icons (대부분 24×24)
  'icon-back': { Component: IconBack, width: 24, height: 24 },
  'icon-home': { Component: IconHome, width: 24, height: 24 },
  'icon-info': { Component: IconInfo, width: 24, height: 24 },
  'icon-location': { Component: IconLocation, width: 18, height: 25.7143 },
  'icon-search': { Component: IconSearch, width: 24, height: 24 },
  'icon-store': { Component: IconStore, width: 24, height: 24 },
  'icon-storefront': { Component: IconStorefront, width: 24, height: 24 },

  // Kind (주거유형/교통수단) — 36×36
  'kind-apart': { Component: KindApart, width: 36, height: 36 },
  'kind-bus': { Component: KindBus, width: 36, height: 36 },
  'kind-car': { Component: KindCar, width: 36, height: 36 },
  'kind-dandok': { Component: KindDandok, width: 36, height: 36 },
  'kind-opistel': { Component: KindOpistel, width: 36, height: 36 },
  'kind-walk': { Component: KindWalk, width: 36, height: 36 },
  'kind-yeonlip': { Component: KindYeonlip, width: 36, height: 36 },

  // People (참여자 / 인원 표시)
  'people': { Component: People, width: 14, height: 14 },

  // PlaceCard data column (16×16) + event sparkles (11×11)
  'place-data-age': { Component: PlaceDataAge, width: 16, height: 16 },
  'place-data-composition': { Component: PlaceDataComposition, width: 16, height: 16 },
  'place-data-population': { Component: PlaceDataPopulation, width: 16, height: 16 },
  'place-data-road': { Component: PlaceDataRoad, width: 16, height: 16 },
  'place-event-sparkles': { Component: PlaceEventSparkles, width: 11, height: 11 },

  // Shop detail (정보 탭)
  'shop-detail-clock': { Component: ShopDetailClock, width: 20, height: 20 },
  'shop-detail-doc': { Component: ShopDetailDoc, width: 20, height: 20 },
  'shop-detail-phone': { Component: ShopDetailPhone, width: 20, height: 20 },

  // Quantity stepper
  'stepper-minus': { Component: StepperMinus, width: 16, height: 16 },
  'stepper-plus': { Component: StepperPlus, width: 16, height: 16 },

  // Trend (감소/증가/유지)
  'trend-down': { Component: TrendDown, width: 14, height: 14 },
  'trend-flat': { Component: TrendFlat, width: 14, height: 14 },
  'trend-up': { Component: TrendUp, width: 14, height: 14 },

  // NavIcon (24×24 박스 내 작은 글리프)
  'navicon-book': { Component: NaviconBook, width: 18, height: 18 },
  'navicon-home': { Component: NaviconHome, width: 20, height: 18 },
  'navicon-information': { Component: NaviconInformation, width: 18, height: 18 },
  'navicon-shopping-bag': { Component: NaviconShoppingBag, width: 16, height: 19 },
  'navicon-store': { Component: NaviconStore, width: 24, height: 24 },
  'navicon-user': { Component: NaviconUser, width: 18, height: 20 },

  // NavItem (SideNav 6 variant SVGs)
  'navitem-commute': { Component: NavitemCommute, width: 16, height: 19 },
  'navitem-custom': { Component: NavitemCustom, width: 20, height: 18 },
  'navitem-guide': { Component: NavitemGuide, width: 18, height: 18 },
  'navitem-localshop': { Component: NavitemLocalshop, width: 24, height: 24 },
  'navitem-mypage': { Component: NavitemMypage, width: 18, height: 20 },
  'navitem-news': { Component: NavitemNews, width: 18, height: 18 },
} as const satisfies Record<string, IconSpec>

export type IconName = keyof typeof ICONS

export interface IconProps extends Omit<React.SVGProps<SVGSVGElement>, 'name'> {
  name: IconName
  /** 비례 스케일 — 가장 큰 축을 size로 맞추고 비율 유지 (square이면 W=H=size) */
  size?: number
}

export function Icon({ name, size, width, height, ...rest }: IconProps) {
  const spec = ICONS[name]
  let w: number | string | undefined = width ?? spec.width
  let h: number | string | undefined = height ?? spec.height

  // size만 주어지고 width/height가 없을 때만 비례 스케일
  if (size !== undefined && width === undefined && height === undefined) {
    const scale = size / Math.max(spec.width, spec.height)
    w = spec.width * scale
    h = spec.height * scale
  }

  const Component = spec.Component
  return <Component width={w} height={h} {...rest} />
}

/** 외부에서 등록된 모든 아이콘 이름 목록 (IconsPreview 등 카탈로그용) */
// eslint-disable-next-line react-refresh/only-export-components
export const ICON_NAMES = Object.keys(ICONS) as readonly IconName[]
