import { QBadge } from './QBadge'

// Figma 1:1: Tile · QuestionHero (1490:4158) > QuestionHero COMPONENT
// w-[1112px] flex flex-col gap-md items-center
// QBadge + TitleGroup (V gap-xs items-center overflow-clip):
//   - QuestionTitle (H gap-sm items-center): " (#3d70ef) + 본문 (#081d49) + " (#3d70ef) — 28px Bold
//   - TitleUnderline: w-[78px] h-[7px] gradient #b3c9ff → #5c8cff rounded-full
export interface QuestionHeroProps {
  number: number
  question: string
}

export function QuestionHero({ number, question }: QuestionHeroProps) {
  return (
    <div className="flex w-full flex-col items-center gap-md">
      <QBadge number={number} />
      <div className="flex flex-col items-center gap-xs overflow-clip">
        <div className="flex items-center gap-2.5 overflow-clip text-h2 font-bold whitespace-nowrap">
          <span className="text-[#3d70ef]">"</span>
          <span className="text-[#081d49]">{question}</span>
          <span className="text-[#3d70ef]">"</span>
        </div>
        <div className="h-[7px] w-[78px] rounded-full bg-gradient-to-r from-[#b3c9ff] to-[#5c8cff]" />
      </div>
    </div>
  )
}
