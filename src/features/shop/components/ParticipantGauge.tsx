import { Users } from 'lucide-react'

// Figma 1:1: Tile · ParticipantGauge (598:1644) > ParticipantGauge COMPONENT
// inline-flex items-center gap-xs, Users icon + "current / total"
export interface ParticipantGaugeProps {
  current: number
  total: number
}

export function ParticipantGauge({ current, total }: ParticipantGaugeProps) {
  return (
    <div className="inline-flex items-center gap-xs">
      <Users size={20} className="text-brand-primary" />
      <span className="text-body-l font-bold text-brand-primary">
        {current} / {total}
      </span>
    </div>
  )
}
