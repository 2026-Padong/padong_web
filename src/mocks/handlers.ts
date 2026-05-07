import { http, HttpResponse } from 'msw'
import { MOCK_SHOPS, MOCK_RESULTS, LIFESTYLE_TYPES } from '@/data/mocks'
import { PREFERENCE_QUESTIONS } from '@/features/neighborhood-finder/data/preferenceQuestions'

const BASE = '/api'

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

  // 추천 결과
  http.get(`${BASE}/neighborhoods/results`, ({ request }) => {
    const url = new URL(request.url)
    const lifestyleId = url.searchParams.get('lifestyleId') ?? 'efficient'
    return HttpResponse.json({
      items: MOCK_RESULTS,
      total: MOCK_RESULTS.length,
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
