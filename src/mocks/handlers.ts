import { http, HttpResponse, passthrough } from 'msw'

// 클라이언트가 BASE_URL = localhost:8080 으로 요청하므로 MSW 핸들러도 동일 origin에 맞춰야 매칭됨
const BASE = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? 'http://localhost:8080'

// ─────────────────────────────────────────────────────────────
// MSW 핸들러 카탈로그
//
// [Passthrough — multipart/payment 등 명시 처리]
//   POST /auth/signup, /auth/upgrade-admin
//   PUT  /auth/me
//   POST /payments/prepare, /payments/confirm
//
// [TEMP_MOCK — 백엔드 적재 전 임시 mock]
//   GET  /stores/mine, /stores/:id    가게 정보
//   GET  /menus                       메뉴 목록
//   GET  /order-flows                 진행 주문
//   PUT  /stores, DELETE /stores      가게 수정/삭제
//   PUT  /order-flows/*               주문 상태 전이
//   → 백엔드 데이터 준비되면 제거
//
// [Bypass — 핸들러 없음, 실 백엔드 직행 (onUnhandledRequest: 'bypass')]
// ─────────────────────────────────────────────────────────────

// ─── TEMP_MOCK 데이터 ──────────────────────────────────────────────────

const ok = <T,>(data: T, message = 'ok') => ({ statusCode: '200', message, data })

const mockStore = {
  id: 1,
  name: '이태원 치즈케이크',
  category: 'DESSERT',
  categoryLabel: '디저트',
  thumbnailUrl: '',
  description: '수제 바스크 치즈케이크 전문',
  address: '서울 용산구 이태원로 200 2층',
  phoneNumber: '02-794-7777',
  openTime: '10:00',
  closeTime: '22:00',
  weekdayMask: 0b1111111, // 매일
  images: [] as { id: number; url: string; sortOrder: number }[],
  menus: [
    { id: 11, name: '바스크 치즈케이크', price: 8500, soldOut: false },
    { id: 12, name: '얼그레이 치즈케이크', price: 9000, soldOut: false },
    { id: 13, name: '말차 치즈케이크', price: 9500, soldOut: false },
    { id: 14, name: '초콜릿 바스크', price: 9000, soldOut: false },
    { id: 15, name: '딸기 바스크 (시즌)', price: 10500, soldOut: true },
    { id: 16, name: '바스크 치즈케이크 홀 (미니)', price: 30000, soldOut: false },
    { id: 17, name: '바스크 치즈케이크 홀 (1호)', price: 45000, soldOut: false },
    { id: 18, name: '핸드드립 커피', price: 5500, soldOut: true },
    { id: 19, name: '아이스 아메리카노', price: 4500, soldOut: false },
    { id: 20, name: '카페라떼', price: 5500, soldOut: false },
    { id: 21, name: '얼그레이 밀크티', price: 6000, soldOut: false },
    { id: 22, name: '복숭아 아이스티', price: 5500, soldOut: false },
    { id: 23, name: '제주 말차라떼', price: 6500, soldOut: false },
    { id: 24, name: '딸기 라떼 (시즌)', price: 7000, soldOut: false },
  ],
  participantCurrent: 3,
  participantTotal: 5,
  recruitmentStatus: 'RECRUITING' as const,
  currentGroupOrder: { id: 101, recruitmentDeadline: new Date(Date.now() + 3*60*60*1000).toISOString(), minOrderPerPerson: 8000 },
  likedByCurrentUser: false,
  latitude: 37.5347,
  longitude: 126.9947,
}

const mockMineRow = {
  id: mockStore.id,
  name: mockStore.name,
  category: mockStore.category,
  categoryLabel: mockStore.categoryLabel,
  address: mockStore.address,
  phoneNumber: mockStore.phoneNumber,
  description: mockStore.description,
  openTime: mockStore.openTime,
  closeTime: mockStore.closeTime,
  weekdayMask: mockStore.weekdayMask,
  thumbnailUrl: mockStore.thumbnailUrl,
  likeCount: 27,
  likedByCurrentUser: false,
  latitude: mockStore.latitude,
  longitude: mockStore.longitude,
}

// 백엔드 새 스키마 정합: { id, storeId, name, price, soldOut }
const mockMenus: { id: number; storeId: number; name: string; price: number; soldOut: boolean }[] = [
  { id: 11, storeId: 1, name: '바스크 치즈케이크', price: 8500, soldOut: false },
  { id: 12, storeId: 1, name: '얼그레이 치즈케이크', price: 9000, soldOut: false },
  { id: 13, storeId: 1, name: '말차 치즈케이크', price: 9500, soldOut: false },
  { id: 14, storeId: 1, name: '초콜릿 바스크', price: 9000, soldOut: false },
  { id: 15, storeId: 1, name: '딸기 바스크 (시즌)', price: 10500, soldOut: true },
  { id: 16, storeId: 1, name: '바스크 치즈케이크 홀 (미니)', price: 30000, soldOut: false },
  { id: 17, storeId: 1, name: '바스크 치즈케이크 홀 (1호)', price: 45000, soldOut: false },
  { id: 18, storeId: 1, name: '핸드드립 커피', price: 5500, soldOut: true },
  { id: 19, storeId: 1, name: '아이스 아메리카노', price: 4500, soldOut: false },
  { id: 20, storeId: 1, name: '카페라떼', price: 5500, soldOut: false },
]

// menuId → orderFlow row (가능 액션 플래그로 상태 머신 시각화)
const mockFlows: Record<number, {
  id: number; menuId: number; storeId: number; name: string; status: string
  canApprove: boolean; canReject: boolean; canMarkReadyForPickup: boolean; canCompletePickup: boolean
}> = {
  // 가게당 진행 모임은 한 건만 — 메뉴 11 만 active, 12/13 은 진행 주문 없음 (404)
  11: {
    id: 201, menuId: 11, storeId: 1, name: '바스크 치즈케이크 1조각',
    status: 'PENDING',
    closingSoon: true,
    canApprove: false, canReject: false, canMarkReadyForPickup: false, canCompletePickup: false, canCancel: true,
    menus: [
      { menuId: 11, name: '바스크 치즈케이크', price: 8500 },
      { menuId: 12, name: '얼그레이 치즈케이크', price: 9000 },
      { menuId: 13, name: '말차 치즈케이크', price: 9500 },
    ],
    recruitmentStart: '2026-05-13 09:00',
    recruitmentDeadline: '2026-05-13 14:00',
    minOrderPerPerson: 8000,
    paymentMethod: '계좌이체',
    participantCurrent: 3,
    participantTotal: 5,
  } as any,
}

// 과거 모임 내역 (완료/거절된 모임)
const mockFlowHistory = [
  {
    id: 301, storeId: 1, status: 'COMPLETED',
    menus: [
      { menuId: 11, name: '바스크 치즈케이크', price: 8500 },
      { menuId: 12, name: '얼그레이 치즈케이크', price: 9000 },
    ],
    recruitmentStart: '2026-05-08 09:00',
    recruitmentDeadline: '2026-05-08 14:00',
    participantCount: 5,
    totalAmount: 42500,
    completedAt: '2026-05-08 19:30',
  },
  {
    id: 302, storeId: 1, status: 'COMPLETED',
    menus: [
      { menuId: 13, name: '말차 치즈케이크', price: 9500 },
      { menuId: 14, name: '초콜릿 바스크', price: 9000 },
    ],
    recruitmentStart: '2026-05-05 10:00',
    recruitmentDeadline: '2026-05-05 15:00',
    participantCount: 4,
    totalAmount: 37000,
    completedAt: '2026-05-05 20:00',
  },
  {
    id: 303, storeId: 1, status: 'REJECTED',
    menus: [
      { menuId: 18, name: '핸드드립 커피', price: 5500 },
    ],
    recruitmentStart: '2026-05-02 11:00',
    recruitmentDeadline: '2026-05-02 16:00',
    participantCount: 2,
    totalAmount: 11000,
    completedAt: '2026-05-02 21:15',
  },
]

function transitionFlow(menuId: number, action: 'approve' | 'reject' | 'ready' | 'pickup-complete') {
  const cur = mockFlows[menuId]
  if (!cur) return null
  const next: any = { ...cur, canCancel: false }
  switch (action) {
    case 'approve':
      next.status = 'APPROVED'
      next.canApprove = false; next.canReject = false; next.canMarkReadyForPickup = true; next.canCompletePickup = false
      break
    case 'reject':
      next.status = 'REJECTED'
      next.canApprove = false; next.canReject = false; next.canMarkReadyForPickup = false; next.canCompletePickup = false
      break
    case 'ready':
      next.status = 'READY'
      next.canApprove = false; next.canReject = false; next.canMarkReadyForPickup = false; next.canCompletePickup = true
      break
    case 'pickup-complete':
      next.status = 'COMPLETED'
      next.canApprove = false; next.canReject = false; next.canMarkReadyForPickup = false; next.canCompletePickup = false
      break
  }
  mockFlows[menuId] = next
  return next
}

export const handlers = [
  // multipart auth — explicit passthrough (FormData 손상 회피)
  http.post(`${BASE}/auth/signup`, () => passthrough()),
  http.post(`${BASE}/auth/upgrade-admin`, () => passthrough()),
  http.put(`${BASE}/auth/me`, () => passthrough()),

  // 결제 — 실 백엔드 + PortOne 직행
  http.post(`${BASE}/payments/prepare`, () => passthrough()),
  http.post(`${BASE}/payments/confirm`, () => passthrough()),

  // ─── TEMP_MOCK 시작 ──────────────────────────────────────────────────

  // 내 가게 목록
  http.get(`${BASE}/stores/mine`, () =>
    HttpResponse.json(
      ok({
        content: [mockMineRow],
        page: 0, size: 20, totalElements: 1, totalPages: 1,
        first: true, last: true, hasNext: false, hasPrevious: false,
      }),
    ),
  ),

  // 카테고리 옵션 — 드롭다운 채울 enum 라벨 리스트
  http.get(`${BASE}/stores/categories`, () =>
    HttpResponse.json(
      ok([
        { code: 'DESSERT', label: '디저트' },
        { code: 'BAKERY', label: '베이커리' },
        { code: 'CAFE', label: '카페' },
        { code: 'KOREAN', label: '한식' },
        { code: 'CHINESE', label: '중식' },
        { code: 'JAPANESE', label: '일식' },
        { code: 'WESTERN', label: '양식' },
        { code: 'SNACK', label: '분식' },
        { code: 'FASTFOOD', label: '패스트푸드' },
        { code: 'CHICKEN', label: '치킨' },
        { code: 'PIZZA', label: '피자' },
        { code: 'ETC', label: '기타' },
      ]),
    ),
  ),

  // 가게 상세 — id 무시하고 mockStore 반환
  http.get(`${BASE}/stores/:id`, () => HttpResponse.json(ok(mockStore))),

  // 가게 수정
  http.put(`${BASE}/stores`, ({ request }) => {
    const url = new URL(request.url)
    Object.assign(mockStore, {
      name: url.searchParams.get('name') ?? mockStore.name,
      address: url.searchParams.get('address') ?? mockStore.address,
      phoneNumber: url.searchParams.get('phoneNumber') ?? mockStore.phoneNumber,
      openTime: url.searchParams.get('openTime') ?? mockStore.openTime,
      closeTime: url.searchParams.get('closeTime') ?? mockStore.closeTime,
    })
    Object.assign(mockMineRow, {
      name: mockStore.name, address: mockStore.address, phoneNumber: mockStore.phoneNumber,
      openTime: mockStore.openTime, closeTime: mockStore.closeTime,
    })
    return HttpResponse.json(ok(mockMineRow, '가게 정보 수정 성공'))
  }),

  // 가게 삭제
  http.delete(`${BASE}/stores`, () => HttpResponse.json(ok(null, '가게 삭제 성공'))),

  // 메뉴 목록
  http.get(`${BASE}/menus`, () => HttpResponse.json(ok(mockMenus))),

  // 메뉴 등록 (JSON body)
  http.post(`${BASE}/menus`, async ({ request }) => {
    const body = (await request.json()) as { storeId: number; name: string; price: number }
    const newId = Math.max(...mockMenus.map((m) => m.id), 0) + 1
    const created = {
      id: newId,
      storeId: body.storeId,
      name: body.name,
      price: body.price,
      soldOut: false,
    }
    mockMenus.push(created)
    return HttpResponse.json(ok(created, '메뉴 등록 성공'))
  }),

  // 메뉴 수정 (path variant + JSON body)
  http.put(`${BASE}/menus/:menuId`, async ({ params, request }) => {
    const menuId = Number(params.menuId)
    const idx = mockMenus.findIndex((m) => m.id === menuId)
    if (idx === -1) {
      return HttpResponse.json({ statusCode: '404', message: '메뉴 없음', data: null }, { status: 404 })
    }
    const body = (await request.json()) as { name: string; price: number }
    mockMenus[idx] = { ...mockMenus[idx], name: body.name, price: body.price }
    return HttpResponse.json(ok(mockMenus[idx], '메뉴 수정 성공'))
  }),

  // 메뉴 삭제 (path variant)
  http.delete(`${BASE}/menus/:menuId`, ({ params }) => {
    const menuId = Number(params.menuId)
    const idx = mockMenus.findIndex((m) => m.id === menuId)
    if (idx === -1) {
      return HttpResponse.json({ statusCode: '404', message: '메뉴 없음', data: null }, { status: 404 })
    }
    mockMenus.splice(idx, 1)
    return HttpResponse.json(ok(null, '메뉴 삭제 성공'))
  }),

  // 메뉴 품절 토글
  http.put(`${BASE}/menus/sold-out`, ({ request }) => {
    const url = new URL(request.url)
    const menuId = Number(url.searchParams.get('menuId'))
    const soldOut = url.searchParams.get('soldOut') === 'true'
    const idx = mockMenus.findIndex((m) => m.id === menuId)
    if (idx === -1) {
      return HttpResponse.json({ statusCode: '404', message: '메뉴 없음', data: null }, { status: 404 })
    }
    mockMenus[idx] = { ...mockMenus[idx], soldOut }
    return HttpResponse.json(ok(mockMenus[idx], soldOut ? '품절 처리 성공' : '품절 해제 성공'))
  }),

  // 주문 흐름 단건
  http.get(`${BASE}/order-flows`, ({ request }) => {
    const url = new URL(request.url)
    const menuId = Number(url.searchParams.get('menuId'))
    const flow = mockFlows[menuId]
    if (!flow) {
      return HttpResponse.json({ statusCode: '404', message: '진행 중인 주문 없음', data: null }, { status: 404 })
    }
    return HttpResponse.json(ok(flow))
  }),

  // 모임 내역 단건
  http.get(`${BASE}/order-flows/history/:id`, ({ params }) => {
    const id = Number(params.id)
    const item = mockFlowHistory.find((it) => it.id === id)
    if (!item) return HttpResponse.json({ statusCode: '404', message: '내역 없음', data: null }, { status: 404 })
    return HttpResponse.json(ok(item))
  }),

  // 모임 내역 (과거 완료/거절된 모임) — ?from / ?to (YYYY-MM-DD) 로 완료일 범위 필터
  http.get(`${BASE}/order-flows/history`, ({ request }) => {
    const url = new URL(request.url)
    const from = url.searchParams.get('from') || ''
    const to = url.searchParams.get('to') || ''
    const filtered = mockFlowHistory.filter((it) => {
      const completedDate = it.completedAt.slice(0, 10) // YYYY-MM-DD
      if (from && completedDate < from) return false
      if (to && completedDate > to) return false
      return true
    })
    return HttpResponse.json(ok(filtered))
  }),

  // 모임 참여자 리스트
  http.get(`${BASE}/order-flows/:id/participants`, ({ params }) => {
    const id = Number(params.id)
    const participants = [
      {
        userId: 1, userName: '김예일', joinedAt: '2026-05-13 09:30',
        items: [
          { menuId: 11, name: '바스크 치즈케이크', price: 8500, quantity: 1 },
          { menuId: 12, name: '얼그레이 치즈케이크', price: 9000, quantity: 1 },
        ],
        totalAmount: 17500, paymentStatus: 'PAID',
      },
      {
        userId: 2, userName: '이수민', joinedAt: '2026-05-13 10:15',
        items: [
          { menuId: 11, name: '바스크 치즈케이크', price: 8500, quantity: 2 },
        ],
        totalAmount: 17000, paymentStatus: 'PAID',
      },
      {
        userId: 3, userName: '박지훈', joinedAt: '2026-05-13 11:00',
        items: [
          { menuId: 13, name: '말차 치즈케이크', price: 9500, quantity: 1 },
        ],
        totalAmount: 9500, paymentStatus: 'PENDING',
      },
      {
        userId: 4, userName: '최서연', joinedAt: '2026-05-13 11:45',
        items: [
          { menuId: 11, name: '바스크 치즈케이크', price: 8500, quantity: 1 },
        ],
        totalAmount: 8500, paymentStatus: 'CANCELLED',
      },
    ]
    return HttpResponse.json(ok(participants.filter(() => id > 0)))
  }),

  // 모임 생성 — body 로 storeId / menuIds / 일정 / 최소 주문 / 인원 받음
  http.post(`${BASE}/order-flows`, async ({ request }) => {
    const body = (await request.json()) as {
      storeId: number
      menuIds: number[]
      recruitmentStart: string
      recruitmentDeadline: string
      minOrderPerPerson: number
      participantTotal: number
    }
    const refs = body.menuIds.map((id) => {
      const m = mockMenus.find((x) => x.id === id)
      return {
        menuId: id,
        name: m?.name ?? `메뉴 ${id}`,
        price: m?.price ?? 0,
      }
    })
    const created = {
      id: Math.max(201, ...Object.values(mockFlows).map((f) => f.id)) + 1,
      menuId: body.menuIds[0] ?? 0,
      storeId: body.storeId,
      name: refs[0]?.name ?? '',
      status: 'PENDING',
      canApprove: true, canReject: true, canMarkReadyForPickup: false, canCompletePickup: false,
      menus: refs,
      recruitmentStart: body.recruitmentStart,
      recruitmentDeadline: body.recruitmentDeadline,
      minOrderPerPerson: body.minOrderPerPerson,
      participantCurrent: 0,
      participantTotal: body.participantTotal,
    }
    // 첫 메뉴 id 키로 mockFlows 에 등록 (활성 모임 1건 가정)
    if (created.menuId) mockFlows[created.menuId] = created as any
    return HttpResponse.json(ok(created, '모임 생성 성공'))
  }),

  // 주문 상태 전이
  http.put(`${BASE}/order-flows/:action`, ({ params, request }) => {
    const action = params.action as 'approve' | 'reject' | 'ready' | 'pickup-complete' | 'cancel'
    const url = new URL(request.url)
    const orderFlowId = Number(url.searchParams.get('orderFlowId'))
    // mockFlows 에서 orderFlowId 매칭
    const entry = Object.values(mockFlows).find((f) => f.id === orderFlowId)
    if (!entry) {
      return HttpResponse.json({ statusCode: '404', message: '주문 없음', data: null }, { status: 404 })
    }
    if (action === 'cancel') {
      // 모집중 취소 — 해당 menuId 키 제거
      delete mockFlows[entry.menuId]
      return HttpResponse.json(ok(null, '모임 취소 성공'))
    }
    const next = transitionFlow(entry.menuId, action)
    return HttpResponse.json(ok(next))
  }),

  // 뉴스 — 동네 검색
  // 프론트가 동네 설정 구조와 동일하게 ?adminDongId=N 으로 호출
  // 응답: { items: [{ adminDongId, title, description, originallink, thumbnail }] } (최대 20건)
  http.get(`${BASE}/news/search`, ({ request }) => {
    const url = new URL(request.url)
    const adminDongIdParam = url.searchParams.get('adminDongId')
    const adminDongId = adminDongIdParam ? Number(adminDongIdParam) : 0
    let matched: MockNews[]
    if (!adminDongId) {
      matched = MOCK_NEWS
    } else {
      matched = MOCK_NEWS.filter((n) => n.adminDongId === adminDongId)
      if (matched.length === 0) {
        // 매칭 없으면 일반(서울) + 셔플 fallback
        const general = MOCK_NEWS.filter((n) => n.adminDongId === 0)
        const rest = MOCK_NEWS.filter((n) => n.adminDongId !== 0)
          .sort(() => Math.random() - 0.5)
        matched = [...general, ...rest]
      } else if (matched.length < 20) {
        const others = MOCK_NEWS.filter((n) => !matched.includes(n))
          .sort(() => Math.random() - 0.5)
        matched = [...matched, ...others]
      }
    }
    return HttpResponse.json(ok({ items: matched.slice(0, 20).map(stripDong) }))
  }),

  // 뉴스 — 랜덤
  http.get(`${BASE}/news/random`, ({ request }) => {
    const size = Number(new URL(request.url).searchParams.get('size') ?? 12)
    const shuffled = [...MOCK_NEWS].sort(() => Math.random() - 0.5).slice(0, size)
    return HttpResponse.json(ok({ items: shuffled.map(stripDong) }))
  }),
]

// ─── 뉴스 mock 데이터 ──────────────────────────────────────────────────────
type MockNews = {
  adminDongId: number
  dong: string
  title: string
  description: string
  originallink: string
  thumbnail: string
}

const MOCK_NEWS: MockNews[] = [
  // 연남동
  { adminDongId: 1, dong: '연남동', title: '연남동 공유 주방, 청년 창업자 입주 시작', description: '서울 마포구 연남동에 청년 창업자를 위한 공유 주방이 새로 문을 열었다. 입주 신청은 다음 달까지.', originallink: 'https://news.example.com/yeonnam-kitchen', thumbnail: 'https://picsum.photos/seed/news1/640/360' },
  { adminDongId: 1, dong: '연남동', title: '연남동 길거리 음악회, 매주 토요일 개최', description: '연남동 경의선 숲길에서 매주 토요일 저녁 7시 길거리 음악회가 열린다.', originallink: 'https://news.example.com/yeonnam-music', thumbnail: 'https://picsum.photos/seed/news2/640/360' },
  { adminDongId: 1, dong: '연남동', title: '연남동 인기 카페 5곳, 봄 시즌 메뉴 출시', description: '연남동 카페들이 봄 시즌 한정 메뉴를 출시했다. 딸기 라떼·벚꽃 디저트 등 다양.', originallink: 'https://news.example.com/yeonnam-cafe-spring', thumbnail: 'https://picsum.photos/seed/news3/640/360' },
  { adminDongId: 1, dong: '연남동', title: '연남동 책방거리, 독립서점 12곳 합동 페어 개최', description: '경의선 숲길 인근 독립서점 12곳이 모인 책 페어가 5월 말 열린다.', originallink: 'https://news.example.com/yeonnam-bookfair', thumbnail: 'https://picsum.photos/seed/news4/640/360' },
  { adminDongId: 1, dong: '연남동', title: '연남동 반려동물 동반 카페 8곳 지도 공개', description: '연남동 반려동물 동반 가능 카페 8곳을 한 눈에 볼 수 있는 지도 서비스가 출시됐다.', originallink: 'https://news.example.com/yeonnam-pet', thumbnail: 'https://picsum.photos/seed/news5/640/360' },

  // 이태원동
  { adminDongId: 2, dong: '이태원동', title: '이태원동 디저트 거리, 주말 인파로 활기', description: '이태원동 디저트 거리가 봄을 맞아 주말마다 인파로 붐비고 있다. 신규 매장도 다수.', originallink: 'https://news.example.com/itaewon-dessert', thumbnail: 'https://picsum.photos/seed/news6/640/360' },
  { adminDongId: 2, dong: '이태원동', title: '이태원 글로벌 빌리지 광장 야시장 5월부터', description: '이태원 글로벌 빌리지 광장에서 5월부터 매주 금·토 야시장이 운영된다.', originallink: 'https://news.example.com/itaewon-night-market', thumbnail: 'https://picsum.photos/seed/news7/640/360' },
  { adminDongId: 2, dong: '이태원동', title: '이태원 클럽 안전 점검 강화', description: '용산구청이 이태원 클럽가 안전 점검을 강화한다고 발표했다.', originallink: 'https://news.example.com/itaewon-safety', thumbnail: 'https://picsum.photos/seed/news8/640/360' },
  { adminDongId: 2, dong: '이태원동', title: '이태원 세계음식거리 푸드 페스티벌 개최', description: '7개국 셰프가 참여하는 세계음식거리 푸드 페스티벌이 5월 18~19일 열린다.', originallink: 'https://news.example.com/itaewon-food-fest', thumbnail: 'https://picsum.photos/seed/news9/640/360' },

  // 망원동
  { adminDongId: 3, dong: '망원동', title: '망원시장, 청년 점포 입점 모집', description: '망원시장이 청년 창업 점포 입점자를 모집한다. 임대료 일부 지원.', originallink: 'https://news.example.com/mangwon-market', thumbnail: 'https://picsum.photos/seed/news10/640/360' },
  { adminDongId: 3, dong: '망원동', title: '망원한강공원 봄 야경 명소로 부상', description: '망원한강공원이 벚꽃 시즌 SNS 인증샷 명소로 떠올랐다.', originallink: 'https://news.example.com/mangwon-park', thumbnail: 'https://picsum.photos/seed/news11/640/360' },
  { adminDongId: 3, dong: '망원동', title: '망원동 인디 라이브하우스, 신인 밴드 발굴 프로젝트', description: '망원동 인디 라이브하우스가 신인 밴드 발굴 프로젝트를 시작한다.', originallink: 'https://news.example.com/mangwon-indie', thumbnail: 'https://picsum.photos/seed/news12/640/360' },

  // 서교동
  { adminDongId: 4, dong: '서교동', title: '서교동 골목길 가게 투어 프로그램 신설', description: '홍대 인근 서교동 골목길의 작은 가게들을 둘러보는 투어 프로그램이 신설됐다.', originallink: 'https://news.example.com/seogyo-tour', thumbnail: 'https://picsum.photos/seed/news13/640/360' },
  { adminDongId: 4, dong: '서교동', title: '홍대 거리 공연 가이드라인 신규 마련', description: '마포구가 홍대 일대 거리 공연 가이드라인을 새로 마련했다.', originallink: 'https://news.example.com/seogyo-busking', thumbnail: 'https://picsum.photos/seed/news14/640/360' },

  // 성수동
  { adminDongId: 5, dong: '성수동', title: '성수동 팝업 스토어 거리, 주말 방문객 2배 증가', description: '성수동 일대 팝업 스토어가 늘면서 주말 방문객이 작년 대비 2배 증가했다.', originallink: 'https://news.example.com/seongsu-popup', thumbnail: 'https://picsum.photos/seed/news15/640/360' },
  { adminDongId: 5, dong: '성수동', title: '성수동 베이커리 6곳, 무료 시식회 개최', description: '성수동 인기 베이커리 6곳이 합동 무료 시식회를 개최한다. 사전 신청 필수.', originallink: 'https://news.example.com/seongsu-bakery', thumbnail: 'https://picsum.photos/seed/news16/640/360' },
  { adminDongId: 5, dong: '성수동', title: '성수동 패션 위크 5월 둘째 주 개최', description: '성수동 일대에서 신진 디자이너 30팀이 참여하는 패션 위크가 열린다.', originallink: 'https://news.example.com/seongsu-fashion', thumbnail: 'https://picsum.photos/seed/news17/640/360' },
  { adminDongId: 5, dong: '성수동', title: '성수동 수제 가구 거리, 가게 30곳 지도화', description: '성수동 수제 가구 공방 30곳을 지도로 정리한 가이드가 공개됐다.', originallink: 'https://news.example.com/seongsu-furniture', thumbnail: 'https://picsum.photos/seed/news18/640/360' },

  // 합정동
  { adminDongId: 6, dong: '합정동', title: '합정동 한강 공원 봄꽃 축제 개최', description: '합정동 인근 한강 공원에서 봄꽃 축제가 5월 첫 주 열린다.', originallink: 'https://news.example.com/hapjeong-flower', thumbnail: 'https://picsum.photos/seed/news19/640/360' },
  { adminDongId: 6, dong: '합정동', title: '합정동 카페거리, 24시간 운영 매장 늘어', description: '합정동 카페거리에 24시간 운영 매장이 빠르게 늘고 있다.', originallink: 'https://news.example.com/hapjeong-cafe', thumbnail: 'https://picsum.photos/seed/news20/640/360' },

  // 삼성동
  { adminDongId: 7, dong: '삼성동', title: '코엑스 일대 보행자 우선 거리 시범 운영', description: '강남구가 코엑스 일대에 보행자 우선 거리를 시범 운영한다.', originallink: 'https://news.example.com/samseong-walk', thumbnail: 'https://picsum.photos/seed/news21/640/360' },
  { adminDongId: 7, dong: '삼성동', title: '삼성동 직장인 점심 핫스팟 TOP 10', description: '삼성동 직장인이 자주 찾는 점심 맛집 10곳이 공개됐다.', originallink: 'https://news.example.com/samseong-lunch', thumbnail: 'https://picsum.photos/seed/news22/640/360' },

  // 역삼동
  { adminDongId: 8, dong: '역삼동', title: '역삼동 IT 스타트업 밋업 5월 개최', description: '역삼동 일대 IT 스타트업 50팀이 참여하는 정기 밋업이 5월 마지막 주 열린다.', originallink: 'https://news.example.com/yeoksam-startup', thumbnail: 'https://picsum.photos/seed/news23/640/360' },
  { adminDongId: 8, dong: '역삼동', title: '역삼동 야간 자율주행 셔틀 시범 운행', description: '역삼동 일대에서 야간 자율주행 셔틀이 시범 운행된다.', originallink: 'https://news.example.com/yeoksam-shuttle', thumbnail: 'https://picsum.photos/seed/news24/640/360' },

  // 신사동
  { adminDongId: 9, dong: '신사동', title: '가로수길 봄 패션 트렌드 한눈에', description: '가로수길 스트리트 패션 트렌드를 정리한 화보가 공개됐다.', originallink: 'https://news.example.com/sinsa-fashion', thumbnail: 'https://picsum.photos/seed/news25/640/360' },

  // 잠실동
  { adminDongId: 10, dong: '잠실동', title: '잠실 한강공원 자전거 도로 재정비 완료', description: '잠실 한강공원 자전거 도로 재정비 공사가 완료되어 5월부터 정상 이용 가능.', originallink: 'https://news.example.com/jamsil-bike', thumbnail: 'https://picsum.photos/seed/news26/640/360' },

  // 일반 도시 뉴스 (어느 동 선택해도 fallback 가능)
  { adminDongId: 0, dong: '서울', title: '서울시, 동네 소분 모임 플랫폼 사장님 지원 사업 발표', description: '서울시가 동네 소분 모임 플랫폼 입점 사장님 대상 지원 사업을 발표했다. 신청은 6월부터.', originallink: 'https://news.example.com/seoul-support', thumbnail: 'https://picsum.photos/seed/news27/640/360' },
  { adminDongId: 0, dong: '서울', title: '소상공인 디지털 전환 컨설팅 무료 지원', description: '서울시가 소상공인 대상 디지털 전환 컨설팅을 무료 지원한다고 발표했다.', originallink: 'https://news.example.com/seoul-digital', thumbnail: 'https://picsum.photos/seed/news28/640/360' },
]

function stripDong<T extends { dong: string }>(n: T) {
  const { dong: _dong, ...rest } = n
  return rest
}
