// Figma 1:1: Tile · QuestionStatement (538:1014) > QuestionStatement COMPONENT
// w-[370px] flex flex-col gap-lg items-center
// Title: Noto Sans KR Bold 32px text-brand-primary "" 주말에 나는? ""
// Subtitle: Noto Sans KR Bold 16px text-text-secondary
export interface QuestionStatementProps {
  question: string
  subtitle?: string
}

export function QuestionStatement({ question, subtitle }: QuestionStatementProps) {
  return (
    <div className="flex w-full flex-col items-center gap-lg whitespace-nowrap">
      <p className="text-h1 font-bold text-brand-primary">"{question}"</p>
      {subtitle && <p className="text-subhead font-bold text-text-secondary">{subtitle}</p>}
    </div>
  )
}
