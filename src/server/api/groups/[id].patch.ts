// Rename a group.
//
// PATCH /api/groups/:id { title } -> GroupRecord

import { kvPrefix } from '@/server/utils/kv'
import type { GroupRecord } from '@/server/types'
import { groupKey, now, useKv } from '@/server/utils/store'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, message: 'A group id is required.' })
  }

  const body = await readBody<{ title?: unknown }>(event)
  const title = typeof body?.title === 'string' ? body.title.trim() : ''
  if (!title || title.length > 80) {
    throw createError({ statusCode: 400, message: 'A group title of 1-80 characters is required.' })
  }

  const kv = await useKv()
  const key = [...kvPrefix, groupKey(id)]
  const entry = await kv.get<GroupRecord>(key)
  if (!entry.value || entry.value.status !== 'active') {
    throw createError({ statusCode: 404, message: `No group found with id "${id}".` })
  }

  const updated: GroupRecord = { ...entry.value, title, updatedAt: now() }
  await kv.set(key, updated)
  return updated
})
