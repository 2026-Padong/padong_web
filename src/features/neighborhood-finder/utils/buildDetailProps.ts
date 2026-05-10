import type { ResultDto } from '@/api/contracts/results'

// 결과 카드 1개 → DetailPanel 표시용 풀 데이터로 변환 (mock — 일부는 tags 파싱, 일부는 sample)
// JobFinder, PreferenceResult 등 동네 결과 페이지들이 공통 사용
export function buildDetailProps(r: ResultDto) {
  const safetyGrade = (r.tags[0]?.match(/[A-E]/) ?? ['A'])[0]
  const commute = r.tags[1] ?? '35분'
  const rentTag = r.tags[2] ?? '월세 500/45'
  const flow = r.tags[3]?.replace(/[^0-9,]/g, '') || '8,920'
  // hash-based 변주 (id 기반 결정적 점수)
  const hash = [...r.id].reduce((a, c) => a + c.charCodeAt(0), 0)
  const grade = (offset: number) => ['A', 'A', 'B', 'B', 'C'][(hash + offset) % 5]
  return {
    score: r.score,
    dong: r.dong,
    fullAddress: r.fullAddress,
    rows: [
      [
        { label: '출퇴근', value: commute },
        { label: '안전등급', value: safetyGrade },
      ],
      [
        { label: '인구밀도', value: '12,340' },
        { label: '유동인구', value: flow },
      ],
    ],
    badges: [
      { category: '생활', grade: grade(0) },
      { category: '교통', grade: grade(1) },
      { category: '화재', grade: grade(2) },
      { category: '범죄', grade: grade(3) },
    ],
    rents: [
      { iconType: 'Dandok' as const, title: '단독/다가구', meta: '월세 200/30 · 전세 8,000 만원 · 매매 18,000 만원' },
      { iconType: 'Yeonlip' as const, title: '연립/다세대', meta: '월세 250/32 · 전세 9,500 만원 · 매매 22,000 만원' },
      { iconType: 'Apart' as const, title: '아파트', meta: `${rentTag} · 전세 18,000 만원 · 매매 45,000 만원` },
      { iconType: 'Opistel' as const, title: '오피스텔', meta: '월세 300/38 · 전세 12,000 만원 · 매매 28,000 만원' },
    ],
    cells: [
      { type: 'transit' as const, value: commute },
      { type: 'car' as const, value: `${(parseInt(commute) * 0.7).toFixed(1)}분` },
      { type: 'walk' as const, value: `${(parseInt(commute) * 4).toFixed(1)}분` },
    ],
  }
}
