import { useState } from 'react'
import { useNavigate } from 'react-router'
import { HeaderNav } from '@/components/layout/HeaderNav'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { Icon } from '@/components/ui/Icon'
import { useAuth } from '@/lib/auth'
import { withdrawApi } from '@/api/auth'
import { tokenStore } from '@/api/client'

// 마이페이지 — 배민 스타일
// 1) 상단 브랜드 hero (프로필 + 권한 + 거주 동네)
// 2) 4-cell 빠른 액션 그리드 (주문 / 좋아요 가게 / 좋아요 동네 / 내 동네)
// 3) 메뉴 리스트 (사장님 전환/관리)
// 4) 하단 계정 액션 (로그아웃 / 탈퇴)
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
    <div className="flex min-h-screen flex-col bg-neutral-white">
      <HeaderNav
        user={user}
        onMyPage={() => nav('/mypage', { viewTransition: true })}
        onLogout={handleLogout}
      />
      <main className="mx-auto flex w-full max-w-[640px] flex-1 flex-col gap-md px-md py-lg">
        <h1 className="text-h2 font-bold text-text-primary">마이페이지</h1>
        {/* 1) Hero — 톤 다운 (연한 brand tint 배경 + 일반 텍스트) */}
        <section className="flex items-center gap-md rounded-md bg-brand-primary-tint px-lg py-lg">
          {user.picture ? (
            <img
              src={user.picture}
              alt=""
              className="size-[56px] shrink-0 rounded-full object-cover"
            />
          ) : (
            <div className="inline-flex size-[56px] shrink-0 items-center justify-center rounded-full bg-brand-primary text-h3 font-bold text-neutral-white">
              {initial}
            </div>
          )}
          <div className="flex flex-1 flex-col gap-xxs">
            <div className="flex items-center gap-xs">
              <span className="text-body-l font-bold text-text-primary">{user.name} 님</span>
              {isAdmin && (
                <span className="inline-flex items-center rounded-full bg-status-positive-bg px-xs py-xxs text-body-s font-medium text-status-positive">
                  사장님
                </span>
              )}
            </div>
            {user.email && (
              <span className="text-body font-normal text-text-tertiary">{user.email}</span>
            )}
            {user.adminDongName && (
              <button
                type="button"
                onClick={() => nav('/mypage/admin-dong', { viewTransition: true })}
                className="group inline-flex w-fit cursor-pointer items-center gap-xxs pt-xxs text-left text-body font-normal text-text-secondary transition-colors hover:text-brand-primary"
              >
                <span>현재 설정한 동네: {user.adminDongName}</span>
                <span
                  aria-hidden
                  className="text-text-tertiary transition-transform group-hover:translate-x-[2px] group-hover:text-brand-primary"
                >
                  ›
                </span>
              </button>
            )}
          </div>
        </section>

        {/* 활동 */}
        <SectionTitle>활동</SectionTitle>
        <section className="flex flex-col">
          <MenuItem
            label="주문 내역"
            onClick={() => nav('/mypage/orders', { viewTransition: true })}
          />
          <MenuItem
            label="좋아요 가게"
            onClick={() => nav('/mypage/likes/stores', { viewTransition: true })}
          />
          <MenuItem
            label="좋아요 동네"
            onClick={() => nav('/mypage/likes/dongs', { viewTransition: true })}
          />
        </section>

        {/* 설정 */}
        <SectionTitle>설정</SectionTitle>
        <section className="flex flex-col">
          <MenuItem
            label="정보 수정"
            onClick={() => nav('/mypage/profile', { viewTransition: true })}
          />
          <MenuItem
            label="동네 설정"
            onClick={() => nav('/mypage/admin-dong', { viewTransition: true })}
          />
          {isAdmin ? (
            <MenuItem
              label="매장 관리"
              onClick={() => nav('/admin/shops', { viewTransition: true })}
            />
          ) : (
            <MenuItem
              label="사장님으로 전환 신청"
              onClick={() => nav('/mypage/upgrade-admin', { viewTransition: true })}
            />
          )}
        </section>

        {/* 4) 계정 액션 */}
        <section className="flex justify-center gap-md pt-xl">
          <button
            type="button"
            onClick={handleLogout}
            className="cursor-pointer text-body font-normal text-text-tertiary underline-offset-2 hover:text-text-primary hover:underline"
          >
            로그아웃
          </button>
          <span aria-hidden className="text-text-tertiary">
            ·
          </span>
          <button
            type="button"
            onClick={() => setWithdrawOpen(true)}
            className="cursor-pointer text-body font-normal text-text-tertiary underline-offset-2 hover:text-status-critical hover:underline"
          >
            회원 탈퇴
          </button>
        </section>
      </main>

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

function Divider() {
  return <div className="h-px w-full bg-border-default" aria-hidden />
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="px-md pt-xl pb-xs text-body font-bold text-text-tertiary">
      {children}
    </h2>
  )
}

function MenuItem({
  icon,
  label,
  description,
  onClick,
  comingSoon,
}: {
  icon?: string
  label: string
  description?: string
  onClick?: () => void
  comingSoon?: boolean
}) {
  const disabled = comingSoon || !onClick
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="group flex w-full cursor-pointer items-center gap-md border-b border-border-default px-md py-md text-left transition-colors last:border-b-0 hover:bg-surface-subtle disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-neutral-white"
    >
      {icon && (
        <span className="inline-flex size-[36px] shrink-0 items-center justify-center rounded-full bg-brand-primary-tint">
          <Icon
            name={icon}
            size={20}
            style={{ ['--fill-0' as string]: 'var(--color-brand-primary)' } as React.CSSProperties}
            aria-hidden
          />
        </span>
      )}
      <div className="flex flex-1 flex-col gap-xxs">
        <span className="text-body-l font-bold text-text-primary">{label}</span>
        {description && (
          <span className="text-body font-normal text-text-tertiary">{description}</span>
        )}
      </div>
      <div className="flex items-center gap-sm">
        {comingSoon && (
          <span className="inline-flex items-center rounded-full bg-surface-subtle px-sm py-xxs text-body-s font-normal text-text-tertiary">
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
