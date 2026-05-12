import { AnalyzingIllustration } from './AnalyzingIllustration'

// Figma 1:1: Tile · AnalyzingVisual (546:1064) > AnalyzingIllustration (확장 버전) COMPONENT
// w-[370px] flex flex-col gap-lg items-center
// 분석중_IMG (aspect 592/413) + MessageBlock (V gap-lg items-center):
//   - Title: 22px Bold brand-primary "당신의 취향을 분석 중이에요"
//   - Subtitle: 14px Regular text-text-secondary (2 줄)
export interface AnalyzingVisualProps {
  title?: string
  subtitleLine1?: string
  subtitleLine2?: string
}

export function AnalyzingVisual({
  title = '당신의 취향을 분석 중이에요',
  subtitleLine1 = '선호하는 분위기와 라이프스타일을 기반으로',
  subtitleLine2 = '우리동네를 분석하고 있어요',
}: AnalyzingVisualProps) {
  return (
    <div className="flex w-full max-w-[370px] flex-col items-center gap-lg">
      <AnalyzingIllustration />
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
