import { lazy } from 'react'

import DashboardSkeleton from './skeletons/DashboardSkeleton'

import withSkeleton from '@/components/hoc/withSkeleton'

const DashboardPageWithSkeleton = withSkeleton(lazy(() => import('@/pages/DashboardPage/page/DashboardPage')), <DashboardSkeleton /> )

export {
  DashboardPageWithSkeleton,
}
