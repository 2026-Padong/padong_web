import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { useAuth } from './auth'
import { saveReturnUrl } from './loginRedirect'

// 액션 시점 로그인 게이트
// 사용:
//   const { requireLogin, loginDialog } = useLoginGate()
//   const onLike = () => {
//     if (!requireLogin({ action: '좋아요' })) return
//     // ... 인증 필요한 동작
//   }
//   return (<>... {loginDialog}</>)
//
// requireLogin 은 로그인 됐으면 true 반환(즉시 동작 진행), 아니면 다이얼로그 노출 + false 반환
export interface RequireLoginOptions {
  /** 다이얼로그 본문에 들어갈 액션명. 예: "좋아요", "결제", "참여" */
  action?: string
  /** action 대신 전체 문구를 직접 지정 */
  description?: string
}

export function useLoginGate() {
  const { user } = useAuth()
  const nav = useNavigate()
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const [description, setDescription] = useState<string>('이 동작은 로그인 후 이용할 수 있어요.')

  const requireLogin = (opts: RequireLoginOptions = {}): boolean => {
    if (user) return true
    const text =
      opts.description ?? (opts.action ? `${opts.action}는 로그인 후 이용할 수 있어요.` : undefined)
    if (text) setDescription(text)
    setOpen(true)
    return false
  }

  const loginDialog = (
    <ConfirmDialog
      open={open}
      title="로그인이 필요해요"
      description={description}
      confirmLabel="로그인하기"
      cancelLabel="닫기"
      onConfirm={() => {
        setOpen(false)
        saveReturnUrl(location.pathname + location.search)
        nav('/login', { viewTransition: true })
      }}
      onCancel={() => setOpen(false)}
    />
  )

  return { requireLogin, loginDialog }
}
