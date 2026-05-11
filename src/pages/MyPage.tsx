import { useState } from 'react'
import { useNavigate } from 'react-router'
import { HeaderNav } from '@/components/layout/HeaderNav'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { useAuth } from '@/lib/auth'
import { withdrawApi } from '@/api/auth'
import { tokenStore } from '@/api/client'

// 마이페이지 MVP — 단일 카드 안에 프로필 + 메뉴 + 계정 모두
export function MyPage() {
  const nav = useNavigate()
  const { user, logout } = useAuth()
  const [withdrawOpen, setWithdrawOpen] = useState(false)
  const [errorOpen, setErrorOpen] = useState(false)

  if (!user) {
    nav('/login', { replace: true })
    return null
  }

  const initial = user.name.charAt(0).toUpperCase()
  const isAdmin = user.role === 'ADMIN'

  const handleLogout = async () => {
    await logout()
    nav('/', { replace: true })
  }

  const handleWithdrawConfirm = async () => {
    setWithdrawOpen(false)
    try {
      await withdrawApi()
    } catch (e) {
      console.error('[mypage] withdraw failed:', e)
      setErrorOpen(true)
      return
    }
    tokenStore.clear()
    await logout()
    nav('/', { replace: true })
  }

  return (
    <div className="flex min-h-screen flex-col bg-surface-subtle/40">
      <HeaderNav
        user={user}
        onMyPage={() => nav('/mypage', { viewTransition: true })}
        onLogout={handleLogout}
      />
      <main className="mx-auto flex w-full max-w-[640px] flex-1 flex-col gap-lg px-md py-2xl">
        {/* 단일 카드 — 프로필 + 메뉴 + 계정 */}
        <div className="flex flex-col overflow-hidden rounded-2xl bg-neutral-white shadow-[0px_4px_24px_rgba(45,78,130,0.06)] ring-1 ring-border-default">
          {/* 프로필 */}
          <div className="flex items-center gap-md px-lg py-lg">
            {user.picture ? (
              <img
                src={user.picture}
                alt=""
                className="size-[64px] shrink-0 rounded-full object-cover"
              />
            ) : (
              <div className="inline-flex size-[64px] shrink-0 items-center justify-center rounded-full bg-brand-primary text-h2 font-bold text-neutral-white">
                {initial}
              </div>
            )}
            <div className="flex flex-1 flex-col gap-xxs">
              <div className="flex items-center gap-xs">
                <span className="text-h3 font-bold text-text-primary">{user.name}</span>
                <span
                  className={`inline-flex items-center rounded-full px-sm py-xxs text-body font-bold ${
                    isAdmin
                      ? 'bg-status-warning/20 text-status-warning'
                      : 'bg-brand-primary-tint text-brand-primary'
                  }`}
                >
                  {isAdmin ? '사장님' : '일반 회원'}
                </span>
              </div>
              {user.email && (
                <span className="text-body font-normal text-text-tertiary">{user.email}</span>
              )}
            </div>
          </div>

          {/* 구분선 두께 있는 회색 띠로 섹션 분리 */}
          <div className="h-[8px] bg-surface-subtle/60" aria-hidden />

          {/* 메뉴 */}
          <MenuItem
            label="내 동네 설정"
            description={user.adminDongName ?? '거주 행정동 변경'}
            onClick={() => nav('/mypage/admin-dong', { viewTransition: true })}
          />
          <MenuItem
            label="좋아요한 동네"
            description="찜한 동네 모아보기"
            onClick={() => nav('/mypage/likes/dongs', { viewTransition: true })}
          />
          <MenuItem
            label="좋아요한 가게"
            description="찜한 가게 모아보기"
            onClick={() => nav('/mypage/likes/stores', { viewTransition: true })}
          />
          {isAdmin ? (
            <MenuItem
              label="내 가게 관리"
              description="등록한 가게 정보 수정"
              onClick={() => nav('/shops', { viewTransition: true })}
            />
          ) : (
            <MenuItem
              label="사장님으로 전환 신청"
              description="가게 운영자 권한 신청"
              onClick={() => nav('/mypage/upgrade-admin', { viewTransition: true })}
            />
          )}

          {/* 섹션 구분 */}
          <div className="h-[8px] bg-surface-subtle/60" aria-hidden />

          {/* 계정 */}
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full cursor-pointer items-center justify-between border-b border-border-default px-lg py-md text-left transition-colors hover:bg-surface-subtle"
          >
            <span className="text-body-l font-normal text-text-secondary">로그아웃</span>
            <span aria-hidden className="text-text-tertiary">→</span>
          </button>
          <button
            type="button"
            onClick={() => setWithdrawOpen(true)}
            className="flex w-full cursor-pointer items-center justify-between px-lg py-md text-left transition-colors hover:bg-surface-subtle"
          >
            <span className="text-body-l font-normal text-text-tertiary">회원 탈퇴</span>
            <span aria-hidden className="text-text-tertiary">→</span>
          </button>
        </div>
      </main>

      {/* 회원 탈퇴 confirm */}
      <ConfirmDialog
        open={withdrawOpen}
        title="정말 탈퇴하시겠어요?"
        description={'계정 정보가 삭제되며\n되돌릴 수 없어요.'}
        confirmLabel="탈퇴"
        cancelLabel="취소"
        variant="critical"
        onConfirm={handleWithdrawConfirm}
        onCancel={() => setWithdrawOpen(false)}
      />

      {/* 탈퇴 실패 alert */}
      <ConfirmDialog
        open={errorOpen}
        title="탈퇴 처리에 실패했어요"
        description="잠시 후 다시 시도해주세요."
        confirmLabel="확인"
        hideCancel
        onConfirm={() => setErrorOpen(false)}
      />
    </div>
  )
}

function MenuItem({
  label,
  description,
  onClick,
  disabled,
  comingSoon,
}: {
  label: string
  description?: string
  onClick?: () => void
  disabled?: boolean
  comingSoon?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="group flex w-full cursor-pointer items-center justify-between border-b border-border-default px-lg py-md text-left transition-colors last:border-b-0 hover:bg-surface-subtle disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-neutral-white"
    >
      <div className="flex flex-col gap-xxs">
        <span className="text-body-l font-bold text-text-primary">{label}</span>
        {description && (
          <span className="text-body font-normal text-text-tertiary">{description}</span>
        )}
      </div>
      <div className="flex items-center gap-sm">
        {comingSoon && (
          <span className="inline-flex items-center rounded-full bg-surface-subtle px-sm py-xxs text-body font-normal text-text-tertiary">
            준비 중
          </span>
        )}
        {!disabled && (
          <span
            aria-hidden
            className="text-text-tertiary transition-transform group-hover:translate-x-[2px]"
          >
            →
          </span>
        )}
      </div>
    </button>
  )
}
