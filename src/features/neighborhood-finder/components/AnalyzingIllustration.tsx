import analyzingImg from '@/assets/analyzing-illustration.png'

// Figma 1:1: Tile · CustomizedPanel2 (546:1067) > AnalyzingIllustration (545:1043)
// w-[370px] flex flex-col gap-lg items-center
//   분석중_IMG: aspect-[592/413] w-full overflow-clip
//   MessageBlock (gap-lg items-center):
//     - title: Noto Sans KR Bold 22px text-brand-primary
//     - subtitle: 2 lines, Noto Sans KR Regular 14px text-text-secondary
export interface AnalyzingIllustrationProps {
  title?: string
  subtitleLine1?: string
  subtitleLine2?: string
}

export function AnalyzingIllustration({
  title = '당신의 취향을 분석 중이에요',
  subtitleLine1 = '선호하는 분위기와 라이프스타일을 기반으로',
  subtitleLine2 = '우리동네를 분석하고 있어요',
}: AnalyzingIllustrationProps) {
  return (
    <div className="flex w-[370px] flex-col items-center gap-lg">
      <div className="relative aspect-[592/413] w-full overflow-clip">
        <img src={analyzingImg} alt="" className="absolute inset-0 h-full w-full object-cover" />
      </div>
      <div className="flex flex-col items-center gap-lg whitespace-nowrap">
        <p className="text-h3 font-bold text-brand-primary">{title}</p>
        <div className="flex flex-col items-center text-body-l font-normal text-text-secondary">
          <p>{subtitleLine1}</p>
          <p>{subtitleLine2}</p>
        </div>
      </div>
    </div>
  )
}
