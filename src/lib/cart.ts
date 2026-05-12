// 가게별 카트 — sessionStorage 기반 (새로고침 견딤, 탭 닫으면 사라짐)
// ShopDetailPanel 의 quantities 를 CheckoutPage 로 전달하는 매개체
export interface CartItem {
  menuId: number
  name: string
  price: number
  quantity: number
}

export interface CartData {
  shopId: number
  shopName: string
  items: CartItem[]
  totalAmount: number
}

const KEY_PREFIX = 'padong.cart.'

export function saveCart(shopId: number, cart: CartData): void {
  window.sessionStorage.setItem(KEY_PREFIX + shopId, JSON.stringify(cart))
}

export function loadCart(shopId: number): CartData | null {
  const raw = window.sessionStorage.getItem(KEY_PREFIX + shopId)
  if (!raw) return null
  try {
    return JSON.parse(raw) as CartData
  } catch {
    return null
  }
}

export function clearCart(shopId: number): void {
  window.sessionStorage.removeItem(KEY_PREFIX + shopId)
}
