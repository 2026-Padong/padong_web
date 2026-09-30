import { useRef, type CSSProperties, type MouseEventHandler } from 'react'
import HeartDefault from '@/assets/icons/heart-default.svg?react'
import HeartActive from '@/assets/icons/heart-active.svg?react'

// Figma 1:1: Tile · Heart (852:3087) > Heart COMPONENT_SET (Default/Active)
// 24×24 wrapper, 내부 HeartShape: 13×12 absolute(left-[5.5px], top-[6px])
// SVG color는 var(--fill-0/--stroke-0) — brand-primary로 override
// Phase 9 G3: 클릭 시 heart-pop keyframe (320ms ease-spring) — animation 재트리거 패턴
export interface HeartProps {
  active?: boolean
  size?: number
  className?: string
  onClick?: MouseEventHandler<HTMLButtonElement>
}

const HEART_STYLE: CSSProperties = {
  '--fill-0': '#2e58e4',
  '--stroke-0': '#2e58e4',
} as CSSProperties

export function Heart({ active = false, size = 24, className, onClick }: HeartProps) {
  const SvgComponent = active ? HeartActive : HeartDefault
  const Wrapper = onClick ? 'button' : 'span'
  const innerRef = useRef<SVGSVGElement>(null)

  const handleClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    // animation 재트리거: class 제거 → reflow → 재추가
    const node = innerRef.current
    if (node) {
      node.classList.remove('animate-heart-pop')
      void node.getBoundingClientRect()
      node.classList.add('animate-heart-pop')
    }
    onClick?.(e)
  }

  return (
    <Wrapper
      type={onClick ? 'button' : undefined}
      onClick={onClick ? handleClick : undefined}
      style={{ ...HEART_STYLE, width: size, height: size }}
      className={`relative inline-block transition-transform duration-[var(--duration-base)] ${onClick ? 'cursor-pointer hover:scale-110 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-1 rounded-full' : ''} ${className ?? ''}`}
      aria-label={onClick ? (active ? '좋아요 해제' : '좋아요') : undefined}
      aria-pressed={onClick ? active : undefined}
    >
      <SvgComponent
        ref={innerRef}
        className="absolute"
        style={{ left: '5.5px', top: '6px', width: '13px', height: '12px' }}
        aria-hidden
      />
    </Wrapper>
  )
}
