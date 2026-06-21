import { Container, SimpleGrid, Skeleton, Stack } from '@mantine/core'

export default function DashboardSkeleton() {
  return (
    <Container size="xl" px={0}>
      <Stack gap="xl">
        <Skeleton height={160} radius="lg" />

        <SimpleGrid cols={{ base: 1, md: 3 }} spacing="lg">
          <Skeleton height={120} radius="lg" />
          <Skeleton height={120} radius="lg" />
          <Skeleton height={120} radius="lg" />
        </SimpleGrid>

        <Skeleton height={420} radius="lg" />
        <Skeleton height={560} radius="lg" />
      </Stack>
    </Container>
  )
}
