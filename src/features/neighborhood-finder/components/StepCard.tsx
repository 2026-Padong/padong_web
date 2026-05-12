import { cn } from '@/lib/cn'

// Figma 1:1: Tile · StepCard (1511:4247) > StepCard COMPONENT (Active/Inactive)
// V flex gap-sm items-start px-lg py-lg rounded-md
// border border-border-default + drop-shadow-[0px_4px_24px_rgba(45,78,130,0.02)]
// TopRow: gap-sm items-center → Dot 10x10 (active=brand-primary, inactive=border-medium) + title 16px Bold
// Description: 13px Regular text-text-tertiary
export interface StepCardProps {
  active?: boolean
  title: string
  description: string
}

export function StepCard({ active = true, title, description }: StepCardProps) {
  return (
    <div className="flex w-full flex-col items-start gap-sm rounded-md border border-border-default px-lg py-lg drop-shadow-[0px_4px_24px_rgba(45,78,130,0.02)]">
      <div className="flex w-full items-center gap-sm">
        <div
          className={cn(
            'size-[10px] shrink-0 rounded-full',
            active
              ? 'bg-brand-primary ring-[5px] ring-brand-primary/15'
              : 'bg-border-medium',
          )}
        />
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
