import { Image as ImageIcon } from 'lucide-react'

// Figma 1:1: Tile · ShopImageGallery (659:2007) > ShopImageGallery COMPONENT
// 324x214 H gap-sm overflow-x-auto, 각 이미지 324x214 rounded-lg
export interface ShopImageGalleryProps {
  images: string[]
  alt?: string
}

export function ShopImageGallery({ images, alt = '' }: ShopImageGalleryProps) {
  if (images.length === 0) {
    return (
      <div className="flex h-[214px] w-[324px] items-center justify-center rounded-lg bg-surface-subtle">
        <ImageIcon size={48} className="text-border-default" />
      </div>
    )
  }
  return (
    <div className="flex gap-sm overflow-x-auto">
      {images.map((src, i) => (
        <img
          key={i}
          src={src}
          alt={alt}
          className="h-[214px] w-[324px] flex-shrink-0 rounded-lg object-cover"
        />
      ))}
    </div>
  )
}
