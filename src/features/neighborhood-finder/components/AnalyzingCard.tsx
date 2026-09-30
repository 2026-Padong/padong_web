import { LoadingFooter } from '@/components/ui/LoadingFooter'
import { TitleBlock } from '@/components/ui/TitleBlock'
import { AnalyzingIllustration } from './AnalyzingIllustration'
import { StepCard } from './StepCard'

// Figma 1:1: Tile · AnalyzingCard (1511:4245) > AnalyzingCard COMPONENT
// w-[980px] flex flex-col items-center justify-between px-[72px] py-2xl rounded-md
// AnalyzingIllustration + TitleBlock + StepsRow (3 StepCards) + LoadingFooter
const DEFAULT_STEPS = [
  {
    title: '취향 답변 정리',
    description: '주말 활동, 선호 분위기, 생활 패턴을 기준으로 성향을 분류해요.',
  },
  {
    title: '동네 데이터 매칭',
    description: '동네별 특성과 사용자 취향의 유사도를 계산하고 있어요.',
  },
  { title: '추천 결과 준비', description: '가장 잘 맞는 동네와 추천 이유를 보기 쉽게 정리해요.' },
]

export interface AnalyzingCardProps {
  /** 현재 진행 중 step (0-indexed). 이 step만 active, 나머지는 inactive */
  activeStep?: number
  steps?: { title: string; description: string }[]
  loadingMessage?: string
  loadingProgress?: number
  /** true 시 progress 무시하고 sweep 애니메이션 */
  loadingIndeterminate?: boolean
}

export function AnalyzingCard({
  steps = DEFAULT_STEPS,
  loadingMessage = '결과 페이지로 곧 이동합니다',
  loadingProgress = 30,
  loadingIndeterminate = false,
}: AnalyzingCardProps) {
  return (
    <section className="flex w-full max-w-[980px] flex-col items-center justify-between gap-2xl rounded-md px-md py-2xl md:px-[72px]">
      <AnalyzingIllustration />
      <TitleBlock
        title={
          <>
            내 취향에 맞는 <span className="text-status-recruiting">동네를 분석 중</span>이에요
          </>
        }
        body={
          <>
            <p>
              답변해주신 취향을 바탕으로 생활 분위기, 이동 편의, 주변 환경 데이터를 함께 비교하고
              있어요.
            </p>
            <p>잠시 후 맞춤 동네 추천 결과로 이어집니다.</p>
          </>
        }
      />
      <div className="flex w-full flex-col items-stretch gap-md md:flex-row md:items-start md:overflow-clip">
        {steps.map((s) => (
          <div key={s.title} className="md:flex-1">
            <StepCard active title={s.title} description={s.description} />
          </div>
        ))}
      </div>
      <LoadingFooter
        progress={loadingProgress}
        indeterminate={loadingIndeterminate}
        message={loadingMessage}
      />
    </section>
  )
}
