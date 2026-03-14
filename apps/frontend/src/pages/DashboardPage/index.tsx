import { lazy } from 'react'

import DashboardPage from './page/DashboardPage'
import DashboardSkeleton from './skeletons/DashboardSkeleton'

import withSkeleton from '@/components/hoc/withSkeleton'

const DashboardPageWithSkeleton = withSkeleton(lazy(() => import('@/pages/DashboardPage/page/DashboardPage')), <DashboardSkeleton /> )

export {
  DashboardPage,
  DashboardPageWithSkeleton,
}
