import { PageHeader } from '@/components/ui/PageHeader'
import { QuestionProgress } from './QuestionProgress'
import { AnalyzingIllustration } from './AnalyzingIllustration'

// Figma 1:1: Tile · CustomizedPanel2 (546:1067) > LifestyleAnalyzingPanel (545:1058)
// w-[420px] h-[900px] flex flex-col gap-2xl items-center p-xl
// PageHeader + AnalyzingContent (V gap-[70px] items-center w-full):
//   QuestionProgress (showCount=false, step="02", stepLabel="취향 분석") + AnalyzingIllustration
export interface LifestyleAnalyzingPanelProps {
  title?: string
  illustrationTitle?: string
  illustrationSubtitleLine1?: string
  illustrationSubtitleLine2?: string
}

export function LifestyleAnalyzingPanel({
  title = '내 취향 기반',
  illustrationTitle,
  illustrationSubtitleLine1,
  illustrationSubtitleLine2,
}: LifestyleAnalyzingPanelProps) {
  return (
    <aside className="flex h-[900px] w-[420px] flex-col items-center gap-2xl p-xl">
      <PageHeader type="Search" title={title} />
      <div className="flex w-full flex-col items-center gap-[70px]">
        <QuestionProgress
          current={0}
          total={10}
          step="02"
          stepLabel="취향 분석"
          showCount={false}
        />
        <AnalyzingIllustration
          title={illustrationTitle}
          subtitleLine1={illustrationSubtitleLine1}
          subtitleLine2={illustrationSubtitleLine2}
        />
      </div>
    </aside>
  )
}
