// Shared Deno KV access for Nuxt server routes.
//
// - On Deno Deploy (or any Deno runtime) uses the native `Deno.openKv()`,
//   which connects to the database assigned to the app - no URL or token needed.
// - During local `nuxt dev` (Node runtime) falls back to the official
//   `@deno/kv` npm package backed by a local SQLite file.
export type KvKeyPart = string | number | boolean | Uint8Array
export type KvKey = KvKeyPart[]

export interface KvGetResult<T> {
  value: T | null
  versionstamp: string | null
}

export interface KvInstance {
  get<T>(key: KvKey): Promise<KvGetResult<T>>
  set(key: KvKey, value: unknown): Promise<{ ok: boolean, versionstamp: string }>
  delete(key: KvKey): Promise<void>
  list<T>(selector: { prefix: KvKey }, options?: { limit?: number }): AsyncIterableIterator<{ key: KvKey, value: T, versionstamp: string }>
}

// All app data lives under a single prefix to avoid collisions.
export const kvPrefix: KvKey = ['app']

const KEY_PATTERN = /^[A-Za-z0-9:_-]{1,128}$/

export function assertValidKey(key: unknown): asserts key is string {
  if (typeof key !== 'string' || !KEY_PATTERN.test(key)) {
    throw createError({
      statusCode: 400,
      message: 'Invalid key. Use 1-128 chars: A-Z a-z 0-9 : _ -'
    })
  }
}

export function kvKey(key: string): KvKey {
  return [...kvPrefix, key]
}

let kvPromise: Promise<KvInstance> | null = null

export function useKv(): Promise<KvInstance> {
  if (!kvPromise) {
    kvPromise = openKvInstance()
  }
  return kvPromise
}

async function openKvInstance(): Promise<KvInstance> {
  const denoGlobal = (globalThis as { Deno?: { openKv: (path?: string) => Promise<KvInstance> } }).Deno
  if (denoGlobal?.openKv) {
    return await denoGlobal.openKv()
  }

  const { openKv } = await import('@deno/kv')
  const path = process.env.DENO_KV_PATH ?? '.data/kv.db'
  if (path !== ':memory:') {
    const { dirname } = await import('node:path')
    const { mkdir } = await import('node:fs/promises')
    await mkdir(dirname(path), { recursive: true })
  }
  return await openKv(path) as unknown as KvInstance
}
