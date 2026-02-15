import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '../lib/utils'

import type { ReactNode } from 'react'

const cardVariants = cva(
  'backdrop-blur-xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 shadow-2xl',
  {
    variants: {
      size: {
        sm: 'p-4 rounded-lg',
        md: 'p-6 rounded-2xl',
        lg: 'p-8 rounded-2xl',
      },
    },
    defaultVariants: {
      size: 'lg',
    },
  },
)

interface CardProps extends VariantProps<typeof cardVariants> {
  children: ReactNode
  className?: string
}

export default function Card({ children, className, size }: CardProps) {
  return (
    <div className={cn(cardVariants({ size }), className)}>
      {children}
    </div>
  )
}
