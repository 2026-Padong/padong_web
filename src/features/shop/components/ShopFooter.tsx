import { Heart } from '@/components/ui/Heart'
import { Bookmark } from '@/components/ui/Bookmark'

// Figma 1:1: Tile · ShopFooter (1663:4674) > ShopFooter COMPONENT
// 62x119 V py-xs gap-lg items-center, 우측 액션 푸터 (Heart, Bookmark)
export interface ShopFooterProps {
  liked: boolean
  bookmarked: boolean
  onLike?: () => void
  onBookmark?: () => void
}

export function ShopFooter({ liked, bookmarked, onLike, onBookmark }: ShopFooterProps) {
  return (
    <div className="flex flex-col items-center gap-lg py-xs">
      <Heart active={liked} onClick={onLike} />
      <Bookmark active={bookmarked} onClick={onBookmark} />
    </div>
  )
}
