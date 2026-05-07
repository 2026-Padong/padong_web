import type { ResultCardProps } from '@/components/ui/ResultCard'

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

import shopYeonhuiBakery from '@/assets/shops/shop-yeonhui-bakery.png'
import shopYeonhuiBakery2 from '@/assets/shops/shop-yeonhui-bakery-2.png'
import shopYeonhuiBakery3 from '@/assets/shops/shop-yeonhui-bakery-3.png'
import shopYeonnamBookCafe from '@/assets/shops/shop-yeonnam-book-cafe.png'
import shopYeonnamBookCafe2 from '@/assets/shops/shop-yeonnam-book-cafe-2.png'
import shopYeonnamBookCafe3 from '@/assets/shops/shop-yeonnam-book-cafe-3.png'
import shopMangwonTteok from '@/assets/shops/shop-mangwon-tteok.png'
import shopMangwonTteok2 from '@/assets/shops/shop-mangwon-tteok-2.png'
import shopMangwonTteok3 from '@/assets/shops/shop-mangwon-tteok-3.png'
import shopSeongsuBunsik from '@/assets/shops/shop-seongsu-bunsik.png'
import shopSeongsuBunsik2 from '@/assets/shops/shop-seongsu-bunsik-2.png'
import shopSeongsuBunsik3 from '@/assets/shops/shop-seongsu-bunsik-3.png'
import shopHapjeongHaejang from '@/assets/shops/shop-hapjeong-haejang.png'
import shopHapjeongHaejang2 from '@/assets/shops/shop-hapjeong-haejang-2.png'
import shopHapjeongHaejang3 from '@/assets/shops/shop-hapjeong-haejang-3.png'
import shopMullaeWineRoom from '@/assets/shops/shop-mullae-wine-room.png'
import shopMullaeWineRoom2 from '@/assets/shops/shop-mullae-wine-room-2.png'
import shopMullaeWineRoom3 from '@/assets/shops/shop-mullae-wine-room-3.png'
import shopYeonhuiDosirak from '@/assets/shops/shop-yeonhui-dosirak.png'
import shopYeonhuiDosirak2 from '@/assets/shops/shop-yeonhui-dosirak-2.png'
import shopYeonhuiDosirak3 from '@/assets/shops/shop-yeonhui-dosirak-3.png'
import shopHaebangchonBakery from '@/assets/shops/shop-haebangchon-bakery.png'
import shopHaebangchonBakery2 from '@/assets/shops/shop-haebangchon-bakery-2.png'
import shopHaebangchonBakery3 from '@/assets/shops/shop-haebangchon-bakery-3.png'
import shopIkseonBingsu from '@/assets/shops/shop-ikseon-bingsu.png'
import shopIkseonBingsu2 from '@/assets/shops/shop-ikseon-bingsu-2.png'
import shopIkseonBingsu3 from '@/assets/shops/shop-ikseon-bingsu-3.png'
import shopSamseongUdonRamen from '@/assets/shops/shop-samseong-udon-ramen.png'
import shopSamseongUdonRamen2 from '@/assets/shops/shop-samseong-udon-ramen-2.png'
import shopSamseongUdonRamen3 from '@/assets/shops/shop-samseong-udon-ramen-3.png'
import shopHuamBaekban from '@/assets/shops/shop-huam-baekban.png'
import shopHuamBaekban2 from '@/assets/shops/shop-huam-baekban-2.png'
import shopHuamBaekban3 from '@/assets/shops/shop-huam-baekban-3.png'
import shopSangsuPizza from '@/assets/shops/shop-sangsu-pizza.png'
import shopSangsuPizza2 from '@/assets/shops/shop-sangsu-pizza-2.png'
import shopSangsuPizza3 from '@/assets/shops/shop-sangsu-pizza-3.png'

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

export type ShopStatus = 'recruiting' | 'closing' | 'closed'

export interface MockShop {
  id: string
  image: string
  name: string
  category: string
  description?: string
  status: ShopStatus
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
    dong: '망원동',
    fullAddress: '서울특별시 마포구 망원동',
    liked: true,
    tags: ['안전 A', '32분', '월세 550/40', '유동인구 9,210'],
    score: 96,
  },
  {
    id: 'seongsu',
    image: dongSeongsu,
    dong: '성수동',
    fullAddress: '서울특별시 성동구 성수동',
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
    dong: '해방촌',
    fullAddress: '서울특별시 용산구 용산동2가',
    liked: true,
    tags: ['안전 A', '25분', '월세 700/60', '유동인구 7,150'],
    score: 72,
  },
  {
    id: 'ikseon',
    image: dongIkseon,
    dong: '익선동',
    fullAddress: '서울특별시 종로구 익선동',
    liked: false,
    tags: ['안전 A', '20분', '월세 720/65', '유동인구 12,400'],
    score: 70,
  },
  {
    id: 'samseong',
    image: dongSamseong,
    dong: '삼성동',
    fullAddress: '서울특별시 강남구 삼성동',
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
    dong: '상수동',
    fullAddress: '서울특별시 마포구 상수동',
    liked: false,
    tags: ['안전 A', '34분', '월세 590/50', '유동인구 8,210'],
    score: 58,
  },
]

// 12개 가게 — 모두 가상의 개인 사업체 (프랜차이즈/실재 상호 미사용)
export const MOCK_SHOPS: MockShop[] = [
  {
    id: 'yeonhui-bakery',
    image: shopYeonhuiBakery,
    name: '연희제빵소',
    category: '베이커리',
    description: '매일 아침 굽는 동네 빵집',
    status: 'recruiting',
    price: 3500,
    originalPrice: 4500,
    participantCurrent: 1,
    participantTotal: 5,
    liked: false,
    bookmarked: false,
    images: [shopYeonhuiBakery, shopYeonhuiBakery2, shopYeonhuiBakery3],
    menuCategories: ['식빵', '캄파뉴', '디저트', '음료'],
    menus: [
      { name: '소금빵', description: '버터 풍미 가득', price: 3500 },
      { name: '통밀 캄파뉴', description: '천연 발효종', price: 8000 },
      { name: '단호박 식빵', description: '단호박 듬뿍', price: 6500 },
      { name: '아메리카노', description: '하우스 블렌드', price: 3500 },
      { name: '바닐라 라떼', description: '직접 만든 시럽', price: 5000 },
    ],
    infoRows: [
      { label: '주소', value: '서울특별시 서대문구 연희로 11길 24, 1층' },
      { label: '전화', value: '02-3142-8200' },
      { label: '영업시간', value: '08:00 - 21:00' },
      { label: '휴무일', value: '매주 월요일' },
    ],
  },
  {
    id: 'yeonnam-book-cafe',
    image: shopYeonnamBookCafe,
    name: '연남책방 라떼',
    category: '카페, 책방',
    description: '책 읽기 좋은 동네 카페',
    status: 'recruiting',
    price: 5000,
    participantCurrent: 3,
    participantTotal: 8,
    liked: true,
    bookmarked: false,
    images: [shopYeonnamBookCafe, shopYeonnamBookCafe2, shopYeonnamBookCafe3],
    menuCategories: ['커피', '디저트', '책'],
    menus: [
      { name: '드립 커피', description: '오늘의 원두', price: 5500 },
      { name: '카페라떼', description: '부드러운 우유 거품', price: 5000 },
      { name: '레몬 파운드', description: '홈베이킹', price: 4500 },
      { name: '치즈케이크', description: '바스크 스타일', price: 6500 },
    ],
    infoRows: [
      { label: '주소', value: '서울특별시 마포구 동교로 246' },
      { label: '전화', value: '02-3144-1101' },
      { label: '영업시간', value: '10:00 - 23:00' },
      { label: '휴무일', value: '매주 화요일' },
    ],
  },
  {
    id: 'mangwon-tteok',
    image: shopMangwonTteok,
    name: '망원 떡방앗간',
    category: '떡, 한과',
    description: '직접 만드는 전통 떡과 한과',
    status: 'closing',
    price: 8000,
    originalPrice: 12000,
    participantCurrent: 4,
    participantTotal: 6,
    liked: false,
    bookmarked: true,
    images: [shopMangwonTteok, shopMangwonTteok2, shopMangwonTteok3],
    menuCategories: ['떡', '한과', '모찌', '음료'],
    menus: [
      { name: '인절미 한 팩', description: '쫀득한 콩가루', price: 8000, originalPrice: 12000 },
      { name: '약과 12개입', description: '꿀에 절인 전통 약과', price: 9000 },
      { name: '딸기 모찌 4구', description: '시즌 한정', price: 12000 },
      { name: '식혜 1L', description: '직접 끓인', price: 6500 },
    ],
    infoRows: [
      { label: '주소', value: '서울특별시 마포구 망원로 17' },
      { label: '전화', value: '02-336-1234' },
      { label: '영업시간', value: '08:00 - 20:00' },
      { label: '휴무일', value: '매주 일요일' },
    ],
  },
  {
    id: 'seongsu-bunsik',
    image: shopSeongsuBunsik,
    name: '성수 분식집',
    category: '분식, 한식',
    description: '24시간 든든한 동네 분식',
    status: 'recruiting',
    price: 4500,
    participantCurrent: 2,
    participantTotal: 4,
    liked: false,
    bookmarked: false,
    images: [shopSeongsuBunsik, shopSeongsuBunsik2, shopSeongsuBunsik3],
    menuCategories: ['김밥', '분식', '식사', '국물'],
    menus: [
      { name: '참치김밥', description: '참치마요 듬뿍', price: 4500 },
      { name: '치즈라면', description: '진한 치즈 토핑', price: 5500 },
      { name: '제육덮밥', description: '매콤한 양념', price: 7500 },
      { name: '돈까스', description: '바삭한 등심', price: 8500 },
    ],
    infoRows: [
      { label: '주소', value: '서울특별시 성동구 성수이로 99' },
      { label: '전화', value: '02-466-7890' },
      { label: '영업시간', value: '24시간' },
      { label: '휴무일', value: '연중무휴' },
    ],
  },
  {
    id: 'hapjeong-haejang',
    image: shopHapjeongHaejang,
    name: '합정 새벽 해장국',
    category: '한식, 국밥',
    description: '24시 영업 해장 전문',
    status: 'recruiting',
    price: 9500,
    participantCurrent: 1,
    participantTotal: 10,
    liked: false,
    bookmarked: false,
    images: [shopHapjeongHaejang, shopHapjeongHaejang2, shopHapjeongHaejang3],
    menuCategories: ['해장국', '국밥', '국물', '반찬'],
    menus: [
      { name: '뼈해장국', description: '뚝배기 푸짐한 등뼈', price: 9500 },
      { name: '내장탕', description: '얼큰한 국물', price: 11000 },
      { name: '순대국밥', description: '직접 만든 순대', price: 9000 },
      { name: '김치찌개', description: '두툼한 돼지고기', price: 8500 },
    ],
    infoRows: [
      { label: '주소', value: '서울특별시 마포구 양화로 45' },
      { label: '전화', value: '02-323-7777' },
      { label: '영업시간', value: '24시간' },
      { label: '휴무일', value: '연중무휴' },
    ],
  },
  {
    id: 'mullae-wine-room',
    image: shopMullaeWineRoom,
    name: '문래 와인다방',
    category: '와인바',
    description: '아늑한 동네 와인 살롱',
    status: 'closed',
    price: 9000,
    participantCurrent: 5,
    participantTotal: 5,
    liked: false,
    bookmarked: false,
    images: [shopMullaeWineRoom, shopMullaeWineRoom2, shopMullaeWineRoom3],
    menuCategories: ['레드와인', '화이트와인', '안주', '치즈'],
    menus: [
      { name: '하우스 레드 글라스', description: '데일리 추천', price: 9000 },
      { name: '치즈 플래터', description: '4종 모듬', price: 22000 },
      { name: '하몽 플래터', description: '하몽과 멜론', price: 28000 },
    ],
    infoRows: [
      { label: '주소', value: '서울특별시 영등포구 문래로 22' },
      { label: '전화', value: '02-2632-1010' },
      { label: '영업시간', value: '17:00 - 01:00' },
      { label: '휴무일', value: '매주 월요일' },
    ],
  },
  {
    id: 'yeonhui-dosirak',
    image: shopYeonhuiDosirak,
    name: '연희 정성도시락',
    category: '도시락, 식사',
    description: '집 근처 단체 주문 맛집',
    status: 'recruiting',
    price: 8900,
    participantCurrent: 6,
    participantTotal: 12,
    liked: true,
    bookmarked: true,
    images: [shopYeonhuiDosirak, shopYeonhuiDosirak2, shopYeonhuiDosirak3],
    menuCategories: ['한식', '양식', '단체메뉴'],
    menus: [
      { name: '소불고기 도시락', description: '간장 양념', price: 9500 },
      { name: '치킨마요 덮밥', description: '바삭한 닭다리살', price: 8500 },
      { name: '제육 도시락', description: '매콤한 제육볶음', price: 8900 },
    ],
    infoRows: [
      { label: '주소', value: '서울특별시 서대문구 연희로 25길 8' },
      { label: '전화', value: '02-364-5678' },
      { label: '영업시간', value: '10:30 - 21:00' },
      { label: '휴무일', value: '매주 일요일' },
    ],
  },
  {
    id: 'haebangchon-bakery',
    image: shopHaebangchonBakery,
    name: '해방촌 빵공방',
    category: '베이커리, 카페',
    description: '동네 작은 시그니처 베이커리',
    status: 'closing',
    price: 6500,
    participantCurrent: 7,
    participantTotal: 8,
    liked: false,
    bookmarked: true,
    images: [shopHaebangchonBakery, shopHaebangchonBakery2, shopHaebangchonBakery3],
    menuCategories: ['베이커리', '디저트', '커피'],
    menus: [
      { name: '슈가 도넛', description: '갓 튀긴 도넛', price: 4500 },
      { name: '바스크 치즈케이크', description: '꾸덕한 식감', price: 7500 },
      { name: '드립 커피', description: '시그니처 블렌드', price: 5000 },
    ],
    infoRows: [
      { label: '주소', value: '서울특별시 용산구 신흥로20길 21-3' },
      { label: '전화', value: '02-749-8202' },
      { label: '영업시간', value: '11:00 - 22:00' },
      { label: '휴무일', value: '매주 화요일' },
    ],
  },
  {
    id: 'ikseon-bingsu',
    image: shopIkseonBingsu,
    name: '익선 빙수다방',
    category: '카페, 디저트',
    description: '한옥에서 즐기는 전통 빙수',
    status: 'recruiting',
    price: 14000,
    participantCurrent: 2,
    participantTotal: 6,
    liked: false,
    bookmarked: false,
    images: [shopIkseonBingsu, shopIkseonBingsu2, shopIkseonBingsu3],
    menuCategories: ['빙수', '전통차', '디저트'],
    menus: [
      { name: '팥빙수', description: '국산 팥과 인절미', price: 14000 },
      { name: '망고빙수', description: '시즌 망고', price: 16000 },
      { name: '쌍화차', description: '한방 보양차', price: 8000 },
    ],
    infoRows: [
      { label: '주소', value: '서울특별시 종로구 익선동 166-29' },
      { label: '전화', value: '02-742-3030' },
      { label: '영업시간', value: '11:00 - 22:00' },
      { label: '휴무일', value: '매주 화요일' },
    ],
  },
  {
    id: 'samseong-udon-ramen',
    image: shopSamseongUdonRamen,
    name: '삼성 우동라멘바',
    category: '일식, 면',
    description: '직접 뽑는 수타 면',
    status: 'recruiting',
    price: 11500,
    participantCurrent: 8,
    participantTotal: 20,
    liked: false,
    bookmarked: false,
    images: [shopSamseongUdonRamen, shopSamseongUdonRamen2, shopSamseongUdonRamen3],
    menuCategories: ['우동', '라멘', '돈부리', '사이드'],
    menus: [
      { name: '카케 우동', description: '담백한 가다랑어 육수', price: 9500 },
      { name: '돈코츠 라멘', description: '12시간 끓인 진한 국물', price: 12500 },
      { name: '튀김 우동', description: '바삭한 새우튀김 토핑', price: 11500 },
      { name: '규동', description: '간장 양념 소고기 덮밥', price: 10500 },
    ],
    infoRows: [
      { label: '주소', value: '서울특별시 강남구 테헤란로 503' },
      { label: '전화', value: '02-555-1234' },
      { label: '영업시간', value: '11:00 - 22:00' },
      { label: '휴무일', value: '매월 첫째 화요일' },
    ],
  },
  {
    id: 'huam-baekban',
    image: shopHuamBaekban,
    name: '두텁바위 백반',
    category: '한식, 정식',
    description: '계절 정식 백반집',
    status: 'closed',
    price: 11000,
    participantCurrent: 4,
    participantTotal: 4,
    liked: false,
    bookmarked: false,
    images: [shopHuamBaekban, shopHuamBaekban2, shopHuamBaekban3],
    menuCategories: ['정식', '국물', '반찬'],
    menus: [
      { name: '갈치조림 정식', description: '제철 갈치', price: 13000 },
      { name: '제육 정식', description: '돼지고기 + 5찬', price: 11000 },
      { name: '된장찌개 정식', description: '뚝배기 끓임', price: 9000 },
    ],
    infoRows: [
      { label: '주소', value: '서울특별시 용산구 두텁바위로 28' },
      { label: '전화', value: '02-794-2456' },
      { label: '영업시간', value: '11:00 - 21:00' },
      { label: '휴무일', value: '매주 일요일' },
    ],
  },
  {
    id: 'sangsu-pizza',
    image: shopSangsuPizza,
    name: '상수 화덕피자공방',
    category: '양식, 피자',
    description: '나폴리식 화덕 피자',
    status: 'recruiting',
    price: 19000,
    originalPrice: 24000,
    participantCurrent: 3,
    participantTotal: 8,
    liked: true,
    bookmarked: false,
    images: [shopSangsuPizza, shopSangsuPizza2, shopSangsuPizza3],
    menuCategories: ['피자', '파스타', '샐러드', '음료'],
    menus: [
      { name: '마르게리타', description: '클래식 토마토·바질', price: 19000, originalPrice: 24000 },
      { name: '콰트로 포르마지', description: '4종 치즈', price: 26000 },
      { name: '봉골레 파스타', description: '바지락 화이트', price: 18000 },
    ],
    infoRows: [
      { label: '주소', value: '서울특별시 마포구 와우산로 145' },
      { label: '전화', value: '02-333-9090' },
      { label: '영업시간', value: '17:00 - 23:00' },
      { label: '휴무일', value: '매주 월요일' },
    ],
  },
]
