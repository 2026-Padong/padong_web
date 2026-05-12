import { apiDelete, apiGet, apiPost, apiPut } from './client'
import type { ResponseDTO } from './contracts/auth'

// 백엔드 /menus — 메뉴 CRUD (JSON body + path variant)
export interface MenuResponse {
  id: number
  storeId: number
  menuInfo: string
  price: number
  soldOut: boolean
}

export interface MenuCreateRequest {
  storeId: number
  menuInfo: string
  price: number
}

export interface MenuUpdateRequest {
  menuInfo: string
  price: number
}

export async function fetchMenus(storeId: number): Promise<MenuResponse[]> {
  const res = await apiGet<ResponseDTO<MenuResponse[]>>('/menus', { storeId })
  return res.data
}

export async function createMenu(req: MenuCreateRequest): Promise<MenuResponse> {
  const res = await apiPost<ResponseDTO<MenuResponse>>('/menus', req)
  return res.data
}

export async function updateMenu(menuId: number, req: MenuUpdateRequest): Promise<MenuResponse> {
  const res = await apiPut<ResponseDTO<MenuResponse>>(`/menus/${menuId}`, req)
  return res.data
}

export async function deleteMenu(menuId: number): Promise<void> {
  await apiDelete<ResponseDTO<void>>(`/menus/${menuId}`)
}

// 품절 토글
export async function toggleMenuSoldOut(menuId: number, soldOut: boolean): Promise<MenuResponse> {
  const res = await apiPut<ResponseDTO<MenuResponse>>(
    `/menus/sold-out?menuId=${menuId}&soldOut=${soldOut}`,
    null,
  )
  return res.data
}
