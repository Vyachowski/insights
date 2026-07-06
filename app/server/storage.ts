import { AwsClient } from 'aws4fetch'

import { env, isStorageConfigured } from './env'

export { isStorageConfigured }

let client: AwsClient | null = null

// Lazy: constructing at import time would crash when storage is unconfigured
function getClient(): AwsClient {
  client ??= new AwsClient({
    accessKeyId: env.BUCKET_ACCESS_KEY_ID!,
    secretAccessKey: env.BUCKET_SECRET_ACCESS_KEY!,
    service: 's3',
    region: env.BUCKET_REGION,
  })
  return client
}

// aws4fetch signs requests but does not build S3 URLs — path-style by hand
function objectUrl(key: string): string {
  return `${env.BUCKET_ENDPOINT}/${env.BUCKET_NAME}/${key}`
}

/** Buffer on success, null strictly on 404, throws otherwise. */
export async function getObject(key: string): Promise<Buffer | null> {
  const res = await getClient().fetch(objectUrl(key))
  if (res.status === 404) return null
  if (!res.ok) throw new Error(`S3 GET ${key}: ${res.status}`)
  return Buffer.from(await res.arrayBuffer())
}

/** True if the object exists, false strictly on 404, throws otherwise. */
export async function headObject(key: string): Promise<boolean> {
  const res = await getClient().fetch(objectUrl(key), { method: 'HEAD' })
  if (res.status === 404) return false
  if (!res.ok) throw new Error(`S3 HEAD ${key}: ${res.status}`)
  return true
}

export async function putObject(key: string, body: Buffer): Promise<void> {
  const res = await getClient().fetch(objectUrl(key), {
    method: 'PUT',
    body: new Uint8Array(body),
    headers: { 'x-amz-content-sha256': 'UNSIGNED-PAYLOAD' },
  })
  if (!res.ok) throw new Error(`S3 PUT ${key}: ${res.status}`)
}

/** Deleting a missing object is a no-op; other failures throw. */
export async function deleteObject(key: string): Promise<void> {
  const res = await getClient().fetch(objectUrl(key), { method: 'DELETE' })
  if (!res.ok && res.status !== 404) {
    throw new Error(`S3 DELETE ${key}: ${res.status}`)
  }
}
