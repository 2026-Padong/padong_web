import { useEffect, useState } from 'react'
import { cn } from '@/lib/cn'

// Figma 1:1: Tile · ScoreBar (430:862) > ScoreBar COMPONENT
// h-[2px] w-[345px] bg-border-default rounded-sm overflow-clip
// Figma 자체는 빈 컨테이너지만, 사용처에서 fill을 위한 value prop 추가
// Phase 9 G4: mount 시 0% → value% 애니메이션 (slow=320ms ease-out)
export interface ScoreBarProps {
  /** 0~100 (없으면 빈 바 — Figma 원본은 빈 베이스만) */
  value?: number
  className?: string
}

export function ScoreBar({ value, className }: ScoreBarProps) {
  const pct = value === undefined ? 0 : Math.max(0, Math.min(100, value))
  const [renderedPct, setRenderedPct] = useState(0)

  useEffect(() => {
    // double rAF — 첫 paint는 0에서 시작 보장 후 transition
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => setRenderedPct(pct))
    })
    return () => cancelAnimationFrame(id)
  }, [pct])

  // 채워진 영역을 중앙 정렬 — 좌우로 (100-pct)/2% 여백
  const offset = (100 - renderedPct) / 2
  return (
    <div
      className={cn(
        'relative h-[2px] w-full overflow-clip rounded-sm bg-border-default',
        className,
      )}
    >
      {value !== undefined && (
        <div
          className="absolute top-0 h-full rounded-sm bg-brand-primary transition-[width,left] duration-[var(--duration-slow)] ease-[var(--ease-out)]"
          style={{ left: `${offset}%`, width: `${renderedPct}%` }}
        />
      )}
    </div>
  )
}
