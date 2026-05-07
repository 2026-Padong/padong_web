// Figma 1:1: Tile · LoadingFooter (1527:4242) > LoadingFooter COMPONENT
// flex flex-col gap-md items-center
// LoadingBar: h-[10px] rounded-full bg-surface-subtle, fill: gradient #0d55ef → #6ea0ff
// Text: 14px Regular text-text-tertiary text-center
export interface LoadingFooterProps {
  /** 0~100 — 로딩 진행 비율 */
  progress?: number
  message: string
}

export function LoadingFooter({ progress = 30, message }: LoadingFooterProps) {
  const pct = Math.max(0, Math.min(100, progress))
  return (
    <div className="flex w-full flex-col items-center gap-md">
      <div className="flex h-[10px] w-full items-start overflow-clip rounded-full bg-surface-subtle">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#0d55ef] to-[#6ea0ff] transition-[width]"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="w-full text-center text-body-l font-normal text-text-tertiary">{message}</p>
    </div>
  )
}
