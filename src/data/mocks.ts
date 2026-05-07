import type { ResultCardProps } from '@/components/ui/ResultCard'

export interface MockShopMenu {
  name: string
  description?: string
  price: number
  originalPrice?: number
  image?: string
}

export interface MockShopInfoRow {
  label: string
  value: string
}

export interface MockShop {
  id: string
  image: string
  name: string
  description?: string
  price?: number
  originalPrice?: number
  participantCurrent?: number
  participantTotal?: number
  liked: boolean
  bookmarked: boolean
  images: string[]
  menuCategories: string[]
  menus: MockShopMenu[]
  infoRows: MockShopInfoRow[]
}

export const MOCK_RESULTS: ResultCardProps[] = [
  {
    id: 'yeonnam',
    dong: '연남동',
    fullAddress: '서울특별시 마포구 연남동',
    liked: false,
    tags: ['안전 A', '35분', '월세 500/45', '유동인구 8,920'],
    score: 100,
  },
  {
    id: 'hwayang',
    dong: '화양동',
    fullAddress: '서울특별시 광진구 화양동',
    liked: false,
    tags: ['안전 B', '38분', '월세 400/38', '유동인구 7,450'],
    score: 88,
  },
  {
    id: 'mangwon',
    dong: '망원동',
    fullAddress: '서울특별시 마포구 망원동',
    liked: true,
    tags: ['안전 A', '32분', '월세 550/40', '유동인구 9,210'],
    score: 84,
  },
  {
    id: 'seongsu',
    dong: '성수동',
    fullAddress: '서울특별시 성동구 성수동',
    liked: false,
    tags: ['안전 B', '40분', '월세 600/55', '유동인구 10,500'],
    score: 80,
  },
]

export const MOCK_SHOPS: MockShop[] = [
  {
    id: 'paris-baguette-yeonhui',
    image: '',
    name: '파리바게뜨 연희점',
    description: '빵, 케이크, 디저트',
    price: 7500,
    originalPrice: 15000,
    participantCurrent: 1,
    participantTotal: 5,
    liked: false,
    bookmarked: false,
    images: [],
    menuCategories: ['베이커리', '케이크', '음료', '샌드위치'],
    menus: [
      { name: '초코 케이크', description: '진한 초코 시트와 가나슈', price: 25000 },
      {
        name: '딸기 샌드위치',
        description: '신선한 딸기와 생크림',
        price: 8500,
        originalPrice: 12000,
      },
      { name: '아메리카노', description: '깊고 진한 풍미', price: 4500 },
    ],
    infoRows: [
      { label: '주소', value: '서울특별시 서대문구 연희동 123-45' },
      { label: '전화', value: '02-1234-5678' },
      { label: '영업시간', value: '08:00 - 22:00' },
      { label: '휴무일', value: '연중무휴' },
    ],
  },
  {
    id: 'starbucks-yeonnam',
    image: '',
    name: '스타벅스 연남점',
    description: '커피, 디저트',
    price: 5500,
    participantCurrent: 3,
    participantTotal: 8,
    liked: true,
    bookmarked: false,
    images: [],
    menuCategories: ['커피', '디저트', '머천다이즈'],
    menus: [
      { name: '아메리카노', description: '시그니처 블렌드', price: 4500 },
      { name: '카페라떼', description: '부드러운 우유 거품', price: 5000 },
    ],
    infoRows: [
      { label: '주소', value: '서울특별시 마포구 연남동 567-89' },
      { label: '전화', value: '02-9876-5432' },
      { label: '영업시간', value: '07:00 - 23:00' },
    ],
  },
  {
    id: 'olive-young-mangwon',
    image: '',
    name: '올리브영 망원점',
    description: '뷰티, 헬스케어',
    price: 12000,
    originalPrice: 18000,
    participantCurrent: 2,
    participantTotal: 6,
    liked: false,
    bookmarked: true,
    images: [],
    menuCategories: ['스킨케어', '메이크업', '헤어케어', '바디케어'],
    menus: [
      { name: '토너 200ml', description: '진정 효과', price: 12000, originalPrice: 18000 },
      { name: '립밤', description: '보습 효과', price: 6500 },
    ],
    infoRows: [
      { label: '주소', value: '서울특별시 마포구 망원동 234-56' },
      { label: '전화', value: '02-1111-2222' },
      { label: '영업시간', value: '10:00 - 22:00' },
    ],
  },
]
