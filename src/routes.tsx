import { createBrowserRouter, Navigate, useLocation } from 'react-router'
import { HomePage } from '@/pages/HomePage'
import { LoginPage } from '@/pages/LoginPage'
import { AdminLoginPage } from '@/pages/AdminLoginPage'
import { SignupPage } from '@/pages/SignupPage'
import { MyPage } from '@/pages/MyPage'
import { MyLikedDongsPage } from '@/pages/MyLikedDongsPage'
import { MyLikedStoresPage } from '@/pages/MyLikedStoresPage'
import { ProfilePage } from '@/pages/ProfilePage'
import { MyAdminDongPage } from '@/pages/MyAdminDongPage'
import { UpgradeAdminPage } from '@/pages/UpgradeAdminPage'
import { KakaoCallbackPage } from '@/pages/KakaoCallbackPage'
import { PreferencePage } from '@/pages/PreferencePage'
import { PreferenceAnalyzingPage } from '@/pages/PreferenceAnalyzingPage'
import { PreferenceResultPage } from '@/pages/PreferenceResultPage'
import { JobFinderPage } from '@/pages/JobFinderPage'
import { ShopListPage } from '@/pages/ShopListPage'
import { ShopDetailPage } from '@/pages/ShopDetailPage'
import { CheckoutPage } from '@/pages/CheckoutPage'
import { CheckoutCompletePage } from '@/pages/CheckoutCompletePage'
import { OrderDetailPage } from '@/pages/OrderDetailPage'
import { MyOrdersPage } from '@/pages/MyOrdersPage'
import { AdminShopsPage } from '@/pages/AdminShopsPage'
import { AdminShopInfoPage } from '@/pages/AdminShopInfoPage'
import { AdminShopMenusPage } from '@/pages/AdminShopMenusPage'
import { AdminShopNewPage } from '@/pages/AdminShopNewPage'
import { AdminOrdersPage } from '@/pages/AdminOrdersPage'
import { AdminOrderNewPage } from '@/pages/AdminOrderNewPage'
import { AdminOrderHistoryPage } from '@/pages/AdminOrderHistoryPage'
import { AdminOrderHistoryDetailPage } from '@/pages/AdminOrderHistoryDetailPage'
import { NewsPage } from '@/pages/NewsPage'
import { DevIndexPage } from '@/dev/DevIndexPage'
import { TokensPreview } from '@/dev/TokensPreview'
import { UiBasicsPreview } from '@/dev/UiBasicsPreview'
import { UiCompositesPreview } from '@/dev/UiCompositesPreview'
import { LayoutPreview } from '@/dev/LayoutPreview'
import { HomePreview } from '@/dev/HomePreview'
import { InteractionsPreview } from '@/dev/InteractionsPreview'
import { IconsPreview } from '@/dev/IconsPreview'
import { HeaderAuthPreview } from '@/dev/HeaderAuthPreview'
import { WeatherPreview } from '@/dev/WeatherPreview'

function HomeRoute() {
  const location = useLocation()
  const params = new URLSearchParams(location.search)
  const hasOAuthResponse = [
    'signupRequired',
    'roleMismatch',
    'pendingApproval',
    'accessToken',
    'error',
    'error_description',
  ].some((key) => params.has(key))

  if (hasOAuthResponse) {
    return <Navigate to={`/auth/kakao/callback${location.search}`} replace />
  }

  return <HomePage />
}

export const router = createBrowserRouter([
  { path: '/', element: <HomeRoute /> },
  {
    path: '/finder/preference',
    children: [
      { index: true, element: <PreferencePage /> },
      { path: 'analyzing', element: <PreferenceAnalyzingPage /> },
      { path: 'result', element: <PreferenceResultPage /> },
    ],
  },
  { path: '/finder/job', element: <JobFinderPage /> },
  { path: '/shops', element: <ShopListPage /> },
  { path: '/shops/:id', element: <ShopDetailPage /> },
  { path: '/shops/:id/checkout', element: <CheckoutPage /> },
  { path: '/shops/:id/checkout/complete', element: <CheckoutCompletePage /> },
  { path: '/orders/:orderId', element: <OrderDetailPage /> },
  { path: '/mypage/orders', element: <MyOrdersPage /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/admin/login', element: <AdminLoginPage /> },
  { path: '/signup', element: <SignupPage /> },
  { path: '/mypage', element: <MyPage /> },
  { path: '/mypage/profile', element: <ProfilePage /> },
  { path: '/mypage/admin-dong', element: <MyAdminDongPage /> },
  { path: '/mypage/likes/dongs', element: <MyLikedDongsPage /> },
  { path: '/mypage/likes/stores', element: <MyLikedStoresPage /> },
  { path: '/mypage/upgrade-admin', element: <UpgradeAdminPage /> },
  { path: '/admin/shops', element: <AdminShopsPage /> },
  { path: '/admin/shops/info', element: <AdminShopInfoPage /> },
  { path: '/admin/shops/menus', element: <AdminShopMenusPage /> },
  { path: '/admin/shops/new', element: <AdminShopNewPage /> },
  { path: '/admin/orders', element: <AdminOrdersPage /> },
  { path: '/admin/orders/new', element: <AdminOrderNewPage /> },
  { path: '/admin/orders/history', element: <AdminOrderHistoryPage /> },
  { path: '/admin/orders/history/:id', element: <AdminOrderHistoryDetailPage /> },
  { path: '/news', element: <NewsPage /> },
  { path: '/auth/kakao/callback', element: <KakaoCallbackPage /> },

  // Dev previews (Phase 별 컴포넌트 카탈로그)
  { path: '/dev', element: <DevIndexPage /> },
  { path: '/dev/tokens', element: <TokensPreview /> },
  { path: '/dev/ui-basics', element: <UiBasicsPreview /> },
  { path: '/dev/ui-composites', element: <UiCompositesPreview /> },
  { path: '/dev/layout', element: <LayoutPreview /> },
  { path: '/dev/home', element: <HomePreview /> },
  { path: '/dev/interactions', element: <InteractionsPreview /> },
  { path: '/dev/icons', element: <IconsPreview /> },
  { path: '/dev/header-auth', element: <HeaderAuthPreview /> },
  { path: '/dev/weather', element: <WeatherPreview /> },
])
