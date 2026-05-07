import type { CSSProperties, MouseEventHandler } from 'react'
import HeartDefault from '@/assets/icons/heart-default.svg?react'
import HeartActive from '@/assets/icons/heart-active.svg?react'

// Figma 1:1: Tile · Heart (852:3087) > Heart COMPONENT_SET (Default/Active)
// 24×24 wrapper, 내부 HeartShape: 13×12 absolute(left-[5.5px], top-[6px])
// SVG color는 var(--fill-0/--stroke-0) — brand-primary로 override
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
  return (
    <Wrapper
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      style={{ ...HEART_STYLE, width: size, height: size }}
      className={`relative inline-block ${onClick ? 'cursor-pointer' : ''} ${className ?? ''}`}
      aria-label={onClick ? (active ? '좋아요 해제' : '좋아요') : undefined}
      aria-pressed={onClick ? active : undefined}
    >
      <SvgComponent
        className="absolute"
        style={{ left: '5.5px', top: '6px', width: '13px', height: '12px' }}
        aria-hidden
      />
    </Wrapper>
  )
}
