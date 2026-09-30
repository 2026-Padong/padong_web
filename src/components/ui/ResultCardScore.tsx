// Figma 1:1: Tile · ResultCardScore (430:874) > ResultCardScore COMPONENT
// h-[37px] w-[40px] flex flex-col items-center justify-center overflow-clip
// score: Noto Sans KR Bold 22px text-brand-primary
// label "파동 점수": Noto Sans KR Regular 10px text-text-tertiary
export interface ResultCardScoreProps {
  value: number
}

export function ResultCardScore({ value }: ResultCardScoreProps) {
  return (
    <div className="flex h-[37px] w-[40px] flex-col items-center justify-center overflow-clip whitespace-nowrap">
      <span className="text-h3 font-bold text-brand-primary">{value}</span>
      <span className="text-caption font-normal text-text-tertiary">파동 점수</span>
    </div>
  )
}
