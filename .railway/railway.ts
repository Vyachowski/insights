import { bucket, defineRailway, github, preserve, project, service, volume } from 'railway/iac'

export default defineRailway(() => {
  const backendVolume = volume('@insights/backend-volume', {
    alerts: { usage: { '100': {}, '80': {}, '95': {} } },
    allowOnlineResize: true,
    region: 'europe-west4-drams3a',
    sizeMB: 5000,
  })
  const appBucket = bucket('bucket', { region: 'ams' })
  const dashboard = service('Dashboard', {
    source: github('Vyachowski/insights', { checkSuites: false }),
    build: '',
    // exec keeps node as PID 1, so SIGTERM reaches server.ts. Through npm every stop looks like a crash.
    start: 'NODE_ENV=production exec node --import tsx server.ts',
    replicas: { 'europe-west4-drams3a': 1 },
    deploy: { restartPolicyMaxRetries: 5 },
    domains: ['insights.vypro.ru'],
    networking: { privateNetworkEndpoint: 'insightss' },
    volumeMounts: { '/data': backendVolume },
    // A variable missing here is deleted by `railway config apply`. preserve() keeps its value in Railway.
    env: {
      ADMIN_EMAIL: preserve(),
      ADMIN_LASTNAME: preserve(),
      ADMIN_NAME: preserve(),
      ADMIN_PASSWORD: preserve(),
      ALLOWED_ORIGIN: preserve(),
      AWS_ACCESS_KEY_ID: preserve(),
      AWS_DEFAULT_REGION: preserve(),
      AWS_ENDPOINT_URL: preserve(),
      AWS_S3_BUCKET_NAME: preserve(),
      AWS_SECRET_ACCESS_KEY: preserve(),
      BUCKET_ACCESS_KEY_ID: preserve(),
      BUCKET_ENDPOINT: preserve(),
      BUCKET_NAME: preserve(),
      BUCKET_SECRET_ACCESS_KEY: preserve(),
      CITIES_CSV_URL: preserve(),
      DATABASE_PATH: preserve(),
      GUDOK_WEBHOOK_SECRET: preserve(),
      JWT_EXPIRATION: preserve(),
      JWT_MAX_AGE: preserve(),
      JWT_SECRET: preserve(),
      NODE_ENV: preserve(),
      PORT: preserve(),
      SITES_CSV_URL: preserve(),
      USER_EMAIL: preserve(),
      USER_LASTNAME: preserve(),
      USER_NAME: preserve(),
      USER_PASSWORD: preserve(),
      YANDEX_API_OAUTH_TOKEN: preserve(),
    },
  })

  return project('insights', {
    resources: [dashboard, backendVolume, appBucket],
  })
})
