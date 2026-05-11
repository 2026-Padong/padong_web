import { http, HttpResponse, passthrough } from 'msw'
import { MOCK_SHOPS, MOCK_RESULTS, LIFESTYLE_TYPES } from '@/data/mocks'
import { PREFERENCE_QUESTIONS } from '@/features/neighborhood-finder/data/preferenceQuestions'
import type { LatLng } from '@/api/contracts/results'

// 클라이언트가 BASE_URL = localhost:8080 으로 요청하므로 MSW 핸들러도 동일 origin에 맞춰야 매칭됨
const BASE = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? 'http://localhost:8080'

// 서버 측 행정동 GeoJSON 조회 시뮬레이션 — mock은 public/data에서 fetch + 모듈 캐시
// 실제 백엔드는 DB에서 동네 코드 → geometry 조회 후 응답 inline 동봉
interface DongFeature {
  ADM_NM: string
  paths: LatLng[]
  center: LatLng
}
let dongCache: Map<string, DongFeature> | null = null

// 폴리곤의 bounding box 중심 — 정점 평균은 정점 밀집 영역으로 편향됨, bbox는 시각적 dead-center
function computeCenter(paths: LatLng[]): LatLng {
  let minLat = Infinity
  let maxLat = -Infinity
  let minLng = Infinity
  let maxLng = -Infinity
  for (const p of paths) {
    if (p.lat < minLat) minLat = p.lat
    if (p.lat > maxLat) maxLat = p.lat
    if (p.lng < minLng) minLng = p.lng
    if (p.lng > maxLng) maxLng = p.lng
  }
  return { lat: (minLat + maxLat) / 2, lng: (minLng + maxLng) / 2 }
}

function ringsToPaths(geom: { type: string; coordinates: unknown }): LatLng[] {
  // Polygon: [[[lng,lat],...]] / MultiPolygon: [[[[lng,lat],...]],...]
  let outer: number[][]
  if (geom.type === 'Polygon') {
    outer = (geom.coordinates as number[][][])[0]
  } else {
    const polys = geom.coordinates as number[][][][]
    let largest = polys[0][0]
    for (const p of polys) {
      if (p[0].length > largest.length) largest = p[0]
    }
    outer = largest
  }
  return outer.map(([lng, lat]) => ({ lat, lng }))
}

async function getDongCache(): Promise<Map<string, DongFeature>> {
  if (dongCache) return dongCache
  try {
    const res = await fetch('/data/seoul-dongs.geo.json')
    if (!res.ok) throw new Error('failed')
    const data = (await res.json()) as {
      features: Array<{ properties: { ADM_NM: string }; geometry: { type: string; coordinates: unknown } }>
    }
    const map = new Map<string, DongFeature>()
    for (const f of data.features) {
      const paths = ringsToPaths(f.geometry)
      map.set(f.properties.ADM_NM, {
        ADM_NM: f.properties.ADM_NM,
        paths,
        center: computeCenter(paths),
      })
    }
    dongCache = map
  } catch {
    dongCache = new Map()
  }
  return dongCache
}

// 법정동→행정동 fuzzy 매칭 — 정확 매칭 실패 시 prefix(끝 '동' 제거)로 fallback
// 예: '망원동' → '망원1동', '성수동' → '성수1가1동'
function findDongFeature(map: Map<string, DongFeature>, name: string): DongFeature | undefined {
  const exact = map.get(name)
  if (exact) return exact
  const stem = name.endsWith('동') || name.endsWith('가') ? name.slice(0, -1) : name
  if (!stem) return undefined
  for (const [admName, feature] of map) {
    if (admName.startsWith(stem)) return feature
  }
  return undefined
}

// ─────────────────────────────────────────────────────────────
// MSW 핸들러 카탈로그
//
// [Mocked — 백엔드 데이터 없거나 prototype 흐름]
//   GET  /stores            가게 목록 (검색·필터·페이징)
//   GET  /stores/:id        가게 상세
//   POST /stores/likes      좋아요 토글 (in-memory state)
//   GET  /dongs/search      행정동 자동완성
//   GET  /neighborhoods/*   맞춤 동네 찾기 결과
//   GET  /preferences/*     취향 설문 데이터
//
// [Passthrough — multipart Blob 손상 회피 위해 명시 처리]
//   POST /auth/signup
//   POST /auth/upgrade-admin
//
// [Bypass — 핸들러 없음, 실 백엔드 직행 (onUnhandledRequest: 'bypass')]
//   /auth/me, /auth/me-detail, /auth/logout, /auth/reissue, DELETE /auth/me
//   /dongne/admin-dongs, /dongne/detail, /dongne/likes/*
//   /stores POST/PUT/DELETE, /stores/mine, /stores/likes/me
//   /menus, /rent-price/*, /path/*, /mobility/* 등
//
// VITE_USE_MOCKS=false 설정 시 위 mocked 도 모두 백엔드 직행
// ─────────────────────────────────────────────────────────────

// 좋아요 상태 in-memory 시뮬레이션 (사용자 한 명 가정)
const mockLikedStoreIds = new Set<number>()
const mockLikeCountByStore = new Map<number, number>()

export const handlers = [
  // multipart auth 엔드포인트 — MSW가 절대 건드리지 않게 explicit passthrough
  http.post(`${BASE}/auth/signup`, () => passthrough()),
  http.post(`${BASE}/auth/upgrade-admin`, () => passthrough()),

  // 가게 목록 — 백엔드 GET /stores 스펙 일치 (ShopSummaryResponse + PageResponse + ResponseDTO)
  http.get(`${BASE}/stores`, ({ request }) => {
    const url = new URL(request.url)
    const q = url.searchParams.get('q')?.toLowerCase() ?? ''
    const status = url.searchParams.get('status') ?? undefined
    const page = Number(url.searchParams.get('page') ?? '0')
    const size = Number(url.searchParams.get('size') ?? '20')

    let filtered = MOCK_SHOPS
    if (q) {
      filtered = filtered.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.category.toLowerCase().includes(q) ||
          (s.description?.toLowerCase().includes(q) ?? false),
      )
    }
    if (status) {
      filtered = filtered.filter((s) => s.status.toUpperCase() === status.toUpperCase())
    }

    const start = page * size
    const sliced = filtered.slice(start, start + size)
    const content = sliced.map((s) => {
      // MOCK_SHOPS string id ('yeonhui-bakery' 등) → 배열 index 기반 1-based numericId
      // 동일 매핑이 GET /stores/:id 핸들러에도 적용돼야 (양쪽 일관)
      const numericId = MOCK_SHOPS.indexOf(s) + 1
      return {
        id: numericId,
        name: s.name,
        imageUrl: s.image,
        category: s.category,
        description: s.description ?? '',
        participantCurrent: s.participantCurrent ?? 0,
        participantTotal: s.participantTotal ?? 0,
        status: s.status.toUpperCase(),
        likeCount: mockLikeCountByStore.get(numericId) ?? 10,
        likedByCurrentUser: mockLikedStoreIds.has(numericId) || s.liked,
      }
    })

    const totalElements = filtered.length
    const totalPages = Math.max(1, Math.ceil(totalElements / size))
    return HttpResponse.json({
      statusCode: '200',
      message: '가게 목록 조회 성공',
      data: {
        content,
        page,
        size,
        totalElements,
        totalPages,
        first: page === 0,
        last: page >= totalPages - 1,
        hasNext: page < totalPages - 1,
        hasPrevious: page > 0,
      },
    })
  }),

  // 가게 좋아요 토글 — 백엔드 POST /stores/likes 스펙 일치
  // 사용자 한 명 기준 in-memory 상태 시뮬레이션
  http.post(`${BASE}/stores/likes`, ({ request }) => {
    const url = new URL(request.url)
    const storeId = Number(url.searchParams.get('storeId')) || 0
    const wasLiked = mockLikedStoreIds.has(storeId)
    if (wasLiked) mockLikedStoreIds.delete(storeId)
    else mockLikedStoreIds.add(storeId)
    const liked = !wasLiked
    const base = mockLikeCountByStore.get(storeId) ?? 10
    const next = base + (liked ? 1 : -1)
    mockLikeCountByStore.set(storeId, next)
    return HttpResponse.json({
      statusCode: '200',
      message: liked ? '좋아요가 추가되었습니다.' : '좋아요가 취소되었습니다.',
      data: { storeId, userId: 1, liked, likeCount: next },
    })
  }),

  // 가게 상세 — 백엔드 GET /stores/{storeId} 스펙 일치 (ShopDetailResponse + ResponseDTO 래핑)
  // 1-based numericId → MOCK_SHOPS[id-1] 매핑 (목록 핸들러와 동일 규칙)
  http.get(`${BASE}/stores/:id`, ({ params }) => {
    const numericId = Number(params.id)
    const shop = !isNaN(numericId) && numericId > 0 ? MOCK_SHOPS[numericId - 1] : undefined
    if (!shop) return new HttpResponse(null, { status: 404 })

    const address = shop.infoRows.find((r) => r.label === '주소')?.value ?? ''
    const phoneNumber = shop.infoRows.find((r) => r.label === '전화')?.value ?? ''
    const detail = {
      id: numericId,
      name: shop.name,
      category: shop.category,
      imageUrl: shop.image,
      likedByCurrentUser: shop.liked,
      description: shop.description ?? '',
      address,
      phoneNumber,
      openTime: '10:00',
      closeTime: '22:00',
      images: shop.images,
      menuCategories: shop.menuCategories,
      menus: shop.menus.map((m, i) => ({ id: i + 1, name: m.name, price: m.price })),
      participantCurrent: shop.participantCurrent ?? 0,
      participantTotal: shop.participantTotal ?? 0,
      status: shop.status.toUpperCase(),
    }
    return HttpResponse.json({
      statusCode: '200',
      message: '가게 상세 조회 성공',
      data: detail,
    })
  }),

  // 행정동 자동완성 — 백엔드 GET /dongs/search 스펙 일치
  // 응답: ResponseDTO<{ items: [{ adminDongCode, name, fullAddress }] }>
  http.get(`${BASE}/dongs/search`, async ({ request }) => {
    const url = new URL(request.url)
    const q = (url.searchParams.get('q') ?? '').trim()
    const limit = Number(url.searchParams.get('limit') ?? '10')
    if (!q) {
      return HttpResponse.json({ statusCode: '200', message: '', data: { items: [] } })
    }
    const dongs = await getDongCache()
    // mock 행정동 이름에서 자치구 추측 — 'ADM_NM'/feature 데이터 의존이라 단순화: 이름만으로 fake gu
    // 정합도가 필요하면 백엔드 데이터로 갈음 (mock은 제한적)
    const allNames = [...dongs.keys()]
    const namePrefix = allNames.filter((n) => n.startsWith(q))
    const guPrefix: string[] = []
    const contains: string[] = []
    for (const n of allNames) {
      if (namePrefix.includes(n)) continue
      // mock 은 자치구 정보 없어 fullAddress = '서울 ?? 동이름'. q 가 동에 포함되면 contains 로
      if (n.includes(q)) contains.push(n)
    }
    const names = [...namePrefix, ...guPrefix, ...contains].slice(0, limit)
    const items = names.map((name, i) => ({
      adminDongCode: `mock-${i.toString().padStart(10, '0')}`,
      name,
      guName: '서대문구', // mock 한정 — 실 백엔드는 정확한 자치구 반환
      fullAddress: `서울 서대문구 ${name}`,
    }))
    return HttpResponse.json({
      statusCode: '200',
      message: '행정동 자동완성 결과',
      data: { items },
    })
  }),

  // 추천 결과 — destination 있으면 hash 기반 reorder + score 조정 (mock 시뮬레이션)
  // 추가: 결과 동네에 해당하는 행정동 폴리곤 geometry/center를 inline 동봉 (서버 책임 시뮬)
  http.get(`${BASE}/neighborhoods/results`, async ({ request }) => {
    const url = new URL(request.url)
    const lifestyleId = url.searchParams.get('lifestyleId') ?? 'efficient'
    const destination = url.searchParams.get('destination') ?? ''

    let items = [...MOCK_RESULTS]
    if (destination) {
      const hash = [...destination].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7)
      let seed = hash
      const rand = () => {
        seed = (seed * 1103515245 + 12345) >>> 0
        return seed / 0xffffffff
      }
      for (let i = items.length - 1; i > 0; i--) {
        const j = Math.floor(rand() * (i + 1))
        ;[items[i], items[j]] = [items[j], items[i]]
      }
      items = items.map((item, idx) =>
        idx < 3 ? { ...item, score: Math.min(100, item.score + (3 - idx) * 2) } : item,
      )
    }

    // 행정동 GeoJSON 매칭 — geometry/center inline 부착 (실패해도 results는 항상 반환)
    let enriched = items
    try {
      const dongs = await getDongCache()
      if (dongs.size > 0) {
        enriched = items.map((r) => {
          const f = findDongFeature(dongs, r.dong)
          return f ? { ...r, geometry: f.paths, center: f.center } : r
        })
      }
    } catch (e) {
      console.error('[mock] geometry attach 실패:', e)
    }

    return HttpResponse.json({
      items: enriched,
      total: enriched.length,
      lifestyleId,
    })
  }),

  // 분석 (요청 → analysisId 응답)
  http.post(`${BASE}/neighborhoods/analyze`, async () => {
    // 실 분석 대신 가장 첫 라이프스타일 반환
    return HttpResponse.json({
      analysisId: `demo-${Date.now()}`,
      lifestyleId: LIFESTYLE_TYPES[0]?.id ?? 'efficient',
    })
  }),

  // 취향 질문 Q1~Q10
  http.get(`${BASE}/preferences/questions`, () => {
    return HttpResponse.json({
      items: PREFERENCE_QUESTIONS.map((q) => ({
        id: q.id,
        question: q.question,
        subtitle: q.subtitle ?? null,
        left: q.left,
        right: q.right,
      })),
    })
  }),
]
