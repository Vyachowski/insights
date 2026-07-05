import { Center, Paper, Text } from '@mantine/core'

interface LogoProps {
  size?: number
  className?: string
  textSize?: 'xl' | '3xl' | '4xl'
}

const fontSize: Record<NonNullable<LogoProps['textSize']>, number> = {
  xl: 20,
  '3xl': 30,
  '4xl': 36,
}

export default function Logo({ size = 16, className, textSize = '3xl' }: LogoProps) {
  const px = size * 4

  return (
    <Paper className={className} w={px} h={px} radius="lg" bg="blue">
      <Center h="100%">
        <Text c="white" fw={700} fz={fontSize[textSize]}>I</Text>
      </Center>
    </Paper>
  )
}
