import { Center, Loader, Stack, Text } from '@mantine/core'
import Logo from '@ui/Logo'

export default function SplashScreen() {
  return (
    <Center mih="100vh" p="md">
      <Stack align="center" gap="xl">
        <Logo size={20} textSize="4xl" />
        <Loader size="lg" />
        <Text c="dimmed" size="lg">Загрузка приложения...</Text>
      </Stack>
    </Center>
  )
}
