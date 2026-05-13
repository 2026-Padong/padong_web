import type { RecruitmentStatus } from '@/api/contracts/shops'

// 사용자 측 가게 모집 상태 배지 — 5종 (RECRUITING/CLOSING_SOON/IN_PROGRESS/NO_FLOW/OUT_OF_HOURS)
// 사장 측 FlowStatusBadge (6종) 와는 별도 도메인.
// OUT_OF_HOURS 는 현재 시각이 새벽 4시 기준으로 분기:
//   00:00~03:59 → "영업 종료" (어제 영업 끝)
//   04:00~     → "영업 전"  (오늘 곧 오픈)
type Variant = { label: string; bg: string; fg: string; dot: string }

const VARIANTS: Record<Exclude<RecruitmentStatus, 'OUT_OF_HOURS'>, Variant> = {
  RECRUITING: {
    label: '모집중',
    bg: 'bg-status-recruiting-bg', fg: 'text-status-recruiting', dot: 'bg-status-recruiting',
  },
  CLOSING_SOON: {
    label: '마감 임박',
    bg: 'bg-status-critical-bg', fg: 'text-status-critical', dot: 'bg-status-critical',
  },
  IN_PROGRESS: {
    label: '진행 중',
    bg: 'bg-status-closing-bg', fg: 'text-status-closing', dot: 'bg-status-closing',
  },
  NO_FLOW: {
    label: '모임 없음',
    bg: 'bg-status-closed-bg', fg: 'text-status-closed', dot: 'bg-status-closed',
  },
}

const OUT_OF_HOURS_CLOSED: Variant = {
  label: '영업 종료',
  bg: 'bg-status-closed-bg', fg: 'text-status-closed', dot: 'bg-status-closed',
}
const OUT_OF_HOURS_BEFORE_OPEN: Variant = {
  label: '영업 전',
  bg: 'bg-status-closed-bg', fg: 'text-status-closed', dot: 'bg-status-closed',
}

function resolveVariant(status: RecruitmentStatus): Variant {
  if (status === 'OUT_OF_HOURS') {
    const hour = new Date().getHours()
    return hour < 4 ? OUT_OF_HOURS_CLOSED : OUT_OF_HOURS_BEFORE_OPEN
  }
  return VARIANTS[status] ?? VARIANTS.NO_FLOW
}

export interface RecruitmentBadgeProps {
  status: RecruitmentStatus
}

export function RecruitmentBadge({ status }: RecruitmentBadgeProps) {
  const v = resolveVariant(status)
  return (
    <span className={`inline-flex items-center gap-xxs rounded-full px-xs py-xxs ${v.bg}`}>
      <span className={`size-[6px] rounded-full ${v.dot}`} />
      <span className={`text-body-s font-medium ${v.fg}`}>{v.label}</span>
    </span>
  )
}
