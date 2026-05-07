export interface LoadingFooterProps {
  message: string
}

export function LoadingFooter({ message }: LoadingFooterProps) {
  return (
    <div className="flex flex-col items-center gap-md">
      <p className="text-body text-text-tertiary">{message}</p>
    </div>
  )
}
