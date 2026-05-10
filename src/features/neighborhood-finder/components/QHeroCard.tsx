import { cn } from '@/lib/cn'
import { DesktopLikertScale } from './DesktopLikertScale'
import { PolesRow, type PolesRowProps } from './PolesRow'
import { QuestionHero } from './QuestionHero'

// Figma 1:1: Tile · Q1-HeroCard (1491:4158) > Q1HeroCard COMPONENT_SET (Active/Disabled)
// w-[1160px] bg-[rgba(255,255,255,0.92)] border border-[rgba(224,232,246,0.95)]
// rounded-[22px] flex flex-col gap-xl items-center pb-7 pt-xl px-12 overflow-clip
// shadow-[0px_18px_45px_0px_rgba(45,78,130,0.14)]
// Disabled: opacity-45
// QuestionHero + Divider (h-px bg-[#e4eaf5]) + PolesRow + DesktopLikertScale
export interface QHeroCardProps extends PolesRowProps {
  state?: 'active' | 'disabled'
  number: number
  question: string
  selected?: 1 | 2 | 3 | 4 | 5
  onSelect?: (v: 1 | 2 | 3 | 4 | 5) => void
}

export function QHeroCard({
  state = 'active',
  number,
  question,
  left,
  right,
  selected,
  onSelect,
}: QHeroCardProps) {
  return (
    <section
      className={cn(
        'flex w-full max-w-[1160px] flex-col items-center gap-xl overflow-clip rounded-[22px] border border-[#e0e8f6]/95 bg-white/92 px-md pt-xl pb-7 shadow-[0px_18px_45px_0px_rgba(45,78,130,0.14)] md:px-12',
        state === 'disabled' && 'opacity-45',
      )}
    >
      <QuestionHero number={number} question={question} />
      <div className="h-px w-full bg-[#e4eaf5]" />
      <PolesRow left={left} right={right} />
      <DesktopLikertScale selected={selected} onSelect={onSelect} />
    </section>
  )
}
