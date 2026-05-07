export interface ResultCardScoreProps {
  value: number
}

export function ResultCardScore({ value }: ResultCardScoreProps) {
  return (
    <div className="flex flex-col items-center justify-center">
      <span className="text-h3 font-bold text-brand-primary">{value}</span>
      <span className="text-caption font-normal text-text-tertiary">파동 점수</span>
    </div>
  )
}
