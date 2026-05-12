import type { ResultDto } from '@/api/contracts/results'
import { boundaryToPaths, centerOfBoundary, type MobilityResponse } from '@/api/mobility'

// 백엔드 MobilityResponse → ResultDto 매핑
// downstream: ResultListPanelExpanded / DetailPanel / KakaoMap
//
// 카드 chip 은 4종 (스웨거 정의 기준 — 일부는 백엔드 적재 대기):
//   안전 X / 통근 N분 / 유동 N / [거래유형] N만원
// 백엔드가 해당 필드 안 주면 자동으로 건너뜀.

const fmtMin = (n: number) => `${Math.round(n)}분`

const fmt만원 = (n: number) => {
  if (n >= 10000) {
    const eok = Math.floor(n / 10000)
    const man = Math.round(n - eok * 10000)
    return man > 0 ? `${eok}억 ${man.toLocaleString('ko-KR')}만` : `${eok}억`
  }
  return `${n.toLocaleString('ko-KR')}만원`
}

const fmtCount = (n: number) => {
  if (n >= 10000) return `${(n / 10000).toFixed(1)}만`
  if (n >= 1000) return `${(n / 1000).toFixed(1)}천`
  return `${Math.round(n)}`
}

export function mobilityToResultDto(m: MobilityResponse): ResultDto {
  const props = m.boundary?.properties
  const name = props?.name ?? m.departureDong.address ?? '-'
  const guName = props?.guName ?? ''
  const fullAddress = m.departureDong.address ?? (guName ? `서울특별시 ${guName} ${name}` : name)
  const tags: string[] = []
  if (m.safetyGrade) {
    tags.push(`안전 ${m.safetyGrade}`)
  }
  if (typeof m.avgTime === 'number' && !Number.isNaN(m.avgTime)) {
    tags.push(`통근 ${fmtMin(m.avgTime)}`)
  }
  if (typeof m.totalMobility === 'number') {
    tags.push(`유동 ${fmtCount(m.totalMobility)}`)
  }
  // 월세면 보증금/월세, 매매·전세면 amount
  const rp = m.rentPrice
  if (rp?.price) {
    const tradeLabel = rp.tradeType?.tradeTypeLabel ?? ''
    const { amount, monthlyRent, deposit } = rp.price
    if (monthlyRent != null) {
      tags.push(`${tradeLabel} ${fmt만원(monthlyRent)}`)
    } else if (amount != null) {
      tags.push(`${tradeLabel} ${fmt만원(amount)}`)
    } else if (deposit != null) {
      tags.push(`${tradeLabel} ${fmt만원(deposit)}`)
    }
  }
  return {
    id: m.departureDong.adminDongCode,
    image: '',
    dong: name,
    fullAddress,
    liked: m.likedByCurrentUser ?? false,
    tags,
    // ScoreBar 는 80% 중앙 고정으로 표시되므로 의미 있는 값 아님 — placeholder
    score: 0,
    geometry: boundaryToPaths(m.boundary),
    center: centerOfBoundary(m.boundary),
  }
}
