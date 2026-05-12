import { useRef } from 'react'
import { ShopImageGallery } from '@/features/shop/components/ShopImageGallery'

// ─── 썸네일 필드 — view/edit 통합 ──────────────────────────────────────────
// AdminShopsPage(원격 업로드) / AdminShopNewPage(로컬 스테이징) 둘 다 사용.
export interface ShopThumbnailFieldProps {
  /** 표시할 이미지 URL (원격 또는 ObjectURL). 빈 값이면 placeholder */
  src: string | null
  /** 편집 모드 (변경/제거 버튼 노출) */
  editing: boolean
  /** 파일 선택됨 — 페이지가 staged 또는 원격 업로드 처리 */
  onSelect: (file: File) => void
  /** 제거 — staged 면 null, 원격이면 DELETE 호출 */
  onRemove: () => void
  /** 진행 중 (업로드 중) */
  busy?: boolean
  /** 이미지 alt (이름) */
  alt?: string
}

export function ShopThumbnailField({
  src,
  editing,
  onSelect,
  onRemove,
  busy,
  alt,
}: ShopThumbnailFieldProps) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    onSelect(f)
    if (inputRef.current) inputRef.current.value = ''
  }
  return (
    <div className="flex w-fit flex-col gap-sm">
      <div className="rounded-md border border-border-default p-md">
        {src ? (
          <img
            src={src}
            alt={alt ?? ''}
            className="h-[131px] w-[155px] rounded-md object-cover"
          />
        ) : (
          <div className="flex h-[131px] w-[155px] items-center justify-center rounded-md border border-dashed border-border-default text-body-s font-normal text-text-tertiary">
            썸네일 없음
          </div>
        )}
      </div>
      {editing && (
        <div className="flex w-full flex-col gap-xs">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFile}
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={busy}
            className="cursor-pointer rounded-md border border-brand-primary bg-neutral-white px-md py-xxs text-body font-bold text-brand-primary transition-colors hover:bg-brand-primary-tint disabled:cursor-not-allowed disabled:opacity-50"
          >
            {src ? '이미지 변경' : '이미지 선택'}
          </button>
          {src && (
            <button
              type="button"
              onClick={onRemove}
              disabled={busy}
              className="cursor-pointer rounded-md px-md py-xxs text-body font-normal text-text-tertiary transition-colors hover:text-status-critical disabled:cursor-not-allowed disabled:opacity-50"
            >
              제거
            </button>
          )}
        </div>
      )}
    </div>
  )
}

// ─── 상세 이미지 필드 — 갤러리 미리보기 + 편집 그리드 ────────────────────────
export interface GalleryItem {
  /** unique key (storeImage id or staged index) */
  key: string
  url: string
}

export interface ShopGalleryFieldProps {
  items: GalleryItem[]
  editing: boolean
  /** 추가 — 페이지가 staged push 또는 원격 POST */
  onAdd: (file: File) => void
  /** 제거 — 페이지가 staged splice 또는 원격 DELETE (key 로 분기) */
  onRemove: (key: string) => void
  busy?: boolean
  alt?: string
}

export function ShopGalleryField({
  items,
  editing,
  onAdd,
  onRemove,
  busy,
  alt,
}: ShopGalleryFieldProps) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    onAdd(f)
    if (inputRef.current) inputRef.current.value = ''
  }
  return (
    <div className="flex flex-col gap-sm">
      <div className="w-fit rounded-md border border-border-default p-md">
        <div className="w-[400px] max-w-full">
          <ShopImageGallery images={items.map((i) => i.url)} alt={alt ?? ''} />
        </div>
      </div>
      {editing && (
        <div className="grid grid-cols-3 gap-sm sm:grid-cols-4">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFile}
          />
          {items.map((it, idx) => (
            <div
              key={it.key}
              className="group relative aspect-[16/9] overflow-hidden rounded-md ring-1 ring-border-default"
            >
              <img
                src={it.url}
                alt={`상세 ${idx + 1}`}
                className="absolute inset-0 size-full object-cover"
              />
              <button
                type="button"
                onClick={() => onRemove(it.key)}
                disabled={busy}
                aria-label="이미지 제거"
                className="absolute right-xxs top-xxs flex size-[24px] cursor-pointer items-center justify-center rounded-full bg-neutral-black/60 text-neutral-white opacity-0 transition-opacity hover:bg-neutral-black group-hover:opacity-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                ×
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={busy}
            className="flex aspect-[16/9] cursor-pointer flex-col items-center justify-center gap-xxs rounded-md border-2 border-dashed border-border-default bg-neutral-white text-text-tertiary transition-colors hover:border-brand-primary hover:bg-brand-primary-tint hover:text-brand-primary disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span className="text-h3 font-bold leading-none">+</span>
            <span className="text-body-s font-normal">이미지 추가</span>
          </button>
        </div>
      )}
    </div>
  )
}
