// Figma 1:1: Tile · QuantityStepper (1673:6532) > QuantityStepper COMPONENT_SET (Quantity=Zero/One)
// Zero: "담기" 버튼 (rounded-md border bg-white px-md py-xs text-brand-primary 14px Bold)
// One: − value + (h-8 stepper)
export interface QuantityStepperProps {
  value: number
  onChange?: (value: number) => void
  max?: number
}

export function QuantityStepper({ value, onChange, max = 99 }: QuantityStepperProps) {
  if (value === 0) {
    return (
      <button
        type="button"
        onClick={() => onChange?.(1)}
        className="rounded-md border border-border-default bg-neutral-white px-md py-xs text-body-l font-bold text-brand-primary"
      >
        담기
      </button>
    )
  }
  return (
    <div className="inline-flex items-center gap-xs">
      <button
        type="button"
        onClick={() => onChange?.(Math.max(0, value - 1))}
        aria-label="감소"
        className="h-8 w-8 rounded-md border border-border-default text-body-l text-text-primary"
      >
        −
      </button>
      <span className="w-6 text-center text-body-l font-bold text-text-primary">{value}</span>
      <button
        type="button"
        onClick={() => onChange?.(Math.min(max, value + 1))}
        aria-label="증가"
        className="h-8 w-8 rounded-md bg-brand-primary text-body-l text-neutral-white"
      >
        +
      </button>
    </div>
  )
}
