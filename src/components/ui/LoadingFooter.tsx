// Figma 1:1: Tile · LoadingFooter (1527:4242) > LoadingFooter COMPONENT
// LoadingBar: h-[10px] rounded-full bg-surface-subtle
//   · indeterminate: 좌→우 sweep 반복 (loading-sweep keyframes)
//   · determinate: width % 진행
// Text: 14px Regular text-text-tertiary text-center
export interface LoadingFooterProps {
  /** 0~100 — 로딩 진행 비율 (indeterminate일 때 무시) */
  progress?: number
  /** true 시 무한 sweep 애니메이션 — 분석/처리 시간 미정 시 사용 */
  indeterminate?: boolean
  message: string
}

export function LoadingFooter({
  progress = 30,
  indeterminate = false,
  message,
}: LoadingFooterProps) {
  const pct = Math.max(0, Math.min(100, progress))
  return (
    <div className="flex w-full flex-col items-center gap-md">
      <div className="relative h-[10px] w-full overflow-clip rounded-full bg-surface-subtle">
        {indeterminate ? (
          <div className="absolute inset-y-0 w-2/5 rounded-full bg-gradient-to-r from-[#0d55ef] to-[#6ea0ff] animate-[loading-sweep_2.2s_ease-in-out_infinite]" />
        ) : (
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#0d55ef] to-[#6ea0ff] transition-[width]"
            style={{ width: `${pct}%` }}
          />
        )}
      </div>
      <p className="w-full text-center text-body-l font-normal text-text-tertiary">{message}</p>
    </div>
  )
}
