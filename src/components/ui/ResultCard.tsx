import type { MouseEvent } from 'react'
import { Chip } from './Chip'
import { Heart } from './Heart'
import { ScoreBar } from './ScoreBar'

// Figma 1:1: Tile · ResultCard (431:883) > ResultCard COMPONENT_SET (Default/Selected)
// V flex items-center justify-center px-md py-xs gap-xs rounded-md w-full
// Default: border-[1px] border-border-default (no bg)
// Selected: border-[1.5px] border-border-default bg-brand-primary-tint
// Header: H justify-between — Address (V gap-xxs) + Heart 24x24
// ScoreBar (default: empty/border, selected: filled with brand-primary)
// Tags: H gap-xs — Default chip = surface-subtle, Selected chip = brand-primary (active)
export interface ResultCardProps {
  state?: 'default' | 'selected'
  id?: string
  dong: string
  fullAddress: string
  liked: boolean
  tags: string[]
  /** 0~100 — Selected 시 ScoreBar fill 비율 */
  score?: number
  onToggleLike?: () => void
  onClick?: () => void
}

export function ResultCard({
  state = 'default',
  dong,
  fullAddress,
  liked,
  tags,
  score = 100,
  onToggleLike,
  onClick,
}: ResultCardProps) {
  const isSelected = state === 'selected'

  const handleHeartClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    onToggleLike?.()
  }

  return (
    <article
      onClick={onClick}
      className={
        isSelected
          ? 'flex w-full cursor-pointer flex-col items-center justify-center gap-xs rounded-md border-[1.5px] border-border-default bg-brand-primary-tint px-md py-xs'
          : 'flex w-full cursor-pointer flex-col items-center justify-center gap-xs rounded-md border border-border-default px-md py-xs'
      }
    >
      {/* Header */}
      <div className="flex w-full items-center justify-between">
        <div className="flex flex-col gap-xxs">
          <span className="text-subhead font-bold text-text-secondary">{dong}</span>
          <span className="text-body-s font-normal text-text-tertiary">{fullAddress}</span>
        </div>
        <Heart active={liked} onClick={handleHeartClick} />
      </div>

      {/* ScoreBar */}
      <ScoreBar value={isSelected ? score : undefined} className="w-full" />

      {/* Tags */}
      <div className="flex w-full gap-xs overflow-clip">
        {tags.map((t) => (
          <Chip key={t} state={isSelected ? 'active' : 'default'}>
            {t}
          </Chip>
        ))}
      </div>
    </article>
  )
}
