import { Avatar as MantineAvatar } from '@mantine/core'
import { User } from 'lucide-react'

export default function Avatar({ size = 10 }: { size?: number }) {
  const px = size * 4

  return (
    <MantineAvatar size={px} radius="xl" color="blue" variant="filled">
      <User size={px * 0.5} />
    </MantineAvatar>
  )
}
