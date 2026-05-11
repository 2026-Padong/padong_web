// 가게 모집 상태 뱃지 — ShopCard, ShopDetailPanel 등에서 공유
// 일반 StatusBadge (positive/neutral/warning/critical) 와 분리:
//   - 도메인 의미가 다름 (가게 공구 모집 단계 전용)
//   - dot + label 시각 형식 다름
export type ShopStatus = 'recruiting' | 'closing' | 'closed'

const VARIANTS = {
  recruiting: {
    label: '모집중',
    bg: 'bg-status-recruiting-bg',
    fg: 'text-status-recruiting',
    dot: 'bg-status-recruiting',
  },
  closing: {
    label: '마감임박',
    bg: 'bg-status-closing-bg',
    fg: 'text-status-closing',
    dot: 'bg-status-closing',
  },
  closed: {
    label: '마감',
    bg: 'bg-status-closed-bg',
    fg: 'text-status-closed',
    dot: 'bg-status-closed',
  },
} as const

export interface ShopStatusBadgeProps {
  status: ShopStatus
}

export function ShopStatusBadge({ status }: ShopStatusBadgeProps) {
  const v = VARIANTS[status]
  return (
    <span className={`inline-flex items-center gap-xxs rounded-full px-xs py-xxs ${v.bg}`}>
      <span className={`size-[6px] rounded-full ${v.dot}`} />
      <span className={`text-body-s font-medium ${v.fg}`}>{v.label}</span>
    </span>
  )
}
