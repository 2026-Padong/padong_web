import { QBadge } from './QBadge'

// Figma 1:1: Tile · QuestionHero (1490:4158) > QuestionHero COMPONENT
// QBadge + TitleGroup (V gap-xs items-center):
//   - QuestionTitle (H gap-2.5): " (#3d70ef) + 본문 (#081d49) + " (#3d70ef)
//     · Active: quotes 28(h2) / question 22(h3)
//     · Disabled: 전체 28(h2)
//   - TitleUnderline: w-[78px] h-[7px] gradient
export interface QuestionHeroProps {
  number: number
  question: string
  state?: 'active' | 'disabled'
}

export function QuestionHero({ number, question, state = 'active' }: QuestionHeroProps) {
  const questionSize = state === 'active' ? 'text-h3' : 'text-h2'
  return (
    <div className="flex w-full flex-col items-center gap-md">
      <QBadge number={number} />
      <div className="flex flex-col items-center gap-xs overflow-clip">
        <div className="flex items-center gap-2.5 overflow-clip font-bold whitespace-nowrap">
          <span className="text-h2 text-[#3d70ef]">"</span>
          <span className={`${questionSize} text-[#081d49]`}>{question}</span>
          <span className="text-h2 text-[#3d70ef]">"</span>
        </div>
        <div className="h-[7px] w-[78px] rounded-full bg-gradient-to-r from-[#b3c9ff] to-[#5c8cff]" />
      </div>
    </div>
  )
}
