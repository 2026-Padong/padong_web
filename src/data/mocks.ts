import type { ResultCardProps } from '@/components/ui/ResultCard'
import type { SubwayLine } from '@/components/ui/SubwayLineBadge'

import dongYeonnam from '@/assets/dongs/dong-yeonnam.png'
import dongMangwon from '@/assets/dongs/dong-mangwon.png'
import dongSeongsu from '@/assets/dongs/dong-seongsu.png'
import dongHwayang from '@/assets/dongs/dong-hwayang.png'
import dongYeonhui from '@/assets/dongs/dong-yeonhui.png'
import dongHapjeong from '@/assets/dongs/dong-hapjeong.png'
import dongMullae from '@/assets/dongs/dong-mullae.png'
import dongHaebangchon from '@/assets/dongs/dong-haebangchon.png'
import dongIkseon from '@/assets/dongs/dong-ikseon.png'
import dongSamseong from '@/assets/dongs/dong-samseong.png'
import dongHuam from '@/assets/dongs/dong-huam.png'
import dongSangsu from '@/assets/dongs/dong-sangsu.png'


export interface LifestyleType {
  id: string
  emoji: string
  label: string
  description: string
}

export const LIFESTYLE_TYPES: LifestyleType[] = [
  {
    id: 'efficient',
    emoji: '🚀',
    label: '효율 생활형',
    description: '출퇴근 시간 짧고, 일상 편의가 가까운 동네를 선호',
  },
  {
    id: 'cozy',
    emoji: '🌿',
    label: '여유 동네형',
    description: '조용하고 녹지가 가까워 산책·휴식이 좋은 동네',
  },
  {
    id: 'social',
    emoji: '☕',
    label: '핫플 활동형',
    description: '카페·맛집·문화시설이 많은 활기찬 동네',
  },
  {
    id: 'family',
    emoji: '🏡',
    label: '안정 주거형',
    description: '치안·학군·생활 인프라가 균형 잡힌 동네',
  },
]

/** ResultCardProps에 image 필드를 더한 mock 전용 타입. ResultCard 자체는 image를 표시하지 않지만, 후속 phase(상세 페이지/지도 오버레이 등)에서 활용. */
export interface MockResult extends ResultCardProps {
  image: string
}

// 12개 동 — 추천 결과
export const MOCK_RESULTS: MockResult[] = [
  {
    id: 'yeonnam',
    image: dongYeonnam,
    dong: '연남동',
    fullAddress: '서울특별시 마포구 연남동',
    liked: false,
    tags: ['안전 A', '35분', '월세 500/45', '유동인구 8,920'],
    score: 100,
  },
  {
    id: 'mangwon',
    image: dongMangwon,
    dong: '망원1동',
    fullAddress: '서울특별시 마포구 망원1동',
    liked: true,
    tags: ['안전 A', '32분', '월세 550/40', '유동인구 9,210'],
    score: 96,
  },
  {
    id: 'seongsu',
    image: dongSeongsu,
    dong: '성수1가1동',
    fullAddress: '서울특별시 성동구 성수1가1동',
    liked: false,
    tags: ['안전 B', '40분', '월세 600/55', '유동인구 10,500'],
    score: 92,
  },
  {
    id: 'hwayang',
    image: dongHwayang,
    dong: '화양동',
    fullAddress: '서울특별시 광진구 화양동',
    liked: false,
    tags: ['안전 B', '38분', '월세 400/38', '유동인구 7,450'],
    score: 88,
  },
  {
    id: 'yeonhui',
    image: dongYeonhui,
    dong: '연희동',
    fullAddress: '서울특별시 서대문구 연희동',
    liked: false,
    tags: ['안전 A', '30분', '월세 480/40', '유동인구 6,820'],
    score: 84,
  },
  {
    id: 'hapjeong',
    image: dongHapjeong,
    dong: '합정동',
    fullAddress: '서울특별시 마포구 합정동',
    liked: false,
    tags: ['안전 A', '28분', '월세 620/52', '유동인구 11,300'],
    score: 80,
  },
  {
    id: 'mullae',
    image: dongMullae,
    dong: '문래동',
    fullAddress: '서울특별시 영등포구 문래동',
    liked: false,
    tags: ['안전 B', '42분', '월세 380/30', '유동인구 5,940'],
    score: 76,
  },
  {
    id: 'haebangchon',
    image: dongHaebangchon,
    dong: '한남동',
    fullAddress: '서울특별시 용산구 한남동',
    liked: true,
    tags: ['안전 A', '25분', '월세 700/60', '유동인구 7,150'],
    score: 72,
  },
  {
    id: 'ikseon',
    image: dongIkseon,
    dong: '종로1·2·3·4가동',
    fullAddress: '서울특별시 종로구 종로1·2·3·4가동',
    liked: false,
    tags: ['안전 A', '20분', '월세 720/65', '유동인구 12,400'],
    score: 70,
  },
  {
    id: 'samseong',
    image: dongSamseong,
    dong: '삼성1동',
    fullAddress: '서울특별시 강남구 삼성1동',
    liked: false,
    tags: ['안전 A', '50분', '월세 950/85', '유동인구 14,800'],
    score: 66,
  },
  {
    id: 'huam',
    image: dongHuam,
    dong: '후암동',
    fullAddress: '서울특별시 용산구 후암동',
    liked: false,
    tags: ['안전 B', '27분', '월세 540/45', '유동인구 4,820'],
    score: 62,
  },
  {
    id: 'sangsu',
    image: dongSangsu,
    dong: '서교동',
    fullAddress: '서울특별시 마포구 서교동',
    liked: false,
    tags: ['안전 A', '34분', '월세 590/50', '유동인구 8,210'],
    score: 58,
  },
]

// 12개 가게 — 모두 가상의 개인 사업체 (프랜차이즈/실재 상호 미사용)
// ─────────────────────────────────────────────────────────
// HomePage 우측 컬럼 — 동네 명소 (PlaceCard용)
// ─────────────────────────────────────────────────────────

export interface MockPlaceFacilities {
  subway?: { station: string; lines: SubwayLine[] }
  busStops?: number
  bikeStations?: number
}

export interface MockPlaceData {
  icon: 'population' | 'age' | 'composition' | 'road'
  label: string
  value: string
  hint?: string
  hintTone?: 'positive' | 'neutral'
}

export interface MockPlace {
  id: string
  image?: string
  category: '관광특구' | '고궁·문화유산' | '인구밀집지역' | '발달상권' | '공원'
  event?: string
  name: string
  address: string
  facilities: MockPlaceFacilities
  data: MockPlaceData[]
}

export const MOCK_PLACES: MockPlace[] = [
  {
    id: 'gwanghwamun-deoksugung',
    category: '고궁·문화유산',
    event: '문화재 야간개장',
    name: '광화문 · 덕수궁',
    address: '서울시 종로구 · 중구 일대',
    facilities: {
      subway: { station: '시청역', lines: ['1', '2'] },
      busStops: 12,
      bikeStations: 8,
    },
    data: [
      {
        icon: 'population',
        label: '실시간 인구',
        value: '약 32,000명',
        hint: '여유 · ↓ 감소 예상',
        hintTone: 'positive',
      },
      { icon: 'age', label: '연령대 분포', value: '30대 23.8%', hint: '40대 23.5% · 20대 18.8%' },
      { icon: 'composition', label: '인구 구성', value: '여 50.1%', hint: '남 49.9%' },
      { icon: 'road', label: '도로상황', value: '원활', hint: '평균 13km/h', hintTone: 'positive' },
    ],
  },
  {
    id: 'hongdae-area',
    category: '발달상권',
    event: '주말 거리공연',
    name: '홍대 거리',
    address: '서울시 마포구 서교동',
    facilities: {
      subway: { station: '홍대입구역', lines: ['2', 'gyeongui-jungang', 'airport'] },
      busStops: 18,
      bikeStations: 11,
    },
    data: [
      {
        icon: 'population',
        label: '실시간 인구',
        value: '약 58,400명',
        hint: '혼잡 · ↑ 증가 추세',
      },
      { icon: 'age', label: '연령대 분포', value: '20대 41.2%', hint: '30대 26.7% · 10대 12.4%' },
      { icon: 'composition', label: '인구 구성', value: '여 53.6%', hint: '남 46.4%' },
      { icon: 'road', label: '도로상황', value: '서행', hint: '평균 8km/h' },
    ],
  },
  {
    id: 'seongsu-cafe-street',
    category: '발달상권',
    name: '성수 카페거리',
    address: '서울시 성동구 성수동',
    facilities: {
      subway: { station: '성수역', lines: ['2'] },
      busStops: 9,
      bikeStations: 6,
    },
    data: [
      {
        icon: 'population',
        label: '실시간 인구',
        value: '약 21,300명',
        hint: '보통 · — 안정',
        hintTone: 'positive',
      },
      { icon: 'age', label: '연령대 분포', value: '20대 35.4%', hint: '30대 31.2% · 40대 16.8%' },
      { icon: 'composition', label: '인구 구성', value: '여 56.2%', hint: '남 43.8%' },
      { icon: 'road', label: '도로상황', value: '원활', hint: '평균 16km/h', hintTone: 'positive' },
    ],
  },
]

// ─────────────────────────────────────────────────────────
// HomePage 좌측 — 뉴스 (NewsCardHorizontal용)
// ─────────────────────────────────────────────────────────

export interface MockNews {
  id: string
  thumbnail?: string
  title: string
  summary: string
  publishedAt: string
}

export const MOCK_NEWS: MockNews[] = [
  {
    id: 'news-1',
    title: '서울시, 청년안심주택 3차 사전예약 접수 시작',
    summary: '서울특별시가 청년안심주택 3차 사전예약 접수를 시작했습니다.',
    publishedAt: '2026-04-22',
  },
  {
    id: 'news-2',
    title: '연희동 일대 골목길 정비 사업 본격화',
    summary: '서대문구가 연희동 골목길 보행환경 정비를 시작합니다.',
    publishedAt: '2026-04-18',
  },
  {
    id: 'news-3',
    title: '망원시장, 주말 야시장 5월부터 운영',
    summary: '망원시장이 5월 첫째 주말부터 야시장을 정기 운영합니다.',
    publishedAt: '2026-04-15',
  },
  {
    id: 'news-4',
    title: '성수동 공유 오피스 신규 입점 잇따라',
    summary: '성수동에 공유 오피스가 잇따라 입점하며 워킹스테이션 수요가 증가하고 있습니다.',
    publishedAt: '2026-04-10',
  },
]
