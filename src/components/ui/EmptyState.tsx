import { Inbox } from 'lucide-react'
import type { ReactNode } from 'react'

export interface EmptyStateProps {
  title?: string
  message?: string
  icon?: ReactNode
}

export function EmptyState({
  title = '결과가 없어요',
  message = '조건을 바꿔서 다시 검색해보세요',
  icon,
}: EmptyStateProps) {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-md p-xl">
      {icon ?? <Inbox size={36} className="text-text-tertiary" />}
      <div className="flex flex-col items-center gap-xs">
        <p className="text-subhead font-bold text-text-primary">{title}</p>
        <p className="text-body-l text-text-tertiary">{message}</p>
      </div>
    </div>
  )
}
