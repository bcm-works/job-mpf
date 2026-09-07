// Create a group for the default user.
//
// POST /api/groups { title } -> 201 GroupRecord

import { kvPrefix } from '@/server/utils/kv'
import type { GroupRecord } from '@/server/types'
import { DEFAULT_USER_ID, groupKey, now, useKv } from '@/server/utils/store'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ title?: unknown }>(event)
  const title = typeof body?.title === 'string' ? body.title.trim() : ''
  if (!title || title.length > 80) {
    throw createError({ statusCode: 400, message: 'A group title of 1-80 characters is required.' })
  }

  const id = crypto.randomUUID()
  const timestamp = now()
  const group: GroupRecord = {
    id,
    title,
    userId: DEFAULT_USER_ID,
    movieIds: [],
    createdAt: timestamp,
    updatedAt: timestamp,
    status: 'active'
  }

  const kv = await useKv()
  await kv.set([...kvPrefix, groupKey(id)], group)

  event.node.res.statusCode = 201
  return group
})
