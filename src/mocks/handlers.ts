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
  menuCategories: ['치즈케이크', '음료'],
  menus: [
    { id: 11, name: '바스크 치즈케이크', price: 8500 },
    { id: 12, name: '얼그레이 치즈케이크', price: 9000 },
    { id: 13, name: '말차 치즈케이크', price: 9500 },
    { id: 14, name: '초콜릿 바스크', price: 9000 },
    { id: 15, name: '딸기 바스크 (시즌)', price: 10500 },
    { id: 16, name: '바스크 치즈케이크 홀 (미니)', price: 30000 },
    { id: 17, name: '바스크 치즈케이크 홀 (1호)', price: 45000 },
    { id: 18, name: '핸드드립 커피', price: 5500 },
    { id: 19, name: '아이스 아메리카노', price: 4500 },
    { id: 20, name: '카페라떼', price: 5500 },
    { id: 21, name: '얼그레이 밀크티', price: 6000 },
    { id: 22, name: '복숭아 아이스티', price: 5500 },
    { id: 23, name: '제주 말차라떼', price: 6500 },
    { id: 24, name: '딸기 라떼 (시즌)', price: 7000 },
  ],
  participantCurrent: 3,
  participantTotal: 5,
  status: 'RECRUITING' as const,
  currentGroupOrderId: 101,
  likedByCurrentUser: false,
  likeCount: 27,
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
  likeCount: mockStore.likeCount,
  likedByCurrentUser: false,
  latitude: mockStore.latitude,
  longitude: mockStore.longitude,
}

// 백엔드 새 스키마 정합: { id, storeId, menuInfo, price, soldOut }
const mockMenus: { id: number; storeId: number; menuInfo: string; price: number; soldOut: boolean }[] = [
  { id: 11, storeId: 1, menuInfo: '바스크 치즈케이크', price: 8500, soldOut: false },
  { id: 12, storeId: 1, menuInfo: '얼그레이 치즈케이크', price: 9000, soldOut: false },
  { id: 13, storeId: 1, menuInfo: '말차 치즈케이크', price: 9500, soldOut: false },
  { id: 14, storeId: 1, menuInfo: '초콜릿 바스크', price: 9000, soldOut: false },
  { id: 15, storeId: 1, menuInfo: '딸기 바스크 (시즌)', price: 10500, soldOut: true },
  { id: 16, storeId: 1, menuInfo: '바스크 치즈케이크 홀 (미니)', price: 30000, soldOut: false },
  { id: 17, storeId: 1, menuInfo: '바스크 치즈케이크 홀 (1호)', price: 45000, soldOut: false },
  { id: 18, storeId: 1, menuInfo: '핸드드립 커피', price: 5500, soldOut: true },
  { id: 19, storeId: 1, menuInfo: '아이스 아메리카노', price: 4500, soldOut: false },
  { id: 20, storeId: 1, menuInfo: '카페라떼', price: 5500, soldOut: false },
]

// menuId → orderFlow row (가능 액션 플래그로 상태 머신 시각화)
const mockFlows: Record<number, {
  id: number; menuId: number; storeId: number; menuInfo: string; status: string
  canApprove: boolean; canReject: boolean; canMarkReadyForPickup: boolean; canCompletePickup: boolean
}> = {
  // 가게당 진행 모임은 한 건만 — 메뉴 11 만 active, 12/13 은 진행 주문 없음 (404)
  11: {
    id: 201, menuId: 11, storeId: 1, menuInfo: '바스크 치즈케이크 1조각',
    status: 'PENDING',
    canApprove: false, canReject: false, canMarkReadyForPickup: false, canCompletePickup: false, canCancel: true,
    menus: [
      { menuId: 11, menuInfo: '바스크 치즈케이크', price: 8500 },
      { menuId: 12, menuInfo: '얼그레이 치즈케이크', price: 9000 },
      { menuId: 13, menuInfo: '말차 치즈케이크', price: 9500 },
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
      { menuId: 11, menuInfo: '바스크 치즈케이크', price: 8500 },
      { menuId: 12, menuInfo: '얼그레이 치즈케이크', price: 9000 },
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
      { menuId: 13, menuInfo: '말차 치즈케이크', price: 9500 },
      { menuId: 14, menuInfo: '초콜릿 바스크', price: 9000 },
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
      { menuId: 18, menuInfo: '핸드드립 커피', price: 5500 },
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
    const body = (await request.json()) as { storeId: number; menuInfo: string; price: number }
    const newId = Math.max(...mockMenus.map((m) => m.id), 0) + 1
    const created = {
      id: newId,
      storeId: body.storeId,
      menuInfo: body.menuInfo,
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
    const body = (await request.json()) as { menuInfo: string; price: number }
    mockMenus[idx] = { ...mockMenus[idx], menuInfo: body.menuInfo, price: body.price }
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
          { menuId: 11, menuInfo: '바스크 치즈케이크', price: 8500, quantity: 1 },
          { menuId: 12, menuInfo: '얼그레이 치즈케이크', price: 9000, quantity: 1 },
        ],
        totalAmount: 17500, paymentStatus: 'PAID',
      },
      {
        userId: 2, userName: '이수민', joinedAt: '2026-05-13 10:15',
        items: [
          { menuId: 11, menuInfo: '바스크 치즈케이크', price: 8500, quantity: 2 },
        ],
        totalAmount: 17000, paymentStatus: 'PAID',
      },
      {
        userId: 3, userName: '박지훈', joinedAt: '2026-05-13 11:00',
        items: [
          { menuId: 13, menuInfo: '말차 치즈케이크', price: 9500, quantity: 1 },
        ],
        totalAmount: 9500, paymentStatus: 'PENDING',
      },
      {
        userId: 4, userName: '최서연', joinedAt: '2026-05-13 11:45',
        items: [
          { menuId: 11, menuInfo: '바스크 치즈케이크', price: 8500, quantity: 1 },
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
        menuInfo: m?.menuInfo ?? `메뉴 ${id}`,
        price: m?.discountPrice ?? 0,
      }
    })
    const created = {
      id: Math.max(201, ...Object.values(mockFlows).map((f) => f.id)) + 1,
      menuId: body.menuIds[0] ?? 0,
      storeId: body.storeId,
      menuInfo: refs[0]?.menuInfo ?? '',
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
]
