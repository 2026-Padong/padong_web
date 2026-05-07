import type { ReactNode } from 'react'

// Figma 1:1: Tile · InfoRow (1663:4670) > InfoRow COMPONENT
// 290x26 H items-center gap-sm, label 14px Bold brand-primary-hover (w-20) + value
export interface InfoRowProps {
  label: string
  value: ReactNode
  icon?: ReactNode
}

export function InfoRow({ label, value, icon }: InfoRowProps) {
  return (
    <div className="flex items-center gap-sm">
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span className="w-20 shrink-0 text-body-l font-bold text-brand-primary-hover">{label}</span>
      <div className="flex-1 text-body-l text-text-secondary">{value}</div>
    </div>
  )
}
