import type { ShopSummaryResponse, ShopDetailResponse } from '@/api/contracts/shops'
import type { MockShop, ShopStatus } from '@/data/mocks'

// 가게 응답 DTO → 내부 MockShop 형태 매핑 (downstream: ShopCard / ShopDetailPanel)
// 백엔드 필드 매핑:
//   thumbnailUrl → image
//   images[].url → images: string[]
//   address → 단일 문자열 그대로
//   categoryLabel → category (사람이 읽는 라벨로 표시)

export function summaryToShop(dto: ShopSummaryResponse): MockShop {
  return {
    id: String(dto.id),
    image: dto.thumbnailUrl,
    name: dto.name,
    category: dto.categoryLabel || dto.category,
    description: dto.description || undefined,
    status: dto.status.toLowerCase() as ShopStatus,
    participantCurrent: dto.participantCurrent,
    participantTotal: dto.participantTotal,
    liked: dto.likedByCurrentUser,
    bookmarked: false,
    images: dto.thumbnailUrl ? [dto.thumbnailUrl] : [],
    menuCategories: [],
    menus: [],
    infoRows: [],
    latitude: dto.latitude ?? null,
    longitude: dto.longitude ?? null,
  }
}

export function detailToShop(dto: ShopDetailResponse): MockShop {
  return {
    id: String(dto.id),
    image: dto.thumbnailUrl,
    name: dto.name,
    category: dto.categoryLabel || dto.category,
    description: dto.description || undefined,
    status: dto.status.toLowerCase() as ShopStatus,
    participantCurrent: dto.participantCurrent,
    participantTotal: dto.participantTotal,
    liked: dto.likedByCurrentUser,
    bookmarked: false,
    images: dto.images.map((img) => img.url),
    menuCategories: dto.menuCategories,
    menus: dto.menus.map((m) => ({
      id: m.id,
      name: m.name,
      price: m.price,
    })),
    infoRows: [
      { label: '주소', value: dto.address ?? '' },
      { label: '전화', value: dto.phoneNumber },
    ],
    currentGroupOrderId: dto.currentGroupOrderId,
    latitude: dto.latitude ?? null,
    longitude: dto.longitude ?? null,
    openTime: dto.openTime,
    closeTime: dto.closeTime,
    weekdayMask: dto.weekdayMask,
  }
}
