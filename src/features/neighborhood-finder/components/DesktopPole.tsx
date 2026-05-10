import { cn } from '@/lib/cn'

// Figma 1:1: Tile · DesktopPole (1490:4164) > DesktopPole COMPONENT_SET (Left/Right)
// w-[536px] flex gap-md items-center
// Left: emoji 36px + TextCol (V gap-xs items-start) → 22px Bold text-text-primary + 16px Regular text-text-tertiary
// Right: TextCol(text-right) + emoji 36px (justify-end)
export interface DesktopPoleProps {
  side: 'left' | 'right'
  emoji: string
  title: string
  description: string
}

export function DesktopPole({ side, emoji, title, description }: DesktopPoleProps) {
  const isRight = side === 'right'
  return (
    <div className={cn('flex flex-1 items-center gap-md', isRight && 'justify-end')}>
      {!isRight && <span className="text-[36px] leading-none not-italic">{emoji}</span>}
      <div
        className={cn('flex flex-col items-start gap-xs overflow-clip', isRight && 'text-right')}
      >
        <p className="text-h3 font-bold text-text-primary">{title}</p>
        <p className="text-subhead font-normal text-text-tertiary">{description}</p>
      </div>
      {isRight && <span className="text-[36px] leading-none not-italic">{emoji}</span>}
    </div>
  )
}
