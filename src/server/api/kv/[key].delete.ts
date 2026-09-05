export default defineEventHandler(async (event) => {
  const rawKey = getRouterParam(event, 'key')
  assertValidKey(rawKey)

  const kv = await useKv()
  await kv.delete(kvKey(rawKey))

  return { key: rawKey, deleted: true }
})
