import { useMemo } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router'
import { SideNav } from '@/components/layout/SideNav'
import { ShopListPanel } from '@/features/shop/components/ShopListPanel'
import { ShopDetailPanel } from '@/features/shop/components/ShopDetailPanel'
import { MOCK_SHOPS } from '@/data/mocks'

export function ShopDetailPage() {
  const { id } = useParams<{ id: string }>()
  const nav = useNavigate()
  const [params, setParams] = useSearchParams()
  const tab = (params.get('tab') ?? 'Menu') as 'Menu' | 'Info'

  const shop = useMemo(() => MOCK_SHOPS.find((s) => s.id === id), [id])

  if (!shop) {
    return (
      <div className="flex h-screen items-center justify-center text-text-secondary">
        가게를 찾을 수 없습니다
      </div>
    )
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <SideNav activeType="LocalShop" />
      <ShopListPanel
        shops={MOCK_SHOPS}
        selectedId={shop.id}
        onShopClick={(sid) => nav(`/shops/${sid}`)}
      />
      <ShopDetailPanel shop={shop} tab={tab} onTabChange={(t) => setParams({ tab: t })} />
    </div>
  )
}
