export default defineEventHandler(async (event) => {
  const rawKey = getRouterParam(event, 'key')
  assertValidKey(rawKey)

  const kv = await useKv()
  const entry = await kv.get(kvKey(rawKey))
  if (entry.value === null) {
    throw createError({ statusCode: 404, message: `No value stored for key "${rawKey}"` })
  }

  return { key: rawKey, value: entry.value, versionstamp: entry.versionstamp }
})
