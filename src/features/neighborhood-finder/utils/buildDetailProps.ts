import type { ResultDto } from '@/api/contracts/results'
import type { DongDetailResponse, RentBuildingTypeEntry } from '@/api/dongDetail'
import type { RentRowProps } from '@/features/neighborhood-finder/components/RentRow'

// 결과 카드 1개 → DetailPanel 표시용 데이터 변환
// 백엔드 /dongne/detail 응답이 있으면 그것 우선, 없으면 기존 mock fallback (mobility 기반 score 등)

const fmtMin = (m: number | null | undefined) =>
  m == null ? '-' : `${Math.round(m)}분`

// 값은 이미 만원 단위 (스웨거: "단위는 만원")
const fmt만원 = (n: number | null | undefined) => {
  if (n == null) return '-'
  if (n >= 10000) {
    const eok = Math.floor(n / 10000)
    const man = Math.round(n - eok * 10000)
    return man > 0 ? `${eok}억 ${man.toLocaleString('ko-KR')}만원` : `${eok}억`
  }
  return `${n.toLocaleString('ko-KR')}만원`
}

const fmtPopulation = (n: number | null | undefined) =>
  n == null ? '-' : n.toLocaleString('ko-KR')

const BUILDING_ICON: Record<string, RentRowProps['iconType']> = {
  DETACHED_MULTIFAMILY: 'Dandok',
  ROW_MULTIFAMILY: 'Yeonlip',
  APARTMENT: 'Apart',
  OFFICETEL: 'Opistel',
}

function rentMeta(e: RentBuildingTypeEntry): string {
  // 두 줄로 표기: 1줄 월세, 2줄 전세·매매
  const line1: string[] = []
  if (e.monthlyRent.deposit != null || e.monthlyRent.monthlyRent != null) {
    const dep = fmt만원(e.monthlyRent.deposit)
    const rent = fmt만원(e.monthlyRent.monthlyRent)
    line1.push(`월세 ${dep}/${rent}`)
  }
  const line2: string[] = []
  if (e.jeonse.amount != null) line2.push(`전세 ${fmt만원(e.jeonse.amount)}`)
  if (e.sale.amount != null) line2.push(`매매 ${fmt만원(e.sale.amount)}`)
  const out = [line1.join(''), line2.join(' · ')].filter(Boolean).join('\n')
  return out || '정보 없음'
}

// 백엔드 상세 응답으로 DetailPanel props 생성
export function buildDetailPropsFromApi(
  result: ResultDto,
  detail: DongDetailResponse,
) {
  const m = detail.mobility
  const commute = fmtMin(m?.avgTime)
  const rentsFromApi: RentRowProps[] = (detail.rentPrice?.buildingTypes ?? []).map((e) => ({
    iconType: BUILDING_ICON[e.buildingType.buildingTypeCode] ?? 'Apart',
    title: e.buildingType.buildingTypeLabel,
    meta: rentMeta(e),
  }))
  const safety = detail.safety
  return {
    score: result.score,
    dong: detail.departureDong.adminDongName,
    fullAddress: detail.departureDong.address,
    rows: [
      [
        { label: '출퇴근', value: commute },
        { label: '안전등급', value: safety?.overallScore ?? '-' },
      ],
      [
        { label: '인구밀도', value: fmtPopulation(detail.density) },
        { label: '총 인구', value: fmtPopulation(detail.totalPopulation) },
      ],
    ],
    // 백엔드 SafetyIndexResponse 의 4 카테고리 직접 매핑
    badges: [
      { category: '생활', grade: safety?.lifeSafetyGrade ?? '-' },
      { category: '교통', grade: safety?.trafficAccidentGrade ?? '-' },
      { category: '화재', grade: safety?.fireGrade ?? '-' },
      { category: '범죄', grade: safety?.crimeGrade ?? '-' },
    ],
    rents: rentsFromApi.length > 0 ? rentsFromApi : defaultRents(),
    cells: [
      {
        type: 'transit' as const,
        value: fmtMin(detail.paths?.transit?.totalTime),
      },
      {
        type: 'car' as const,
        value: fmtMin(detail.paths?.car?.totalTime),
      },
      {
        type: 'walk' as const,
        value: fmtMin(detail.paths?.pedestrian?.totalTime),
      },
    ],
  }
}

function defaultRents(): RentRowProps[] {
  return [
    { iconType: 'Dandok', title: '단독다가구', meta: '정보 없음' },
    { iconType: 'Yeonlip', title: '연립다세대', meta: '정보 없음' },
    { iconType: 'Apart', title: '아파트', meta: '정보 없음' },
    { iconType: 'Opistel', title: '오피스텔', meta: '정보 없음' },
  ]
}

// 상세 응답 도착 전 로딩 fallback — 결과 카드 데이터만 사용
export function buildDetailProps(r: ResultDto) {
  const commute = r.tags.find((t) => t.includes('분')) ?? '-'
  return {
    score: r.score,
    dong: r.dong,
    fullAddress: r.fullAddress,
    rows: [
      [
        { label: '출퇴근', value: commute },
        { label: '안전등급', value: '-' },
      ],
      [
        { label: '인구밀도', value: '-' },
        { label: '총 인구', value: '-' },
      ],
    ],
    badges: [
      { category: '생활', grade: '-' },
      { category: '교통', grade: '-' },
      { category: '화재', grade: '-' },
      { category: '범죄', grade: '-' },
    ],
    rents: defaultRents(),
    cells: [
      { type: 'transit' as const, value: commute },
      { type: 'car' as const, value: '-' },
      { type: 'walk' as const, value: '-' },
    ],
  }
}
