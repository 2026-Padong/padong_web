import { DestinationBar, type DestinationBarProps } from './DestinationBar'

// Figma 1:1: Tile · SearchDestinationBox (431:889) > SearchDestinationBox COMPONENT
// w-[381px] flex flex-col gap-xs items-start
// DestinationBar + hint text (14px Regular text-text-secondary text-right)
export interface SearchDestinationBoxProps extends DestinationBarProps {
  /** 우측 정렬 hint, 예: "연희동" */
  hint?: string
}

export function SearchDestinationBox({ hint, ...barProps }: SearchDestinationBoxProps) {
  return (
    <div className="flex w-full flex-col items-start gap-xs">
      <DestinationBar {...barProps} />
      {hint && (
        <p className="w-full text-right text-body-l font-normal text-text-secondary">{hint}</p>
      )}
    </div>
  )
}
