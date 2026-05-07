import type { MouseEvent } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { Chip } from './Chip'
import { Heart } from './Heart'

const variants = cva(
  'flex flex-col gap-xs rounded-md border border-border-default px-md py-xs transition-colors cursor-pointer',
  {
    variants: {
      state: {
        default: 'bg-transparent',
        selected: 'bg-brand-primary-tint',
      },
    },
    defaultVariants: { state: 'default' },
  },
)

export interface ResultCardProps extends VariantProps<typeof variants> {
  id?: string
  dong: string
  fullAddress: string
  liked: boolean
  tags: string[]
  onToggleLike?: () => void
  onClick?: () => void
}

export function ResultCard({
  state,
  dong,
  fullAddress,
  liked,
  tags,
  onToggleLike,
  onClick,
}: ResultCardProps) {
  const handleHeartClick = (e: MouseEvent<SVGSVGElement>) => {
    e.stopPropagation()
    onToggleLike?.()
  }

  return (
    <article onClick={onClick} className={variants({ state })}>
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-xxs">
          <span className="text-subhead font-bold text-text-secondary">{dong}</span>
          <span className="text-body-s text-text-tertiary">{fullAddress}</span>
        </div>
        <Heart active={liked} onClick={handleHeartClick} />
      </div>
      <div className="flex flex-wrap gap-xs">
        {tags.map((t) => (
          <Chip key={t} state="active">
            {t}
          </Chip>
        ))}
      </div>
    </article>
  )
}
