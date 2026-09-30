import type { MouseEvent } from 'react'
import { Heart } from '@/components/ui/Heart'
import { ResultCardAddress, type ResultCardAddressProps } from './ResultCardAddress'

// Figma 1:1: Tile · ResultCardHeader (431:847) > ResultCardHeader COMPONENT
// flex items-center justify-between w-[345px]
// Address (V gap-xxs) + Heart 24x24
export interface ResultCardHeaderProps extends ResultCardAddressProps {
  liked: boolean
  onToggleLike?: () => void
}

export function ResultCardHeader({ liked, onToggleLike, ...address }: ResultCardHeaderProps) {
  const handleHeartClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    onToggleLike?.()
  }

  return (
    <div className="flex items-center justify-between gap-0 overflow-clip">
      <ResultCardAddress {...address} />
      <Heart active={liked} onClick={handleHeartClick} />
    </div>
  )
}
