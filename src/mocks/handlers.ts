import { http, HttpResponse } from 'msw'
import { MOCK_SHOPS, MOCK_RESULTS, LIFESTYLE_TYPES } from '@/data/mocks'
import { PREFERENCE_QUESTIONS } from '@/features/neighborhood-finder/data/preferenceQuestions'
import type { LatLng } from '@/api/contracts/results'

const BASE = '/api'

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

export const handlers = [
  // 가게 목록
  http.get(`${BASE}/shops`, ({ request }) => {
    const url = new URL(request.url)
    const q = url.searchParams.get('q')?.toLowerCase() ?? ''
    const filtered = q
      ? MOCK_SHOPS.filter(
          (s) =>
            s.name.toLowerCase().includes(q) ||
            s.category.toLowerCase().includes(q) ||
            (s.description?.toLowerCase().includes(q) ?? false),
        )
      : MOCK_SHOPS
    // 목록 응답에서 상세 필드 제거
    const items = filtered.map((s) => ({
      id: s.id,
      image: s.image,
      name: s.name,
      category: s.category,
      description: s.description ?? null,
      status: s.status,
      participantCurrent: s.participantCurrent ?? 0,
      participantTotal: s.participantTotal ?? 0,
      liked: s.liked,
    }))
    return HttpResponse.json({ items, total: filtered.length })
  }),

  // 가게 상세
  http.get(`${BASE}/shops/:id`, ({ params }) => {
    const shop = MOCK_SHOPS.find((s) => s.id === params.id)
    if (!shop) return new HttpResponse(null, { status: 404 })
    return HttpResponse.json(shop)
  }),

  // 행정동 자동완성 — q에 매칭되는 행정동 이름 top N 반환
  http.get(`${BASE}/dongs/search`, async ({ request }) => {
    const url = new URL(request.url)
    const q = (url.searchParams.get('q') ?? '').trim()
    if (!q) return HttpResponse.json({ items: [] })
    const dongs = await getDongCache()
    // prefix 우선, 그 다음 contains
    const prefixHits: string[] = []
    const containsHits: string[] = []
    for (const name of dongs.keys()) {
      if (name.startsWith(q)) prefixHits.push(name)
      else if (name.includes(q)) containsHits.push(name)
    }
    const items = [...prefixHits, ...containsHits].slice(0, 10)
    return HttpResponse.json({ items })
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
