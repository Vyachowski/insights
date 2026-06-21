import { Button as MantineButton } from '@mantine/core'

import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size = 'sm' | 'md' | 'lg'

const variantProps: Record<Variant, { variant: string, color?: string }> = {
  primary: { variant: 'filled' },
  secondary: { variant: 'default' },
  ghost: { variant: 'subtle' },
  danger: { variant: 'filled', color: 'red' },
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: Variant
  size?: Size
  isLoading?: boolean
}

export default function Button({
  children,
  className,
  variant = 'primary',
  size = 'md',
  isLoading,
  disabled,
  ...props
}: ButtonProps) {
  const mapped = variantProps[variant]

  return (
    <MantineButton
      className={className}
      variant={mapped.variant}
      color={mapped.color}
      size={size}
      loading={isLoading}
      disabled={disabled}
      {...props}
    >
      {children}
    </MantineButton>
  )
}
