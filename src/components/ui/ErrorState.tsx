import { AlertCircle } from 'lucide-react'

export interface ErrorStateProps {
  title?: string
  message?: string
  onRetry?: () => void
}

export function ErrorState({
  title = '문제가 발생했어요',
  message = '잠시 후 다시 시도해주세요',
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-md p-xl">
      <AlertCircle size={36} className="text-status-critical" />
      <div className="flex flex-col items-center gap-xs">
        <p className="text-subhead font-bold text-text-primary">{title}</p>
        <p className="text-body-l text-text-tertiary">{message}</p>
      </div>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="rounded-md border border-border-default bg-neutral-white px-md py-xs text-body-l font-bold text-brand-primary"
        >
          다시 시도
        </button>
      )}
    </div>
  )
}
