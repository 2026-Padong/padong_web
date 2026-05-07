import { RadioOption } from './RadioOption'

// Figma 1:1: Tile · LikertScale (538:1002) > LikertScale COMPONENT
// bg-brand-primary-tint h-[161px] w-[370px] flex flex-col items-center justify-between py-xl rounded-xl
// OptionRow: flex items-center justify-between px-2xl — 5개 RadioOption (1~5)
// EndpointLabels: flex justify-between px-lg, 10px Regular text-text-tertiary
export interface LikertScaleProps {
  value?: 1 | 2 | 3 | 4 | 5
  onChange?: (v: 1 | 2 | 3 | 4 | 5) => void
  leftLabel?: string
  rightLabel?: string
}

export function LikertScale({
  value,
  onChange,
  leftLabel = '집에만 있을래요',
  rightLabel = '밖에 나가야 살아나요',
}: LikertScaleProps) {
  return (
    <div className="flex h-[161px] w-[370px] flex-col items-center justify-between rounded-xl bg-brand-primary-tint py-xl">
      <div className="flex w-full items-center justify-between px-2xl">
        {([1, 2, 3, 4, 5] as const).map((v) => (
          <RadioOption
            key={v}
            number={v}
            state={value === v ? 'selected' : 'default'}
            onClick={() => onChange?.(v)}
          />
        ))}
      </div>
      <div className="flex w-full items-center justify-between px-lg whitespace-nowrap">
        <span className="text-caption font-normal text-text-tertiary">{leftLabel}</span>
        <span className="text-caption font-normal text-text-tertiary">{rightLabel}</span>
      </div>
    </div>
  )
}
