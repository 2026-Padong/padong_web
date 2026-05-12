import type { RecruitmentStatus } from '@/api/contracts/shops'

// 사용자 측 가게 모집 상태 배지 — 5종 (RECRUITING/CLOSING_SOON/IN_PROGRESS/NO_FLOW/OUT_OF_HOURS)
// 사장 측 FlowStatusBadge (6종) 와는 별도 도메인.
const VARIANTS: Record<
  RecruitmentStatus,
  { label: string; bg: string; fg: string; dot: string }
> = {
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
  OUT_OF_HOURS: {
    label: '영업 종료',
    bg: 'bg-status-closed-bg', fg: 'text-status-closed', dot: 'bg-status-closed',
  },
}

export interface RecruitmentBadgeProps {
  status: RecruitmentStatus
}

export function RecruitmentBadge({ status }: RecruitmentBadgeProps) {
  const v = VARIANTS[status] ?? VARIANTS.NO_FLOW
  return (
    <span className={`inline-flex items-center gap-xxs rounded-full px-xs py-xxs ${v.bg}`}>
      <span className={`size-[6px] rounded-full ${v.dot}`} />
      <span className={`text-body-s font-medium ${v.fg}`}>{v.label}</span>
    </span>
  )
}
