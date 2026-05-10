import { cn } from '@/lib/cn'
import dotActive from '@/assets/stepcard-dot-active.png'
import dotInactive from '@/assets/stepcard-dot-inactive.png'

// Figma 1:1: Tile · StepCard (1511:4247) > StepCard COMPONENT (Active/Inactive)
// w-[240px] V flex gap-sm items-start px-lg py-lg rounded-2xl
// border border-border-default + drop-shadow-[0px_8px_9px_rgba(45,78,130,0.05)]
// TopRow: gap-sm items-center → Dot 10x10 (active/inactive image) + title 16px Bold
// Description: 13px Regular text-text-tertiary
export interface StepCardProps {
  active?: boolean
  title: string
  description: string
}

export function StepCard({ active = true, title, description }: StepCardProps) {
  return (
    <div className="flex w-[240px] flex-col items-start gap-sm rounded-2xl border border-border-default px-lg py-lg drop-shadow-[0px_8px_9px_rgba(45,78,130,0.05)]">
      <div className="flex w-full items-center gap-sm">
        <img src={active ? dotActive : dotInactive} alt="" className="size-[10px] flex-shrink-0" />
        <span
          className={cn(
            'text-subhead font-bold whitespace-nowrap',
            active ? 'text-text-primary' : 'text-text-tertiary',
          )}
        >
          {title}
        </span>
      </div>
      <p className="w-full text-body font-normal text-text-tertiary">{description}</p>
    </div>
  )
}
