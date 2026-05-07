import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/cn'

const pillVariants = cva(
  'inline-flex items-center gap-xxs rounded-full px-2.5 py-xxs text-caption font-normal',
  {
    variants: {
      tone: {
        positive: 'bg-[#d4f4de] text-[#1b9e5a]',
        neutral: 'bg-[#e5e8ee] text-[#525a6b]',
        warning: 'bg-[#fff3ce] text-[#d79e0f]',
        critical: 'bg-[#fde2e2] text-[#c72e2e]',
      },
    },
  },
)

type Tone = NonNullable<VariantProps<typeof pillVariants>['tone']>

export type StatusPillType = 'congest' | 'road' | 'commercial'
export type StatusPillLevel =
  | '여유'
  | '보통'
  | '약간 붐빔'
  | '붐빔'
  | '원활'
  | '서행'
  | '지체'
  | '정체'
  | '한산한'
  | '바쁜'
  | '매우 바쁜'

const TONE: Record<string, Tone> = {
  // congest
  'congest:여유': 'positive',
  'congest:보통': 'neutral',
  'congest:약간 붐빔': 'warning',
  'congest:붐빔': 'critical',
  // road
  'road:원활': 'positive',
  'road:서행': 'warning',
  'road:지체': 'warning',
  'road:정체': 'critical',
  // commercial
  'commercial:한산한': 'warning',
  'commercial:보통': 'neutral',
  'commercial:바쁜': 'positive',
  'commercial:매우 바쁜': 'positive',
}

const TYPE_LABEL: Record<StatusPillType, string> = {
  congest: '혼잡도',
  road: '도로',
  commercial: '상권',
}

export interface StatusPillProps {
  type: StatusPillType
  level: StatusPillLevel
  className?: string
}

export function StatusPill({ type, level, className }: StatusPillProps) {
  const tone = TONE[`${type}:${level}`] ?? 'neutral'
  return (
    <span className={cn(pillVariants({ tone }), className)}>
      {TYPE_LABEL[type]} {level}
    </span>
  )
}
