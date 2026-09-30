// Figma 1:1: Tile · QuestionProgress (538:1011) > QuestionProgress COMPONENT
// w-[600px] flex flex-col items-start
// ProgressBlock (gap-md items-center w-full):
//   - LabelRow (justify-between): StepLabel + Counter
//     - StepLabel (gap-2 items-baseline): "01" 28px Bold brand-primary + "취향 질문" 18px text-text-primary
//     - Counter (items-baseline): count 28px Bold brand-primary + "/ 10" 22px Regular text-text-secondary
//   - Underline: h-[2px] bg-border-strong/40 rounded-full
export interface QuestionProgressProps {
  current: number
  total: number
  step?: string
  stepLabel?: string
  showCount?: boolean
}

export function QuestionProgress({
  current,
  total,
  step,
  stepLabel = '취향 질문',
  showCount = true,
}: QuestionProgressProps) {
  const stepText = step ?? String(current).padStart(2, '0')
  return (
    <div className="flex w-full flex-col items-start">
      <div className="flex w-full flex-col items-center justify-center gap-md">
        <div className="flex w-full items-center justify-between whitespace-nowrap">
          <div className="flex flex-1 items-baseline gap-xs">
            <span className="text-h2 font-bold text-brand-primary">{stepText}</span>
            <span className="text-h4 font-bold text-text-primary">{stepLabel}</span>
          </div>
          {showCount && (
            <div className="flex items-baseline">
              <span className="text-h2 font-bold text-brand-primary">{current}</span>
              <span className="text-h3 font-normal text-text-secondary">&nbsp;/ {total}</span>
            </div>
          )}
        </div>
        <div className="h-0.5 w-full rounded-full bg-border-strong opacity-40" />
      </div>
    </div>
  )
}
