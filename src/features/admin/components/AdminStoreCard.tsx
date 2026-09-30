import type { ReactNode } from 'react'
import type { StoreRegistrationResponse } from '@/api/stores'

// 사장님 관리 화면 전용 가게 카드
// ShopCard는 발견용(이미지/모집중 뱃지/좋아요 토글) 이라 운영 정보 표시에 맞지 않아 분리.
// 추후 가게 수정/삭제 액션은 actions 슬롯으로 주입.
export interface AdminStoreCardProps {
  store: StoreRegistrationResponse
  onClick?: () => void
  /** 카드 하단 액션 영역 (예: 수정/삭제 버튼) */
  actions?: ReactNode
}

// 'HH:mm:ss' → 'HH:mm'
function trimSeconds(t: string): string {
  if (!t) return t
  const parts = t.split(':')
  return parts.length >= 2 ? `${parts[0]}:${parts[1]}` : t
}

export function AdminStoreCard({ store, onClick, actions }: AdminStoreCardProps) {
  const interactive = !!onClick
  const Tag = interactive ? 'button' : 'div'

  return (
    <Tag
      type={interactive ? 'button' : undefined}
      onClick={onClick}
      className={
        'flex w-full flex-col gap-md rounded-md bg-neutral-white p-lg text-left ring-1 ring-border-default ' +
        (interactive
          ? 'cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary'
          : '')
      }
    >
      {/* 헤더: 가게명 + 좋아요 수 */}
      <div className="flex items-baseline justify-between gap-md">
        <span className="text-subhead font-bold text-text-primary">{store.name}</span>
        <span className="shrink-0 inline-flex items-center gap-xxs text-body font-medium text-text-tertiary">
          <span aria-hidden>♥</span>
          <span>{store.likeCount}</span>
        </span>
      </div>

      {/* 메타: 라벨 + 값으로 위계 부여 */}
      <dl className="flex flex-col gap-xs">
        <MetaRow label="주소" value={store.address} />
        <MetaRow label="전화" value={store.phoneNumber} />
        <MetaRow
          label="영업"
          value={`${trimSeconds(store.openTime)} ~ ${trimSeconds(store.closeTime)}`}
        />
      </dl>

      {actions && <div className="mt-xs flex items-center gap-xs">{actions}</div>}
    </Tag>
  )
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline gap-sm">
      <dt className="shrink-0 w-[36px] text-body font-normal text-text-tertiary">{label}</dt>
      <dd className="flex-1 text-body-l font-normal text-text-primary">{value}</dd>
    </div>
  )
}
