// Figma 1:1: Tile · SurveyStatusPill (1488:4164) > SurveyStatusPill COMPONENT
// h-[52px] w-[248px] flex items-center justify-between px-[24px] rounded-[14px]
// bg-neutral-white border border-border-default + drop-shadow
// Left (gap-[10px] items-center):
//   - Check: bg-brand-primary h-[22px] rounded-md + shadow-[0px_7px_14px_0px_rgba(37,88,232,0.22)] + "✓" Inter Black 13px white
//   - Title: Inter Extra Bold 15px text-text-primary "취향 질문"
// Right: "1 / 10" Inter Black 18px text-brand-primary
export interface SurveyStatusPillProps {
  current: number
  total: number
  title?: string
}

export function SurveyStatusPill({ current, total, title = '취향 질문' }: SurveyStatusPillProps) {
  return (
    <div className="inline-flex h-[52px] w-[248px] items-center justify-between rounded-[14px] border border-border-default bg-neutral-white px-xl drop-shadow-[0px_8px_9px_rgba(33,64,110,0.06)]">
      <div className="inline-flex items-center gap-2.5">
        <span className="inline-flex h-[22px] items-center justify-center rounded-md bg-brand-primary px-[6px] shadow-[0px_7px_14px_0px_rgba(37,88,232,0.22)]">
          <span className="text-body font-black not-italic text-neutral-white">✓</span>
        </span>
        <span className="text-[15px] font-extrabold not-italic text-text-primary whitespace-nowrap">
          {title}
        </span>
      </div>
      <span className="text-h4 font-black not-italic text-brand-primary whitespace-nowrap">
        {current} / {total}
      </span>
    </div>
  )
}
