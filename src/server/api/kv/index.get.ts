export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const limit = Math.min(Math.max(Number(query.limit ?? 100) || 100, 1), 500)

  const kv = await useKv()
  const entries: Array<{ key: string, value: unknown, versionstamp: string }> = []
  for await (const entry of kv.list({ prefix: kvPrefix }, { limit })) {
    const last = entry.key[entry.key.length - 1]
    entries.push({ key: String(last), value: entry.value, versionstamp: entry.versionstamp })
  }

  return { count: entries.length, entries }
})
