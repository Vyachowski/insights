import {
  Center,
  Code,
  Group,
  Paper,
  RingProgress,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core'
import Button from '@ui/Button'
import { AlertTriangle, CheckCircle2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'

import type { ApiError } from '@insights/contracts'

interface ErrorScreenProps {
  error: ApiError
}

export default function ErrorScreen({ error }: ErrorScreenProps) {
  const navigate = useNavigate()
  const [countdown, setCountdown] = useState(10)
  const [errorSent, setErrorSent] = useState(false)

  useEffect(() => {
    // TODO: Отправка ошибки администратору
    const sendErrorReport = async () => {
      try {
        console.error(error.message)
        setErrorSent(true)
      } catch (err) {
        console.error('Failed to send error report:', err)
      }
    }

    sendErrorReport()
  }, [error])

  useEffect(() => {
    if (countdown === 0) {
      navigate('/', { replace: true })
      return
    }

    const timer = setInterval(() => {
      setCountdown(prev => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [countdown, navigate])

  const handleReloadNow = () => {
    navigate('/', { replace: true })
  }

  return (
    <Center mih="100vh" p="md">
      <Paper withBorder shadow="xl" radius="lg" p="xl" w="100%" maw={520}>
        <Stack gap="lg">
          <Center>
            <ThemeIcon size={80} radius="lg" color="red" variant="light">
              <AlertTriangle size={40} />
            </ThemeIcon>
          </Center>

          <Stack gap={4} align="center">
            <Title order={2}>Критическая ошибка</Title>
            <Text c="dimmed">Приложение не может продолжить работу</Text>
          </Stack>

          <Code block color="red">{error.message}</Code>

          {errorSent && (
            <Group gap="xs" c="teal" justify="center">
              <CheckCircle2 size={18} />
              <Text size="sm">Отчет об ошибке отправлен администратору</Text>
            </Group>
          )}

          <Stack gap="sm" align="center">
            <RingProgress
              size={80}
              thickness={6}
              roundCaps
              sections={[{ value: countdown * 10, color: 'blue' }]}
              label={<Text ta="center" fw={700} size="lg">{countdown}</Text>}
            />
            <Text size="sm" c="dimmed">
              Автоматическая перезагрузка через {countdown} сек.
            </Text>
          </Stack>

          <Button size="lg" onClick={handleReloadNow}>
            Перезагрузить сейчас
          </Button>
        </Stack>
      </Paper>
    </Center>
  )
}
