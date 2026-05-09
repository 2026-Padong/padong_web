import { cva } from 'class-variance-authority'
import { Icon, type IconName } from '@/components/ui/Icon'

// Figma 1:1: Tile · HomeHeroCTA (898:3120) > HomeHeroCta COMPONENT_SET (Primary/Secondary)
// h-[41px] w-[154.688px] flex gap-[5px] items-center justify-center px-[20px] py-[10px] rounded-[24px]
// Primary: bg-brand-primary, ShoppingBag icon (20×15 — Figma `imgShoppingBag`) + "직장으로 추천 받기"
// Secondary: bg-brand-primary-soft, Heart icon (19.333×11.889 — Figma `imgHeart`) + "내 취향으로 찾기"
// Text: 11px Medium text-neutral-white
const variants = cva(
  'inline-flex h-[41px] items-center justify-center gap-[5px] rounded-[24px] px-[20px] py-[10px] whitespace-nowrap transition-colors',
  {
    variants: {
      type: {
        Primary: 'bg-brand-primary',
        Secondary: 'bg-brand-primary-soft',
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
      <span className="text-body-s font-medium text-neutral-white">{label ?? LABEL[type]}</span>
    </button>
  )
}
