import { useState } from 'react'
import { Image as ImageIcon, ChevronLeft, ChevronRight } from 'lucide-react'

// Figma 1:1: ShopDetailPanel 내 ShopImageGallery (591:10791 등)
// 단일 이미지 슬라이더 — 한 번에 한 장 + "▧ N / total" 카운터 좌하단 + 좌/우 화살표
// width prop: 컨테이너 폭 (Figma는 ShopDetailPanel 안에서 flex-1)
// height: 214 고정
export interface ShopImageGalleryProps {
  images: string[]
  alt?: string
  className?: string
}

export function ShopImageGallery({ images, alt = '', className }: ShopImageGalleryProps) {
  const [index, setIndex] = useState(0)
  const total = Math.max(1, images.length)
  const safeIndex = Math.max(0, Math.min(index, images.length - 1))

  const prev = () => setIndex((i) => (i <= 0 ? Math.max(0, images.length - 1) : i - 1))
  const next = () => setIndex((i) => (i >= images.length - 1 ? 0 : i + 1))

  return (
    <div
      className={`relative h-[214px] w-full overflow-clip rounded-lg bg-surface-subtle ${className ?? ''}`}
    >
      {images.length > 0 ? (
        <img
          src={images[safeIndex]}
          alt={alt}
          className="absolute inset-0 h-full w-full rounded-lg object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <ImageIcon size={48} className="text-border-default" />
        </div>
      )}

      {/* 좌측 화살표 */}
      {images.length > 1 && (
        <button
          type="button"
          aria-label="이전 사진"
          onClick={prev}
          className="absolute left-[10px] top-1/2 flex size-[32px] -translate-y-1/2 items-center justify-center rounded-full bg-neutral-black/40 text-neutral-white hover:bg-neutral-black/60"
        >
          <ChevronLeft size={20} />
        </button>
      )}

      {/* 우측 화살표 */}
      {images.length > 1 && (
        <button
          type="button"
          aria-label="다음 사진"
          onClick={next}
          className="absolute right-[10px] top-1/2 flex size-[32px] -translate-y-1/2 items-center justify-center rounded-full bg-neutral-black/40 text-neutral-white hover:bg-neutral-black/60"
        >
          <ChevronRight size={20} />
        </button>
      )}

      {/* 카운터 좌하단 (Figma 1:1: left-[14px] top-[173px], 즉 bottom 41px / 214) */}
      <div className="absolute left-[14px] top-[173px] flex items-end overflow-clip rounded-md bg-neutral-black px-xs py-xxs">
        <span className="text-body-s font-medium text-neutral-white whitespace-nowrap">
          ▧ {safeIndex + 1} / {total}
        </span>
      </div>
    </div>
  )
}
