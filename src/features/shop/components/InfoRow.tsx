import type { ReactNode } from 'react'

// Figma 1:1: Tile · InfoRow (1663:4670) > InfoRow COMPONENT
// 290x26 H items-center gap-sm, label 14px Bold brand-primary-hover (w-20) + value
export interface InfoRowProps {
  label: string
  value: ReactNode
  icon?: ReactNode
  /** value 가 다중 행/리스트일 때 label 을 상단 정렬 */
  alignStart?: boolean
}

export function InfoRow({ label, value, icon, alignStart }: InfoRowProps) {
  return (
    <div className={`flex gap-sm ${alignStart ? 'items-start' : 'items-center'}`}>
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span
        className={`w-20 shrink-0 text-body-l font-bold text-brand-primary-hover ${alignStart ? 'pt-xxs' : ''}`}
      >
        {label}
      </span>
      <div className="flex-1 text-body-l text-text-secondary">{value}</div>
    </div>
  )
}
