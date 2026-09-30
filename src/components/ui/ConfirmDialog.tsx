import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/lib/cn'

// 디자인 시스템 confirm/alert 다이얼로그 — native window.confirm/alert 대체
// hideCancel=true면 alert 형태 (확인 버튼 1개)
export interface ConfirmDialogProps {
  open: boolean
  title: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  /** critical 시 confirm 버튼 빨강 (위험 액션) */
  variant?: 'default' | 'critical'
  /** 취소 버튼 숨김 (alert 모드) */
  hideCancel?: boolean
  onConfirm: () => void
  onCancel?: () => void
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = '확인',
  cancelLabel = '취소',
  variant = 'default',
  hideCancel = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  // Escape 키로 취소
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (hideCancel) onConfirm()
        else onCancel?.()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, hideCancel, onConfirm, onCancel])

  if (!open) return null

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-md"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          if (hideCancel) onConfirm()
          else onCancel?.()
        }
      }}
    >
      <div className="w-full max-w-[360px] overflow-hidden rounded-2xl bg-neutral-white shadow-[0px_16px_40px_rgba(45,78,130,0.18)]">
        <div className="flex flex-col gap-xs px-lg py-lg">
          <h2 id="confirm-dialog-title" className="text-h4 font-bold text-text-primary">
            {title}
          </h2>
          {description && (
            <p className="text-body-l font-normal whitespace-pre-line text-text-secondary">
              {description}
            </p>
          )}
        </div>
        <div className="flex gap-xs border-t border-border-default p-sm">
          {!hideCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 cursor-pointer rounded-md py-sm text-body-l font-bold text-text-secondary transition-colors hover:bg-surface-subtle"
            >
              {cancelLabel}
            </button>
          )}
          <button
            type="button"
            onClick={onConfirm}
            autoFocus
            className={cn(
              'flex-1 cursor-pointer rounded-md py-sm text-body-l font-bold text-neutral-white drop-shadow-[0px_4px_24px_rgba(37,88,232,0.14)] transition-colors',
              variant === 'critical'
                ? 'bg-status-critical hover:opacity-90'
                : 'bg-brand-primary hover:bg-brand-primary-hover',
            )}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  )
}
