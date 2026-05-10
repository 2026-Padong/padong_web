import { cva } from 'class-variance-authority'
import { Icon, type IconName } from '@/components/ui/Icon'

// Figma 1:1: Tile · HomeHeroCTA (898:3120) > HomeHeroCta COMPONENT_SET (Primary/Secondary)
// h-[41px] flex gap-xxs items-center justify-center px-lg py-sm rounded-[24px]
// Phase 9 interaction: hover 색 어두워짐, active scale-[0.98], focus-visible outline
const variants = cva(
  [
    'inline-flex h-[41px] items-center justify-center gap-xxs rounded-[24px] px-lg py-sm whitespace-nowrap',
    'cursor-pointer select-none',
    'transition-[background-color,transform] duration-[var(--duration-fast)] ease-[var(--ease-out)]',
    'active:scale-[0.98]',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary',
  ].join(' '),
  {
    variants: {
      type: {
        Primary: 'bg-brand-primary hover:bg-brand-primary-hover',
        Secondary: 'bg-brand-primary-soft hover:bg-brand-primary',
      },
    },
    defaultVariants: { type: 'Primary' },
  },
)

const ICON: Record<'Primary' | 'Secondary', IconName> = {
  Primary: 'home-hero-cta-bag',
  Secondary: 'home-hero-cta-heart',
}

const LABEL = {
  Primary: '직장으로 추천 받기',
  Secondary: '내 취향으로 찾기',
}

export interface HomeHeroCTAProps {
  type?: 'Primary' | 'Secondary'
  /** 라벨 override */
  label?: string
  onClick?: () => void
  className?: string
}

export function HomeHeroCTA({ type = 'Primary', label, onClick, className }: HomeHeroCTAProps) {
  return (
    <button type="button" onClick={onClick} className={`${variants({ type })} ${className ?? ''}`}>
      <Icon name={ICON[type]} aria-hidden />
      <span className="text-body font-medium text-neutral-white">{label ?? LABEL[type]}</span>
    </button>
  )
}
