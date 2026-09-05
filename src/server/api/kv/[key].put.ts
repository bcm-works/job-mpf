export default defineEventHandler(async (event) => {
  const rawKey = getRouterParam(event, 'key')
  assertValidKey(rawKey)

  const body = await readBody<{ value?: unknown }>(event)
  if (!body || !Object.hasOwn(body, 'value')) {
    throw createError({ statusCode: 400, message: 'Request body must be JSON with a "value" property' })
  }

  const kv = await useKv()
  const result = await kv.set(kvKey(rawKey), body.value)

  return { key: rawKey, versionstamp: result.versionstamp }
})
