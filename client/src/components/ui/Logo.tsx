import { twMerge } from 'tailwind-merge'

interface LogoProps {
  size?: number
  className?: string
  textSize?: 'xl' | '3xl' | '4xl'
}

export default function Logo({ size = 16, className, textSize = '3xl' }: LogoProps) {
  return (
    <div className={twMerge(`flex items-center justify-center w-${size} h-${size} rounded-2xl bg-linear-to-br from-emerald-500 to-teal-500`, className)}>
      <span className={twMerge('text-white text-3xl font-bold', textSize)}>I</span>
    </div>
  )
}
