// Rename a list.
//
// PATCH /api/lists/:id { title } -> ListRecord

import { kvPrefix } from '@/server/utils/kv'
import type { ListRecord } from '@/server/types'
import { listKey, now, useKv } from '@/server/utils/store'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, message: 'A list id is required.' })
  }

  const body = await readBody<{ title?: unknown }>(event)
  const title = typeof body?.title === 'string' ? body.title.trim() : ''
  if (!title || title.length > 80) {
    throw createError({ statusCode: 400, message: 'A list title of 1-80 characters is required.' })
  }

  const kv = await useKv()
  const key = [...kvPrefix, listKey(id)]
  const entry = await kv.get<ListRecord>(key)
  if (!entry.value || entry.value.status !== 'active') {
    throw createError({ statusCode: 404, message: `No list found with id "${id}".` })
  }

  const updated: ListRecord = { ...entry.value, title, updatedAt: now() }
  await kv.set(key, updated)
  return updated
})
