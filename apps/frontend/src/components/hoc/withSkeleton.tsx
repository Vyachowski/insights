import { Suspense } from 'react'

import type { ComponentType, ReactNode } from 'react'

const withSkeleton = <T extends object>(
  Component: ComponentType<T>,
  Skeleton: ReactNode,
) => {
  return (props: T) => (
    <Suspense fallback={Skeleton}>
      <Component {...props} />
    </Suspense>
  )
}

export default withSkeleton
