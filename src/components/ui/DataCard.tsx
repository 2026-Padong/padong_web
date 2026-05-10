import { cva } from 'class-variance-authority'
import { cn } from '@/lib/cn'

// Figma 1:1: Tile · DataCard (925:3151) > DataCard COMPONENT_SET (4 variants)
// w-[180px] h-[96px] flex gap-md p-md rounded-lg border border-border-default bg-neutral-white
// IconWrap: size-[48px] rounded-lg (variant별 bg) + emoji 24px
// Content: label 11px Medium tertiary + value 18px Bold brand-primary + sub 12px Regular secondary
const iconBgVariants = cva(
  'flex size-[48px] shrink-0 items-center justify-center overflow-clip rounded-lg',
  {
    variants: {
      type: {
        Weather: 'bg-[#fff3df]',
        Temp: 'bg-[#ffe5ce]',
        Dust: 'bg-[#e3e6eb]',
        Rain: 'bg-[#dcecff]',
      },
    },
  },
)

const EMOJI: Record<DataCardProps['type'], string> = {
  Weather: '☀️',
  Temp: '🌡️',
  Dust: '🌫️',
  Rain: '☔',
}

export interface DataCardProps {
  type: 'Weather' | 'Temp' | 'Dust' | 'Rain'
  label: string
  value: string
  /** 작은 보조 텍스트 */
  sub?: string
  className?: string
}

export function DataCard({ type, label, value, sub, className }: DataCardProps) {
  return (
    <div
      className={cn(
        'flex h-[96px] w-[180px] items-center gap-md rounded-lg border border-border-default bg-neutral-white p-md',
        className,
      )}
    >
      <div className={iconBgVariants({ type })}>
        <span
          className="text-[24px] leading-none"
          style={{
            fontFamily:
              '"Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji", sans-serif',
          }}
        >
          {EMOJI[type]}
        </span>
      </div>
      <div className="flex flex-col gap-xxs overflow-clip whitespace-nowrap">
        <span className="text-body-s font-medium text-text-tertiary">{label}</span>
        <span className="text-h4 font-bold text-brand-primary">{value}</span>
        {sub && <span className="text-[12px] font-normal text-text-secondary">{sub}</span>}
      </div>
    </div>
  )
}
