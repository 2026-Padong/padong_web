import { useNavigate } from 'react-router'
import { SideNav } from '@/components/layout/SideNav'
import { MapPlaceholder } from '@/components/ui/MapPlaceholder'
import { ShopListPanel } from '@/features/shop/components/ShopListPanel'
import { MOCK_SHOPS } from '@/data/mocks'

export function ShopListPage() {
  const nav = useNavigate()
  return (
    <div className="flex h-screen overflow-hidden">
      <SideNav activeType="LocalShop" />
      <ShopListPanel shops={MOCK_SHOPS} onShopClick={(id) => nav(`/shops/${id}`)} />
      <MapPlaceholder width={908} height={900} />
    </div>
  )
}
