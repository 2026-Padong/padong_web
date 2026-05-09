import { createBrowserRouter } from 'react-router'
import { HomePage } from '@/pages/HomePage'
import { PreferencePage } from '@/pages/PreferencePage'
import { PreferenceAnalyzingPage } from '@/pages/PreferenceAnalyzingPage'
import { PreferenceResultPage } from '@/pages/PreferenceResultPage'
import { JobFinderPage } from '@/pages/JobFinderPage'
import { ShopListPage } from '@/pages/ShopListPage'
import { ShopDetailPage } from '@/pages/ShopDetailPage'
import { DevIndexPage } from '@/dev/DevIndexPage'
import { TokensPreview } from '@/dev/TokensPreview'
import { UiBasicsPreview } from '@/dev/UiBasicsPreview'
import { UiCompositesPreview } from '@/dev/UiCompositesPreview'
import { LayoutPreview } from '@/dev/LayoutPreview'
import { HomePreview } from '@/dev/HomePreview'
import { InteractionsPreview } from '@/dev/InteractionsPreview'
import { IconsPreview } from '@/dev/IconsPreview'

export const router = createBrowserRouter([
  { path: '/', element: <HomePage /> },
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

  // Dev previews (Phase 별 컴포넌트 카탈로그)
  { path: '/dev', element: <DevIndexPage /> },
  { path: '/dev/tokens', element: <TokensPreview /> },
  { path: '/dev/ui-basics', element: <UiBasicsPreview /> },
  { path: '/dev/ui-composites', element: <UiCompositesPreview /> },
  { path: '/dev/layout', element: <LayoutPreview /> },
  { path: '/dev/home', element: <HomePreview /> },
  { path: '/dev/interactions', element: <InteractionsPreview /> },
  { path: '/dev/icons', element: <IconsPreview /> },
])
