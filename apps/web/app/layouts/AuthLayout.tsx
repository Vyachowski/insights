import { Box, Center } from '@mantine/core'
import { Outlet } from 'react-router'

export default function AuthLayout() {
  return (
    <Center mih="100vh" p="md">
      <Box w="100%" maw={420}>
        <Outlet />
      </Box>
    </Center>
  )
}
