import { Paper } from '@mantine/core'

import type { ReactNode } from 'react'

type Size = 'sm' | 'md' | 'lg'

const sizeProps: Record<Size, { p: string, radius: string }> = {
  sm: { p: 'md', radius: 'md' },
  md: { p: 'lg', radius: 'lg' },
  lg: { p: 'xl', radius: 'lg' },
}

interface CardProps {
  children: ReactNode
  className?: string
  size?: Size
  as?: 'article' | 'section' | 'div'
}

export default function Card({ children, className, size = 'lg', as = 'article' }: CardProps) {
  const { p, radius } = sizeProps[size]

  return (
    <Paper component={as} className={className} p={p} radius={radius} withBorder shadow="sm">
      {children}
    </Paper>
  )
}
