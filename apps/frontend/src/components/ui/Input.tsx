import { TextInput } from '@mantine/core'

import { forwardRef, type InputHTMLAttributes } from 'react'

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'color'> {
  label?: string
  error?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, type = 'text', ...props }, ref) => (
    <TextInput ref={ref} type={type} label={label} error={error} {...props} />
  ),
)

Input.displayName = 'Input'

export default Input
